#!/usr/bin/env bun

/**
 * Decision Capture Hook
 *
 * Captures architectural and process decisions during sessions.
 * Provides voice feedback when a decision is logged.
 *
 * Usage:
 *   echo '{"title": "...", "context": "...", "decision": "...", "alternatives": [...], "rationale": "..."}' | bun capture-decision.ts
 *
 * Can also be triggered from stop-hook.ts when decision patterns are detected.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PAI_DIR, HISTORY_DIR } from './lib/pai-paths';

interface Decision {
  title: string;
  context: string;
  decision: string;
  alternatives?: string[];
  rationale?: string;
  implications?: string[];
  tags?: string[];
  relevant_when?: string;  // Intent-based trigger for smart retrieval (like PAI Skills)
}

interface DecisionInput {
  session_id?: string;
  decision: Decision;
  source?: string;
  voice_feedback?: boolean;
}

interface VoiceConfig {
  enabled: boolean;
  voice: {
    id: string;
    name: string;
    language: string;
  };
}

function getYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getTimestamp(): string {
  const now = new Date();
  return now.toISOString()
    .replace(/:/g, '')
    .replace(/\..+/, '')
    .replace('T', '-');
}

function loadVoiceConfig(): VoiceConfig | null {
  const configPath = join(PAI_DIR, 'config/voice-feedback.json');
  try {
    if (!existsSync(configPath)) return null;
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Send voice feedback about the captured decision
 * Uses ElevenLabs MCP tools indirectly by outputting to stdout
 */
async function announceDecision(title: string): Promise<void> {
  const voiceConfig = loadVoiceConfig();

  if (!voiceConfig?.enabled) {
    console.error('[Decision] Voice feedback disabled');
    return;
  }

  // Output a special marker that stop-hook can pick up
  // The actual voice call will be handled by the stop-hook or a separate voice service
  const announcement = voiceConfig.voice.language === 'de'
    ? `Entscheidung dokumentiert: ${title}`
    : `Decision logged: ${title}`;

  // Write to a temp file that voice service can pick up
  const voiceQueuePath = join(PAI_DIR, 'temp/voice-queue.json');
  const voiceQueueDir = join(PAI_DIR, 'temp');

  if (!existsSync(voiceQueueDir)) {
    mkdirSync(voiceQueueDir, { recursive: true });
  }

  // Append to voice queue
  let queue: string[] = [];
  if (existsSync(voiceQueuePath)) {
    try {
      queue = JSON.parse(readFileSync(voiceQueuePath, 'utf-8'));
    } catch (e) {
      queue = [];
    }
  }

  queue.push(announcement);
  writeFileSync(voiceQueuePath, JSON.stringify(queue, null, 2));

  console.error(`[Decision] Voice queued: "${announcement}"`);
}

function formatDecisionDocument(input: DecisionInput): string {
  const timestamp = getTimestamp();
  const date = timestamp.substring(0, 10);
  const d = input.decision;

  const alternativesList = d.alternatives && d.alternatives.length > 0
    ? d.alternatives.map((a, i) => `${i + 1}. ${a}`).join('\n')
    : 'None documented';

  const implicationsList = d.implications && d.implications.length > 0
    ? d.implications.map((imp, i) => `- ${imp}`).join('\n')
    : 'None documented';

  const tags = d.tags ? d.tags.map(t => `\`${t}\``).join(' ') : '';

  return `---
capture_type: DECISION
timestamp: ${new Date().toISOString()}
session_id: ${input.session_id || 'unknown'}
title: "${d.title}"
source: ${input.source || 'session'}
tags: [${d.tags ? d.tags.map(t => `"${t}"`).join(', ') : ''}]
relevant_when: "${d.relevant_when || ''}"
---

# Decision: ${d.title}

**Date:** ${date}
**Session:** ${input.session_id || 'unknown'}
${tags ? `**Tags:** ${tags}` : ''}

**RELEVANT WHEN:** ${d.relevant_when || 'Not specified'}

---

## Context

${d.context}

---

## Decision

${d.decision}

---

## Alternatives Considered

${alternativesList}

---

## Rationale

${d.rationale || 'Not documented'}

---

## Implications

${implicationsList}

---

**Captured:** ${new Date().toISOString()}
`;
}

async function main() {
  try {
    // Read from stdin
    const stdinData = await Bun.stdin.text();
    if (!stdinData || stdinData.trim() === '') {
      console.error('[Decision] No input provided');
      process.exit(0);
    }

    const input: DecisionInput = JSON.parse(stdinData);

    if (!input.decision || !input.decision.title) {
      console.error('[Decision] Invalid decision format - title required');
      process.exit(0);
    }

    // Ensure decisions directory exists
    const yearMonth = getYearMonth();
    const decisionsDir = join(HISTORY_DIR, 'decisions', yearMonth);
    if (!existsSync(decisionsDir)) {
      mkdirSync(decisionsDir, { recursive: true });
    }

    // Generate filename
    const timestamp = getTimestamp();
    const titleSlug = input.decision.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30);
    const filename = `${timestamp}_DECISION_${titleSlug}.md`;

    // Format and write document
    const doc = formatDecisionDocument(input);
    const filepath = join(decisionsDir, filename);
    writeFileSync(filepath, doc);

    console.error(`[Decision] Captured decision to ${filepath}`);

    // Voice feedback if enabled
    if (input.voice_feedback !== false) {
      await announceDecision(input.decision.title);
    }

    // Output success for hook chain
    console.log(JSON.stringify({
      success: true,
      filepath,
      title: input.decision.title
    }));

    process.exit(0);

  } catch (error) {
    console.error(`[Decision] Error: ${error}`);
    process.exit(0);
  }
}

main();
