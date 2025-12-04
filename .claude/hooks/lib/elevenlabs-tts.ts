/**
 * ElevenLabs TTS Library - pai-voice CLI Wrapper
 *
 * This module wraps the pai-voice CLI for consistent voice output.
 * Uses CLI-First architecture per PAI CONSTITUTION.
 *
 * The pai-voice CLI reads voice_id from ~/.claude/.env as default,
 * ensuring all voice output uses the configured voice (Otti).
 *
 * Usage in hooks:
 *   import { speak, speakGerman } from './lib/elevenlabs-tts';
 *   await speak("Hallo, wie geht's?");
 *   await speakGerman("Guten Morgen!");
 */

import { execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { PAI_DIR } from './pai-paths';

// Path to pai-voice CLI
const PAI_VOICE = join(homedir(), '.claude', 'bin', 'pai-voice', 'pai-voice.ts');

// ============================================================================
// Configuration
// ============================================================================

// Load API key availability check
function isApiKeyConfigured(): boolean {
  // Check environment variable
  if (process.env.ELEVENLABS_API_KEY) {
    return true;
  }

  // Check ~/.claude/.env
  const envPath = join(PAI_DIR, '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      if (line.startsWith('ELEVENLABS_API_KEY=')) {
        const key = line.split('=')[1]?.trim();
        if (key && key.length > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

// ============================================================================
// Core TTS Function via pai-voice CLI
// ============================================================================

/**
 * Speak text using pai-voice CLI
 * Uses default voice from ~/.claude/.env (ELEVENLABS_VOICE_ID)
 */
async function speakViaCLI(text: string): Promise<{ success: boolean }> {
  if (!existsSync(PAI_VOICE)) {
    console.error(`❌ pai-voice CLI not found at: ${PAI_VOICE}`);
    return { success: false };
  }

  try {
    // Escape double quotes in text
    const escapedText = text.replace(/"/g, '\\"');

    console.error(`🎙️ Speaking via pai-voice: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    execSync(`"${PAI_VOICE}" say "${escapedText}" --play`, {
      timeout: 15000, // 15 second timeout
      stdio: 'ignore',
      shell: true
    });

    return { success: true };
  } catch (error) {
    console.error(`❌ pai-voice CLI error: ${error}`);
    return { success: false };
  }
}

// ============================================================================
// Public API (backward compatible)
// ============================================================================

/**
 * Speak text (uses configured default voice - Otti)
 */
export async function speak(text: string): Promise<{ success: boolean; voice: string; language: string }> {
  const result = await speakViaCLI(text);
  return {
    success: result.success,
    voice: 'Otti (via pai-voice)',
    language: 'de'
  };
}

/**
 * Speak text in German with Otti voice
 * (Same as speak() since pai-voice uses Otti by default)
 */
export async function speakGerman(text: string): Promise<{ success: boolean }> {
  return speakViaCLI(text);
}

/**
 * Speak text in English
 * Note: Still uses configured voice (Otti) - for different voice, modify ~/.claude/.env
 */
export async function speakEnglish(text: string): Promise<{ success: boolean }> {
  return speakViaCLI(text);
}

/**
 * Check if TTS is available (API key configured)
 */
export function isTTSAvailable(): boolean {
  return isApiKeyConfigured() && existsSync(PAI_VOICE);
}

/**
 * Get voice configuration
 */
export function getVoiceConfig() {
  return {
    cli: PAI_VOICE,
    cliExists: existsSync(PAI_VOICE),
    apiKeyConfigured: isApiKeyConfigured(),
  };
}

// ============================================================================
// Legacy exports for backward compatibility
// ============================================================================

export function detectLanguage(text: string): 'de' | 'en' {
  // Not needed anymore since pai-voice uses configured voice
  return 'de';
}

export function selectVoice(text: string): { voiceId: string; voiceName: string; language: 'de' | 'en' } {
  // Not needed anymore since pai-voice uses configured voice
  return {
    voiceId: '***REMOVED***',
    voiceName: 'Otti',
    language: 'de'
  };
}
