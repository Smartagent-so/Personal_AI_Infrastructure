#!/usr/bin/env bun

/**
 * Load Reference Files Hook (UserPromptSubmit)
 *
 * Scans user message for triggers that match on-demand reference files.
 * Loads Tier-3 files from CORE skill when keywords match.
 *
 * Follows PAI 3-Tier Progressive Disclosure:
 * - Tier 1: Frontmatter (always loaded)
 * - Tier 2: SKILL.md body (always loaded)
 * - Tier 3: Reference files (this hook - on-demand)
 *
 * Hook Event: UserPromptSubmit
 * Input: User message via stdin (JSON with user_message field)
 * Output: system-reminder with loaded reference content (if any)
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PAI_DIR } from './lib/pai-paths';

interface HookInput {
  user_message?: string;
  session_id?: string;
}

interface ReferenceFile {
  name: string;
  description: string;
  relevantWhen: string[];
  filepath: string;
  content: string;
}

const CORE_SKILLS_DIR = join(PAI_DIR, 'skills', 'CORE');

// Reference files to check (Tier-3 files with relevant_when)
const REFERENCE_FILES = [
  'ResponseFormat.md',
  'VoiceFeedback.md',
  'SecurityProtocols.md',
  'DelegationPatterns.md',
  'HistoryLookup.md'
];

/**
 * Extract relevant_when from file frontmatter
 */
function extractRelevantWhen(content: string): string[] {
  const match = content.match(/relevant_when:\s*"([^"]+)"/);
  if (!match) return [];

  // Split by comma and clean up
  return match[1]
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
}

/**
 * Extract name from frontmatter
 */
function extractName(content: string): string {
  const match = content.match(/name:\s*(\w+)/);
  return match ? match[1] : 'Unknown';
}

/**
 * Check if user message matches any trigger keyword
 */
function isRelevant(userMessage: string, triggers: string[]): boolean {
  const userLower = userMessage.toLowerCase();

  for (const trigger of triggers) {
    // Check for exact phrase match or keyword match
    if (userLower.includes(trigger)) {
      return true;
    }

    // Also check individual words in longer triggers
    const words = trigger.split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
      if (userLower.includes(word)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract the body content (after frontmatter)
 */
function extractBody(content: string): string {
  // Remove YAML frontmatter
  const bodyMatch = content.match(/^---[\s\S]*?---\n+([\s\S]*)$/);
  return bodyMatch ? bodyMatch[1].trim() : content;
}

/**
 * Find and load relevant reference files
 */
function findRelevantFiles(userMessage: string): ReferenceFile[] {
  const matches: ReferenceFile[] = [];

  for (const filename of REFERENCE_FILES) {
    const filepath = join(CORE_SKILLS_DIR, filename);

    if (!existsSync(filepath)) {
      continue;
    }

    try {
      const content = readFileSync(filepath, 'utf-8');
      const triggers = extractRelevantWhen(content);

      if (triggers.length > 0 && isRelevant(userMessage, triggers)) {
        matches.push({
          name: extractName(content),
          description: filename,
          relevantWhen: triggers,
          filepath,
          content: extractBody(content)
        });
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }

  // Limit to 2 files to avoid context bloat
  return matches.slice(0, 2);
}

/**
 * Format reminder output
 */
function formatReminder(files: ReferenceFile[]): string {
  if (files.length === 0) return '';

  const contents = files.map(f =>
    `## ${f.name}\n\n${f.content}`
  ).join('\n\n---\n\n');

  return `<system-reminder>
Reference Files Loaded: ${files.map(f => f.name).join(', ')}

${contents}
</system-reminder>`;
}

async function main() {
  try {
    // Read user message from stdin
    const stdinData = await Bun.stdin.text();

    if (!stdinData || stdinData.trim() === '') {
      process.exit(0);
    }

    let userMessage = '';

    try {
      const input: HookInput = JSON.parse(stdinData);
      userMessage = input.user_message || '';
    } catch {
      userMessage = stdinData.trim();
    }

    if (!userMessage) {
      process.exit(0);
    }

    // Find relevant reference files
    const matches = findRelevantFiles(userMessage);

    if (matches.length > 0) {
      const reminder = formatReminder(matches);
      console.log(reminder);

      console.error(`[LoadReferenceFiles] Loaded ${matches.length} file(s): ${matches.map(f => f.name).join(', ')}`);
    }

    process.exit(0);

  } catch (error) {
    console.error(`[LoadReferenceFiles] Error: ${error}`);
    process.exit(0);
  }
}

main();
