#!/usr/bin/env bun

/**
 * Learnings Capture Hook
 *
 * Captures learnings and insights from sessions.
 * Can be triggered manually or integrated with SessionEnd.
 *
 * Usage:
 *   echo '{"session_id": "...", "learnings": [...]}' | bun capture-learnings.ts
 *
 * Or call with --interactive to prompt for learnings
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PAI_DIR, HISTORY_DIR } from './lib/pai-paths';

interface Learning {
  category: 'technical' | 'process' | 'tool' | 'insight' | 'bug' | 'pattern';
  title: string;
  description: string;
  context?: string;
  tags?: string[];
}

interface LearningsInput {
  session_id?: string;
  learnings: Learning[];
  source?: string;
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

function formatLearningDocument(input: LearningsInput): string {
  const timestamp = getTimestamp();
  const date = timestamp.substring(0, 10);

  const learningsMarkdown = input.learnings.map((l, i) => {
    const tags = l.tags ? l.tags.map(t => `\`${t}\``).join(' ') : '';
    return `### ${i + 1}. ${l.title}

**Category:** ${l.category}
${tags ? `**Tags:** ${tags}` : ''}

${l.description}

${l.context ? `> Context: ${l.context}` : ''}
`;
  }).join('\n---\n\n');

  return `---
capture_type: LEARNINGS
timestamp: ${new Date().toISOString()}
session_id: ${input.session_id || 'manual'}
count: ${input.learnings.length}
source: ${input.source || 'session'}
---

# Learnings - ${date}

${learningsMarkdown}

---

**Captured:** ${new Date().toISOString()}
`;
}

async function main() {
  try {
    // Check for --interactive flag
    const isInteractive = process.argv.includes('--interactive');

    let input: LearningsInput;

    if (isInteractive) {
      // Interactive mode - prompt for learnings
      console.log('\n📚 Learnings Capture\n');
      console.log('Enter learnings in JSON format or type "done" to finish:\n');

      // For now, just create a template
      input = {
        session_id: 'interactive',
        source: 'manual',
        learnings: [{
          category: 'insight',
          title: 'Template Learning',
          description: 'Replace this with actual learnings',
          tags: ['template']
        }]
      };
    } else {
      // Read from stdin
      const stdinData = await Bun.stdin.text();
      if (!stdinData || stdinData.trim() === '') {
        console.error('[Learnings] No input provided');
        process.exit(0);
      }

      input = JSON.parse(stdinData);
    }

    if (!input.learnings || input.learnings.length === 0) {
      console.error('[Learnings] No learnings to capture');
      process.exit(0);
    }

    // Ensure learnings directory exists
    const yearMonth = getYearMonth();
    const learningsDir = join(HISTORY_DIR, 'learnings', yearMonth);
    if (!existsSync(learningsDir)) {
      mkdirSync(learningsDir, { recursive: true });
    }

    // Generate filename
    const timestamp = getTimestamp();
    const sessionPart = input.session_id ? `_${input.session_id.substring(0, 8)}` : '';
    const filename = `${timestamp}_LEARNINGS${sessionPart}.md`;

    // Format and write document
    const doc = formatLearningDocument(input);
    const filepath = join(learningsDir, filename);
    writeFileSync(filepath, doc);

    console.error(`[Learnings] Captured ${input.learnings.length} learnings to ${filepath}`);
    process.exit(0);

  } catch (error) {
    console.error(`[Learnings] Error: ${error}`);
    process.exit(0);
  }
}

main();
