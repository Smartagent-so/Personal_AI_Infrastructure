/**
 * ElevenLabs TTS Library - Direct API Access for Hooks
 *
 * This module provides direct ElevenLabs API access for PAI hooks,
 * bypassing the voice-server for more stable operation.
 *
 * Features:
 * - Direct ElevenLabs API calls (non-streaming for stability)
 * - Automatic language detection (German/English)
 * - Voice selection: Ottie (DE) / Jarvis (EN)
 * - Audio playback via afplay (macOS)
 *
 * Usage in hooks:
 *   import { speak, speakGerman, speakEnglish } from './lib/elevenlabs-tts';
 *   await speak("Hallo, wie geht's?"); // Auto-detects German, uses Ottie
 *   await speakGerman("Guten Morgen!"); // Force German/Ottie
 *   await speakEnglish("Good morning!"); // Force English/Jarvis
 */

import { spawn } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { PAI_DIR } from './pai-paths';

// ============================================================================
// Configuration
// ============================================================================

// Voice IDs
const VOICES = {
  ottie: "***REMOVED***",   // German - Ostfriesisch
  jarvis: "pxQ5J1NTCCuhK7jrRa1d",  // English - PAI System Voice
} as const;

// Model - eleven_flash_v2_5 for ultra-low latency
const DEFAULT_MODEL = "eleven_flash_v2_5";

// Load API key from environment or .env file
let ELEVENLABS_API_KEY: string | undefined;

function loadApiKey(): string {
  if (ELEVENLABS_API_KEY) return ELEVENLABS_API_KEY;

  // Try environment variable first
  if (process.env.ELEVENLABS_API_KEY) {
    ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    return ELEVENLABS_API_KEY;
  }

  // Load from ~/.claude/.env
  const envPath = join(PAI_DIR, '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      if (line.startsWith('ELEVENLABS_API_KEY=')) {
        ELEVENLABS_API_KEY = line.split('=')[1].trim();
        return ELEVENLABS_API_KEY;
      }
    }
  }

  // Fallback to ~/.env
  const homeEnvPath = join(homedir(), '.env');
  if (existsSync(homeEnvPath)) {
    const envContent = readFileSync(homeEnvPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      if (line.startsWith('ELEVENLABS_API_KEY=')) {
        ELEVENLABS_API_KEY = line.split('=')[1].trim();
        return ELEVENLABS_API_KEY;
      }
    }
  }

  throw new Error('ELEVENLABS_API_KEY not found in environment or .env files');
}

// ============================================================================
// Language Detection
// ============================================================================

/**
 * Detect language based on German-specific patterns
 * Returns 'de' for German, 'en' for English
 */
export function detectLanguage(text: string): 'de' | 'en' {
  const germanPatterns = [
    // Pronouns
    /\b(ich|du|er|sie|es|wir|ihr|mich|dich|sich|mir|dir|ihm|uns|euch)\b/i,
    // Conjunctions
    /\b(und|oder|aber|wenn|dass|weil|denn|ob|als|damit|obwohl)\b/i,
    // Common verbs
    /\b(bin|bist|ist|sind|war|waren|habe|hast|hat|haben|hatte|werde|wird|werden|kann|kannst|können|muss|müssen|soll|sollte|will|wollen|mag|möchte|darf)\b/i,
    // Articles
    /\b(der|die|das|den|dem|des|ein|eine|einer|einem|einen|kein|keine|dieser|diese|dieses|welche|welcher)\b/i,
    // Adverbs
    /\b(nicht|auch|noch|schon|nur|sehr|mehr|viel|jetzt|hier|dort|heute|immer|wieder|gerade|eigentlich)\b/i,
    // Umlauts & ß (strong indicator)
    /[äöüß]/i,
    // Common German words & greetings
    /\b(hallo|moin|tschüss|danke|bitte|ja|nein|gut|schlecht|fertig|bereit|erledigt|verstanden|alles|klar)\b/i,
  ];

  let germanScore = 0;
  for (const pattern of germanPatterns) {
    if (pattern.test(text)) {
      germanScore++;
    }
  }

  // If 2+ German patterns match, consider it German
  return germanScore >= 2 ? 'de' : 'en';
}

/**
 * Select voice based on detected language
 */
export function selectVoice(text: string): { voiceId: string; voiceName: string; language: 'de' | 'en' } {
  const lang = detectLanguage(text);
  return lang === 'de'
    ? { voiceId: VOICES.ottie, voiceName: 'Ottie', language: 'de' }
    : { voiceId: VOICES.jarvis, voiceName: 'Jarvis', language: 'en' };
}

// ============================================================================
// TTS Generation
// ============================================================================

interface TTSOptions {
  voiceId?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
}

/**
 * Generate speech using ElevenLabs API
 * Returns audio as ArrayBuffer
 */
async function generateSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
  const apiKey = loadApiKey();
  const voiceId = options.voiceId || VOICES.jarvis;
  const model = options.model || DEFAULT_MODEL;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: model,
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarityBoost ?? 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return await response.arrayBuffer();
}

/**
 * Play audio buffer using afplay (macOS)
 */
async function playAudio(audioBuffer: ArrayBuffer): Promise<void> {
  const tempFile = `/tmp/pai-voice-${Date.now()}.mp3`;

  // Write audio to temp file
  await Bun.write(tempFile, audioBuffer);

  return new Promise((resolve, reject) => {
    const proc = spawn('/usr/bin/afplay', [tempFile]);

    proc.on('error', (error) => {
      // Cleanup temp file
      spawn('/bin/rm', ['-f', tempFile]);
      reject(error);
    });

    proc.on('exit', (code) => {
      // Cleanup temp file
      spawn('/bin/rm', ['-f', tempFile]);

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`afplay exited with code ${code}`));
      }
    });
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Speak text with automatic language detection
 * Uses Ottie for German, Jarvis for English
 */
export async function speak(text: string): Promise<{ success: boolean; voice: string; language: string }> {
  try {
    const { voiceId, voiceName, language } = selectVoice(text);
    console.error(`🎙️ Speaking with ${voiceName} (${language.toUpperCase()}): "${text.substring(0, 50)}..."`);

    const audio = await generateSpeech(text, { voiceId });
    await playAudio(audio);

    return { success: true, voice: voiceName, language };
  } catch (error) {
    console.error(`❌ TTS Error: ${error}`);
    return { success: false, voice: 'none', language: 'unknown' };
  }
}

/**
 * Speak text in German with Ottie voice
 */
export async function speakGerman(text: string): Promise<{ success: boolean }> {
  try {
    console.error(`🎙️ Speaking with Ottie (DE): "${text.substring(0, 50)}..."`);

    const audio = await generateSpeech(text, { voiceId: VOICES.ottie });
    await playAudio(audio);

    return { success: true };
  } catch (error) {
    console.error(`❌ TTS Error: ${error}`);
    return { success: false };
  }
}

/**
 * Speak text in English with Jarvis voice
 */
export async function speakEnglish(text: string): Promise<{ success: boolean }> {
  try {
    console.error(`🎙️ Speaking with Jarvis (EN): "${text.substring(0, 50)}..."`);

    const audio = await generateSpeech(text, { voiceId: VOICES.jarvis });
    await playAudio(audio);

    return { success: true };
  } catch (error) {
    console.error(`❌ TTS Error: ${error}`);
    return { success: false };
  }
}

/**
 * Check if TTS is available (API key configured)
 */
export function isTTSAvailable(): boolean {
  try {
    loadApiKey();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get voice configuration
 */
export function getVoiceConfig() {
  return {
    voices: VOICES,
    model: DEFAULT_MODEL,
    apiKeyConfigured: isTTSAvailable(),
  };
}
