#!/usr/bin/env bun

/**
 * initialize-session.ts
 *
 * Main session initialization hook that runs at the start of every Claude Code session.
 *
 * What it does:
 * - Checks if this is a subagent session (skips for subagents)
 * - Tests that stop-hook is properly configured
 * - Sets initial terminal tab title
 * - Sends voice greeting via ElevenLabs API (Ottie for German, Jarvis for English)
 * - Calls load-core-context.ts to inject core context into the session
 *
 * Setup:
 * 1. Set environment variables in settings.json:
 *    - DA: Your AI's name (e.g., "Kai", "Nova", "Assistant")
 *    - PAI_DIR: Path to your PAI directory (defaults to $HOME/.claude)
 * 2. Ensure ELEVENLABS_API_KEY is set in ~/.claude/.env
 * 3. Ensure load-core-context.ts exists in hooks/ directory
 * 4. Add both hooks to SessionStart in settings.json
 */

import { existsSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { PAI_DIR } from './lib/pai-paths';
import { speak, speakGerman, isTTSAvailable } from './lib/elevenlabs-tts';

// Voice feedback configuration interface
interface VoiceFeedbackConfig {
  enabled: boolean;
  voice: {
    id: string;
    name: string;
    stability: number;
    similarity_boost: number;
    speed: number;
  };
  lastToggled: string | null;
}

// Load voice feedback configuration
function loadVoiceFeedbackConfig(): VoiceFeedbackConfig | null {
  const configPath = join(PAI_DIR, 'config/voice-feedback.json');
  try {
    if (existsSync(configPath)) {
      const content = readFileSync(configPath, 'utf-8');
      return JSON.parse(content) as VoiceFeedbackConfig;
    }
  } catch (error) {
    console.error('Failed to load voice-feedback.json:', error);
  }
  return null;
}

// Debounce duration in milliseconds (prevents duplicate SessionStart events)
const DEBOUNCE_MS = 2000;
const LOCKFILE = join(tmpdir(), 'pai-session-start.lock');

/**
 * Send voice greeting using direct ElevenLabs API
 * Uses Ottie for German greetings, Jarvis for English
 */
async function sendVoiceGreeting(message: string, forceGerman: boolean = false) {
  // Load voice feedback config to check if enabled
  const voiceConfig = loadVoiceFeedbackConfig();

  // If voice feedback is disabled, skip notification
  if (!voiceConfig || !voiceConfig.enabled) {
    console.error('🔇 Voice feedback disabled - skipping voice notification');
    return;
  }

  // Check if TTS is available
  if (!isTTSAvailable()) {
    console.error('❌ ElevenLabs API key not configured - skipping voice notification');
    return;
  }

  try {
    if (forceGerman) {
      await speakGerman(message);
    } else {
      await speak(message);
    }
    console.error('✅ Voice greeting sent successfully');
  } catch (error) {
    console.error(`❌ Voice greeting failed: ${error}`);
  }
}

/**
 * Check if we're within the debounce window to prevent duplicate notifications
 * from the IDE firing multiple SessionStart events
 */
function shouldDebounce(): boolean {
  try {
    if (existsSync(LOCKFILE)) {
      const lockContent = readFileSync(LOCKFILE, 'utf-8');
      const lockTime = parseInt(lockContent, 10);
      const now = Date.now();

      if (now - lockTime < DEBOUNCE_MS) {
        // Within debounce window, skip this notification
        return true;
      }
    }

    // Update lockfile with current timestamp
    writeFileSync(LOCKFILE, Date.now().toString());
    return false;
  } catch (error) {
    // If any error, just proceed (don't break session start)
    try {
      writeFileSync(LOCKFILE, Date.now().toString());
    } catch {}
    return false;
  }
}

async function testStopHook() {
  const stopHookPath = join(PAI_DIR, 'hooks/stop-hook.ts');

  console.error('\n🔍 Testing stop-hook configuration...');

  // Check if stop-hook exists
  if (!existsSync(stopHookPath)) {
    console.error('❌ Stop-hook NOT FOUND at:', stopHookPath);
    return false;
  }

  // Check if stop-hook is executable
  try {
    const stats = statSync(stopHookPath);
    const isExecutable = (stats.mode & 0o111) !== 0;

    if (!isExecutable) {
      console.error('❌ Stop-hook exists but is NOT EXECUTABLE');
      return false;
    }

    console.error('✅ Stop-hook found and is executable');

    // Set initial tab title (customize with your AI's name via DA env var)
    const daName = process.env.DA || 'AI Assistant';
    const tabTitle = `${daName} Ready`;

    process.stderr.write(`\x1b]0;${tabTitle}\x07`);
    process.stderr.write(`\x1b]2;${tabTitle}\x07`);
    process.stderr.write(`\x1b]30;${tabTitle}\x07`);
    console.error(`📍 Set initial tab title: "${tabTitle}"`);

    return true;
  } catch (e) {
    console.error('❌ Error checking stop-hook:', e);
    return false;
  }
}

async function main() {
  try {
    // Check if this is a subagent session - if so, exit silently
    const claudeProjectDir = process.env.CLAUDE_PROJECT_DIR || '';
    const isSubagent = claudeProjectDir.includes('/.claude/agents/') ||
                      process.env.CLAUDE_AGENT_TYPE !== undefined;

    if (isSubagent) {
      // This is a subagent session - exit silently without notification
      console.error('🤖 Subagent session detected - skipping session initialization');
      process.exit(0);
    }

    // Check debounce to prevent duplicate voice notifications
    // (IDE extension can fire multiple SessionStart events)
    if (shouldDebounce()) {
      console.error('🔇 Debouncing duplicate SessionStart event');
      process.exit(0);
    }

    // Test stop-hook first (only for main sessions)
    const stopHookOk = await testStopHook();

    const daName = process.env.DA || 'AI Assistant';

    // Check voice config for personalized greeting
    const voiceConfig = loadVoiceFeedbackConfig();
    const isOttie = voiceConfig?.voice?.name?.toLowerCase() === 'ottie';

    // German greeting for Ottie, English for Jarvis
    // Default to German (Ottie) for this user's preference
    const useGerman = isOttie || voiceConfig?.voice?.name === undefined;

    const message = useGerman
      ? 'Moin! Neue Session gestartet. Ich bin bereit.'
      : 'Good morning. New session started. All systems ready.';

    if (!stopHookOk) {
      console.error('\n⚠️ STOP-HOOK ISSUE DETECTED - Tab titles may not update automatically');
    }

    // Note: PAI core context loading is handled by load-core-context.ts hook
    // which should run BEFORE this hook in settings.json SessionStart hooks

    // Send voice greeting using direct ElevenLabs API (bypasses buggy voice server)
    await sendVoiceGreeting(message, useGerman);
    process.exit(0);
  } catch (error) {
    console.error('SessionStart hook error:', error);
    process.exit(1);
  }
}

main();
