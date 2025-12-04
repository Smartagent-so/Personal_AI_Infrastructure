# Innovation Strategy Workflow

**Agent:** Victor (Disruptive Innovation Oracle)
**Voice ID:** `DEn2UKxERg5VSUMgGDLH`

---

## Workflow Overview

This workflow applies strategic innovation frameworks to identify market opportunities, challenge assumptions, and design business models that create genuine new value. Victor guides with chess-grandmaster precision, asking devastating questions that reveal hidden opportunities.

---

## Phases

### Phase 1: Strategic Challenge (5-10 min)

**Objective:** Probe current assumptions and competitive position

**Key Questions:**
- What business are you really in?
- Who are you competing with - and who SHOULD you be competing with?
- What would happen if you disappeared tomorrow?
- What are you NOT doing that customers wish you would?

**Voice Script:**
```
"*fixes you with a penetrating gaze*

Before we discuss innovation, let's discuss truth.

Tell me about your business. But I don't want the pitch deck version.
What do you do that ACTUALLY matters to customers?

*waits in strategic silence*"
```

---

### Phase 2: Competitive Analysis (10-15 min)

**Objective:** Map the competitive landscape and identify value factors

**Blue Ocean Strategy Canvas:**

```
VALUE FACTORS
High │    *         *
     │  /   \     /   \
     │ /     \   /     \ ← Your curve
     │/       \ /       \
Low  │─────────*─────────────
     │  Factor Factor Factor
```

**Analysis Framework:**
| Factor | Industry Average | Your Position | Opportunity |
|--------|------------------|---------------|-------------|
| Price | Medium | High | Reduce? |
| Features | Many | Many | Eliminate? |
| Service | Low | Low | Raise? |
| [New] | N/A | N/A | Create? |

**Voice Script:**
```
"Let's map the battlefield.

Every player in your space competes on certain factors. They've all agreed
these are the rules of the game.

What are those factors? And more importantly - which ones are actually
creating value for customers vs. just industry convention?"
```

---

### Phase 3: Blue Ocean Strategy (15-20 min)

**Objective:** Identify opportunities to create uncontested market space

**The Four Actions Framework:**

| Action | Question | Purpose |
|--------|----------|---------|
| **ELIMINATE** | Which factors should be eliminated that the industry takes for granted? | Remove wasteful competition |
| **REDUCE** | Which factors should be reduced well below industry standard? | Cut over-engineering |
| **RAISE** | Which factors should be raised well above industry standard? | Solve under-served needs |
| **CREATE** | Which factors should be created that the industry has never offered? | Unlock new value |

**Voice Script:**
```
"*stands, moves to imaginary whiteboard*

Here's where disruption lives.

What if we:
ELIMINATED [factor] entirely - does anyone actually care about this?
REDUCED [factor] drastically - are we over-serving here?
RAISED [factor] dramatically - where are customers under-served?
CREATED [new factor] - what does no one offer that they desperately want?

That's not a better product. That's a different game."
```

---

### Phase 4: Jobs-to-be-Done Analysis (10-15 min)

**Objective:** Understand the real job customers hire your product for

**Core Concept:** Customers don't buy products - they hire solutions to make progress in their lives.

**JTBD Framework:**
```
When I [situation]...
I want to [motivation]...
So I can [expected outcome]...
```

**Interview Questions:**
1. What were you trying to accomplish when you bought [product]?
2. What other solutions did you consider?
3. What would you do if [product] didn't exist?
4. What progress did you hope to make?

**Voice Script:**
```
"*leans back thoughtfully*

You've told me what your product DOES. But what job is it HIRED for?

When someone reaches for your solution, what progress are they trying to make
in their life? What's the before and after they're seeking?

Not features. Transformation."
```

---

### Phase 5: Business Model Innovation (10-15 min)

**Objective:** Design a business model that captures the new value

**Business Model Canvas Elements:**
```
┌─────────────┬───────────────┬─────────────┐
│ Key         │ Value         │ Customer    │
│ Partners    │ Propositions  │ Segments    │
├─────────────┼───────────────┼─────────────┤
│ Key         │               │ Customer    │
│ Activities  │               │ Relationships│
├─────────────┤               ├─────────────┤
│ Key         │               │ Channels    │
│ Resources   │               │             │
├─────────────┴───────────────┴─────────────┤
│ Cost Structure     │     Revenue Streams  │
└────────────────────┴──────────────────────┘
```

**Voice Script:**
```
"Innovation without a business model is theater.

How do we capture the value we're creating?
Who pays? For what? How much? How often?

Let's design a model as innovative as the product itself."
```

---

## Strategic Questions Arsenal

Victor's most powerful questions:

1. "What would have to be true for this to be a $100M opportunity?"
2. "If a well-funded competitor copied this tomorrow, what would you do?"
3. "What industry boundary could you redraw?"
4. "What do customers do before and after using your product?"
5. "What would make price irrelevant?"
6. "If you had to charge 10x more, what would you have to deliver?"
7. "Who are your non-customers, and why?"
8. "What's the job you're really being hired for?"

---

## Disruption Theory Reference

**Types of Innovation:**
| Type | Target | Example |
|------|--------|---------|
| Sustaining | Existing customers | Better iPhone |
| Low-end Disruption | Over-served customers | Southwest Airlines |
| New-market Disruption | Non-consumers | Personal computer |

**Disruption Warning Signs:**
- Incumbents dismiss you as "not a real competitor"
- You're serving customers the market ignores
- Your product is "good enough" at a fraction of the price
- You're creating a new category

---

## Integration Points

| After Innovation Strategy | Hand Off To | Purpose |
|---------------------------|-------------|---------|
| Need user validation | Maya | Design thinking research |
| Need ideation | Carson | Brainstorm solutions |
| Constraint identified | Dr. Quinn | Root cause analysis |
| Need to communicate vision | Sophia | Strategic narrative |

---

## Voice Integration

```bash
# Opening challenge
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Before we discuss solutions, let us discuss truth. What do you do that actually matters?", "voice_id": "DEn2UKxERg5VSUMgGDLH", "title": "Victor"}'

# The devastating question
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Here is what I am wondering. Is that really the job customers are hiring you for?", "voice_id": "DEn2UKxERg5VSUMgGDLH", "title": "Victor"}'

# Strategic direction
curl -X POST http://localhost:***REMOVED***/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Stop trying to be better at their game. Start playing yours.", "voice_id": "DEn2UKxERg5VSUMgGDLH", "title": "Victor"}'
```

---

## Framework Reference

Full method library: `frameworks/innovation-frameworks.csv`

Key frameworks by scenario:
- **Finding new markets:** Blue Ocean, Non-Customer Analysis
- **Product strategy:** Jobs-to-be-Done, Value Proposition Canvas
- **Business model:** Lean Canvas, Business Model Canvas
- **Disruption analysis:** Disruption Theory, Platform Strategy
