#!/usr/bin/env bun

/**
 * Hook: PreToolUse - Agent Start Voice
 * Trigger: Task tool mit subagent_type
 *
 * Spielt synchron eine Voice-Benachrichtigung ab wenn ein Agent gestartet wird.
 * Nutzt pai-voice CLI (CLI-First Architektur).
 */

import { execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

const PAI_VOICE = join(homedir(), '.claude', 'bin', 'pai-voice', 'pai-voice.ts');

// Agent-Namen für Voice (lesbar, deutsch)
const AGENT_NAMES: Record<string, string> = {
  'Explore': 'Erkunden',
  'Plan': 'Planer',
  'researcher': 'Recherche',
  'engineer': 'Engineer',
  'architect': 'Architekt',
  'designer': 'Designer',
  'perplexity-researcher': 'Perplexity Recherche',
  'gemini-researcher': 'Gemini Recherche',
  'claude-researcher': 'Claude Recherche',
  'claude-code-guide': 'Claude Code Guide',
  'general-purpose': 'General Purpose',
};

async function main() {
  // Read input from stdin
  let input = '';
  try {
    const decoder = new TextDecoder();
    const reader = Bun.stdin.stream().getReader();

    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 500);
    });

    const readPromise = (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        input += decoder.decode(value, { stream: true });
      }
    })();

    await Promise.race([readPromise, timeoutPromise]);
  } catch (e) {
    console.error('Failed to read input:', e);
    process.exit(0);
  }

  if (!input) {
    process.exit(0);
  }

  let data: any;
  try {
    data = JSON.parse(input);
  } catch (e) {
    console.error('Invalid JSON input');
    process.exit(0);
  }

  // Nur bei Task-Tool
  if (data.tool_name !== 'Task') {
    process.exit(0);
  }

  const agentType = data.tool_input?.subagent_type;
  if (!agentType) {
    process.exit(0);
  }

  // Voice-Text erstellen
  const agentName = AGENT_NAMES[agentType] || agentType;
  const message = `Starte ${agentName} Agent`;

  console.error(`🎙️ Agent-Start Voice: "${message}"`);

  // Synchron Voice abspielen (blockiert max 5 Sek)
  try {
    execSync(`"${PAI_VOICE}" say "${message}" --play`, {
      timeout: 5000,
      stdio: 'ignore',
      shell: true
    });
    console.error(`✅ Voice played: ${message}`);
  } catch (e) {
    // Voice-Fehler sollten Hook nicht crashen
    console.error('Voice failed (non-blocking):', e);
  }
}

main().catch(console.error);
