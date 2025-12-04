# Problem Solving Workflow

**Agent:** Dr. Quinn (Master Problem Solver)
**Voice ID:** `991lF4hc0xxfec4Y6B0i`

---

## Workflow Overview

This workflow applies systematic problem-solving techniques to find root causes and develop effective solutions. Dr. Quinn guides with Sherlock Holmes-like deduction, building toward dramatic "AHA!" moments of discovery.

---

## Core Method: Five Whys

The Five Whys technique traces symptoms back to root causes through iterative questioning.

```
PROBLEM → Why? → Cause 1 → Why? → Cause 2 → Why? → Cause 3 → Why? → Cause 4 → Why? → ROOT CAUSE
```

---

## Phases

### Phase 1: Define the Problem (3-5 min)

**Objective:** State the problem clearly and specifically

**Requirements for a Good Problem Statement:**
- Specific (not vague)
- Observable (not assumed)
- Measurable (if possible)
- Neutral (no blame)

**Bad:** "Our product is failing"
**Good:** "Customer complaints increased 40% in Q3, primarily about response times"

**Voice Script:**
```
"*adjusts metaphorical magnifying glass*

Before we hunt for causes, we must understand exactly what we're investigating.

Tell me - what is the problem? Be precise. I want facts, not interpretations.
What happened? When? How much? Who is affected?"
```

---

### Phase 2: Five Whys Investigation (15-20 min)

**Objective:** Trace the problem to its root cause

**Rules:**
- Base each "Why" on facts, not assumptions
- Stay focused on the causal chain
- Avoid blame - focus on systems
- Usually 5 iterations (sometimes 3-7)
- Stop when you reach something actionable

**Investigation Template:**

```
PROBLEM: [Clear statement]

WHY #1: Why did [problem] occur?
ANSWER: [Fact-based answer]

WHY #2: Why did [answer #1] happen?
ANSWER: [Fact-based answer]

WHY #3: Why did [answer #2] happen?
ANSWER: [Fact-based answer]

WHY #4: Why did [answer #3] happen?
ANSWER: [Fact-based answer]

WHY #5: Why did [answer #4] happen?
ANSWER: [ROOT CAUSE - actionable]
```

**Voice Scripts:**

```
# WHY #1
"WHY number one: Why did [problem] happen?

Take your time. What's the direct cause?"
```

```
# Building momentum
"Fascinating... but that's still a symptom. Let's go deeper.

WHY number [N]: Why did THAT happen?"
```

```
# Breakthrough
"*eyes widen*

AHA! THERE it is! Do you see it?

The root cause isn't [surface problem] - it's [root cause]!
Everything else was just symptoms pointing us here."
```

---

### Phase 3: Verify the Root Cause (5 min)

**Objective:** Confirm we've found the true root cause

**Verification Tests:**
1. **Logical Chain:** Does the causal chain make sense end-to-end?
2. **Reversal Test:** If we fix this, would the original problem be prevented?
3. **Evidence Check:** Do we have facts supporting this cause?

**Voice Script:**
```
"Now - let's verify our hypothesis.

If [root cause] is truly the culprit, then fixing it should prevent [original problem].

Let me trace it back:
- Fix [root cause] → Prevents [cause 4]
- Which prevents [cause 3]
- Which prevents [cause 2]
- Which prevents [cause 1]
- Which eliminates [problem]

Does that logic hold?"
```

---

### Phase 4: Develop Countermeasures (10 min)

**Objective:** Create solutions that address the root cause

**Countermeasure Criteria:**
- Addresses root cause (not just symptoms)
- Feasible to implement
- Sustainable over time
- Doesn't create new problems

**Types of Countermeasures:**
| Type | Purpose | Example |
|------|---------|---------|
| Containment | Stop immediate bleeding | Quick fix |
| Corrective | Address root cause | Process change |
| Preventive | Ensure it never recurs | Systemic improvement |

**Voice Script:**
```
"The crime is solved. Now for justice - permanent countermeasures.

For the root cause of [root cause], I recommend:

IMMEDIATE: [Containment action]
PERMANENT: [Corrective action]
PREVENTIVE: [Systemic change]

Which shall we implement?"
```

---

## Alternative Techniques

### Fishbone Diagram (Ishikawa)

When causes are unclear, categorize potential causes:

```
                    ┌─ People
                    ├─ Process
PROBLEM ←───────────├─ Technology
                    ├─ Environment
                    └─ Materials
```

### Theory of Constraints

When dealing with bottlenecks:
1. IDENTIFY the constraint
2. EXPLOIT - maximize its output
3. SUBORDINATE - align everything to the constraint
4. ELEVATE - invest to remove the constraint
5. REPEAT - find the new constraint

---

## Five Whys Example

**Problem:** "Our website conversion rate dropped 25% this month"

```
WHY #1: Why did conversions drop?
→ Fewer visitors are completing checkout

WHY #2: Why aren't they completing checkout?
→ Many abandon at the payment page

WHY #3: Why do they abandon at payment?
→ The page takes too long to load (8+ seconds)

WHY #4: Why is the page slow?
→ We added a new payment provider integration last month

WHY #5: Why is the integration slow?
→ It makes synchronous API calls instead of async

ROOT CAUSE: Synchronous payment API integration causing 8-second load times

COUNTERMEASURE: Refactor to async API calls
```

---

## Integration Points

| After Problem Solving | Hand Off To | Purpose |
|----------------------|-------------|---------|
| Root cause found | Carson | Brainstorm solutions |
| User-related cause | Maya | Deep user research |
| Business model issue | Victor | Strategic analysis |
| Need buy-in | Sophia | Craft the narrative |

---

## Voice Integration

```bash
# Opening investigation
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Excellent. A mystery to solve. Tell me - what exactly is the problem?", "voice_id": "991lF4hc0xxfec4Y6B0i", "title": "Dr. Quinn"}'

# Probing deeper
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Interesting... but we are still at the surface. WHY did that happen?", "voice_id": "991lF4hc0xxfec4Y6B0i", "title": "Dr. Quinn"}'

# The breakthrough
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "AHA! THERE it is! The root cause is not what you thought - it is THIS!", "voice_id": "991lF4hc0xxfec4Y6B0i", "title": "Dr. Quinn"}'
```

---

## Framework Reference

Full method library: `frameworks/solving-methods.csv`

Key techniques by scenario:
- **Finding root cause:** Five Whys, Fishbone
- **Complex systems:** Theory of Constraints, Systems Thinking
- **Manufacturing/Quality:** 8D, A3 Thinking
- **Creative problems:** TRIZ, Lateral Thinking
