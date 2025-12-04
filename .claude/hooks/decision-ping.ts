#!/usr/bin/env bun

/**
 * Decision Ping Hook (UserPromptSubmit)
 *
 * Scans past decisions for relevance to current user input.
 * Outputs reminders BEFORE Claude responds (like PAI Skill loading).
 *
 * Follows PAI principles:
 * - Intent-based matching (RELEVANT WHEN clause)
 * - Progressive disclosure (only relevant decisions)
 * - Lean implementation (simple file scanning)
 *
 * Hook Event: UserPromptSubmit
 * Input: User message via stdin (JSON with user_message field)
 * Output: system-reminder with relevant decisions (if any)
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PAI_DIR, HISTORY_DIR } from './lib/pai-paths';

interface HookInput {
  user_message?: string;
  session_id?: string;
}

interface DecisionMatch {
  title: string;
  date: string;
  relevantWhen: string;
  filepath: string;
}

/**
 * Extract RELEVANT WHEN clause from decision file
 */
function extractRelevantWhen(content: string): string | null {
  // Try YAML frontmatter first
  const yamlMatch = content.match(/relevant_when:\s*"([^"]+)"/);
  if (yamlMatch) return yamlMatch[1];

  // Try markdown format
  const mdMatch = content.match(/\*\*RELEVANT WHEN:\*\*\s*(.+?)(?:\n\n|\n---)/s);
  if (mdMatch) return mdMatch[1].trim();

  return null;
}

/**
 * Extract title from decision file
 */
function extractTitle(content: string): string | null {
  const yamlMatch = content.match(/title:\s*"([^"]+)"/);
  if (yamlMatch) return yamlMatch[1];

  const mdMatch = content.match(/# Decision:\s*(.+)/);
  if (mdMatch) return mdMatch[1].trim();

  return null;
}

/**
 * Extract date from decision file
 */
function extractDate(content: string): string {
  const match = content.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : 'unknown';
}

/**
 * Check if user message is semantically relevant to RELEVANT WHEN clause
 * Simple keyword/phrase matching - Claude will do semantic understanding
 */
function isRelevant(userMessage: string, relevantWhen: string): boolean {
  const userLower = userMessage.toLowerCase();
  const relevantLower = relevantWhen.toLowerCase();

  // Split RELEVANT WHEN into phrases (by comma, OR, and)
  const phrases = relevantLower
    .split(/,|\bor\b|\band\b/)
    .map(p => p.trim())
    .filter(p => p.length > 2);

  // Check if any phrase matches
  for (const phrase of phrases) {
    // Extract key words from phrase (remove common words)
    const keywords = phrase
      .split(/\s+/)
      .filter(w => !['discussing', 'troubleshooting', 'choosing', 'between', 'about', 'when', 'the', 'a', 'an', 'is', 'are', 'for', 'to', 'of', 'in', 'on', 'with'].includes(w))
      .filter(w => w.length > 2);

    // Check if any keyword appears in user message
    for (const keyword of keywords) {
      if (userLower.includes(keyword)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Scan all decisions for relevance
 */
function findRelevantDecisions(userMessage: string): DecisionMatch[] {
  const matches: DecisionMatch[] = [];
  const decisionsBase = join(HISTORY_DIR, 'decisions');

  if (!existsSync(decisionsBase)) {
    return matches;
  }

  // Scan all month directories
  const monthDirs = readdirSync(decisionsBase)
    .filter(d => d.match(/^\d{4}-\d{2}$/))
    .sort()
    .reverse(); // Most recent first

  for (const monthDir of monthDirs) {
    const monthPath = join(decisionsBase, monthDir);
    const files = readdirSync(monthPath)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();

    for (const file of files) {
      const filepath = join(monthPath, file);
      try {
        const content = readFileSync(filepath, 'utf-8');
        const relevantWhen = extractRelevantWhen(content);

        if (relevantWhen && isRelevant(userMessage, relevantWhen)) {
          const title = extractTitle(content) || file;
          const date = extractDate(content);

          matches.push({
            title,
            date,
            relevantWhen,
            filepath
          });
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }

    // Limit to 3 most relevant decisions to avoid context bloat
    if (matches.length >= 3) break;
  }

  return matches;
}

/**
 * Format reminder output
 */
function formatReminder(matches: DecisionMatch[]): string {
  if (matches.length === 0) return '';

  const reminders = matches.map(m =>
    `- **${m.title}** (${m.date})\n  Relevant because: ${m.relevantWhen.substring(0, 100)}${m.relevantWhen.length > 100 ? '...' : ''}`
  ).join('\n');

  return `<system-reminder>
Decision Ping: ${matches.length} relevante Entscheidung(en) gefunden

${reminders}

Details abrufen: rg "title" ~/.claude/history/decisions/
</system-reminder>`;
}

async function main() {
  try {
    // Read user message from stdin
    const stdinData = await Bun.stdin.text();

    if (!stdinData || stdinData.trim() === '') {
      // No input, exit silently
      process.exit(0);
    }

    let userMessage = '';

    try {
      // Try to parse as JSON (standard hook format)
      const input: HookInput = JSON.parse(stdinData);
      userMessage = input.user_message || '';
    } catch {
      // If not JSON, treat as plain text
      userMessage = stdinData.trim();
    }

    if (!userMessage) {
      process.exit(0);
    }

    // Find relevant decisions
    const matches = findRelevantDecisions(userMessage);

    if (matches.length > 0) {
      // Output reminder to stdout (will be injected into context)
      const reminder = formatReminder(matches);
      console.log(reminder);

      console.error(`[DecisionPing] Found ${matches.length} relevant decision(s)`);
    }

    process.exit(0);

  } catch (error) {
    console.error(`[DecisionPing] Error: ${error}`);
    process.exit(0);
  }
}

main();
