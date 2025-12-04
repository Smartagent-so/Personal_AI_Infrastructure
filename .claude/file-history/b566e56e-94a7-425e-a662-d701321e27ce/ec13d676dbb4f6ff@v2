#!/usr/bin/env bun
/**
 * CISSpeak - Voice output for CIS agents
 *
 * Usage:
 *   bun CISSpeak.ts <agent> "<message>"
 *   bun CISSpeak.ts carson "YES AND! Building on that idea..."
 *   bun CISSpeak.ts quinn "AHA! The root cause is..."
 *
 * Agents: carson, maya, quinn, victor, sophia
 */

const VOICE_SERVER = process.env.VOICE_SERVER || "http://localhost:***REMOVED***";

const AGENTS: Record<string, { voiceId: string; title: string }> = {
  carson: { voiceId: "i0VhsMuWeqedVY40e6UN", title: "Carson" },
  maya: { voiceId: "T720RsqorTx4ZZWohrNN", title: "Maya" },
  quinn: { voiceId: "991lF4hc0xxfec4Y6B0i", title: "Dr. Quinn" },
  victor: { voiceId: "DEn2UKxERg5VSUMgGDLH", title: "Victor" },
  sophia: { voiceId: "cfc7wVYq4gw4OpcEEAom", title: "Sophia" },
};

async function speak(agent: string, message: string): Promise<void> {
  const agentConfig = AGENTS[agent.toLowerCase()];

  if (!agentConfig) {
    console.error(`Unknown agent: ${agent}`);
    console.error(`Available agents: ${Object.keys(AGENTS).join(", ")}`);
    process.exit(1);
  }

  if (!message || message.length === 0) {
    console.error("Message cannot be empty");
    process.exit(1);
  }

  // Voice server has 500 char limit
  if (message.length > 500) {
    console.error(`Message too long (${message.length} chars). Max 500 characters.`);
    process.exit(1);
  }

  try {
    const response = await fetch(`${VOICE_SERVER}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        voice_id: agentConfig.voiceId,
        title: agentConfig.title,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log(`${agentConfig.title}: "${message}"`);
    } else {
      console.error(`Error: ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Failed to connect to voice server: ${error}`);
    console.error(`Make sure the voice server is running at ${VOICE_SERVER}`);
    process.exit(1);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
CISSpeak - Voice output for CIS agents

Usage:
  bun CISSpeak.ts <agent> "<message>"

Agents:
  carson  - Brainstorming Specialist (Dan voice)
  maya    - Design Thinking Maestro (Katie voice)
  quinn   - Problem Solver (Henry voice)
  victor  - Innovation Oracle (Luke voice)
  sophia  - Master Storyteller (Nayva voice)

Examples:
  bun CISSpeak.ts carson "YES AND! Building on that brilliant idea..."
  bun CISSpeak.ts quinn "AHA! The root cause is not what you thought!"
  bun CISSpeak.ts sophia "Every brand has a story waiting to be told."

Environment:
  VOICE_SERVER - Voice server URL (default: http://localhost:***REMOVED***)
`);
  process.exit(0);
}

const [agent, ...messageParts] = args;
const message = messageParts.join(" ");

speak(agent, message);
