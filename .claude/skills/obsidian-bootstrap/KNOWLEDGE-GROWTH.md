# Knowledge Growth Discovery

This document details how to conversationally gauge the user's interest in developing deeper knowledge management habits after their basic capture workflow is set up.

## Purpose

This step is about planting seeds - not overwhelming users with systems. It helps determine what advanced content to include in their Getting Started guide.

## Discovery Questions

Use `AskUserQuestion` with beginner-friendly framing.

### Question 1: Interest Level

**Are you interested in building connections between your ideas?**

Framing: "Once you've been capturing for a while, something interesting happens - ideas start connecting. Some people love discovering these connections, others just want a simple place to write. There's no wrong answer."

Options:
- **Yes, that sounds exciting** - I want to see how my thinking connects over time
- **Maybe later** - Let me get comfortable with basics first
- **Keep it simple** - I just want a place to capture thoughts

### Question 2: Specific Topics (if YES or MAYBE LATER)

**What sounds most useful?** (multi-select)

Framing: "These are habits you might explore as your vault grows. No pressure to learn them all - just pick what sounds interesting:"

Options:
- **Connecting ideas** - Linking notes together so you can follow your train of thought
- **Creating hubs** - Having "index" notes that gather related ideas in one place
- **Growing ideas over time** - Building up important thoughts across multiple notes
- **Regular tending** - Periodically revisiting and connecting your notes
- **None of these yet** - Just show me the basics

## Response Mapping

Based on their interest level, set flags for the Getting Started guide:

| Response | Getting Started Section |
|----------|------------------------|
| "Yes, that sounds exciting" + selected topics | Include full "Growing Your Knowledge" section with selected topics |
| "Maybe later" + selected topics | Include brief "When You're Ready" teaser with links to tutorials |
| "Keep it simple" or "None of these yet" | Omit advanced sections, keep guide focused on capture |

## Concept Translation

Use plain language in the guide - avoid jargon:

| Technical Concept | Plain Language | What to include in guide |
|-------------------|---------------|-------------------------|
| Linking your thinking | "Connecting ideas" | How [[links]] work, when to link, link-first vs tag-first |
| Maps of Content (MOCs) | "Hub notes" or "Index notes" | Creating a note that gathers related notes |
| Evergreen notes | "Growing ideas" | Atomic notes that develop over time |
| Gardening/tending | "Regular tending" | Weekly/monthly review habits, serendipitous discovery |

## Reassurance Script

After collecting their preferences:

```
Perfect. The Getting Started guide will include some gentle
introductions to these ideas - no need to learn them now.
They'll make more sense once you have some notes to connect.
```

## Guide Content by Topic

See [GETTING-STARTED-TEMPLATE.md](GETTING-STARTED-TEMPLATE.md) for the full template content for each topic:

- **Connecting ideas** → "Connecting Ideas with Links" + "The Graph View" sections
- **Creating hubs** → "Hub Notes (Index Notes)" + "The Graph View" sections
- **Growing ideas over time** → "Growing Ideas Over Time" section
- **Regular tending** → "Regular Tending" section

## Tone Guidelines

When writing knowledge growth content:

- Emphasize patience: "no rush", "over months not days"
- Normalize the messy middle: "your graph will look sparse"
- Avoid perfectionism: "don't overthink it", "don't force it"
- Frame as optional: "habits to develop" not "steps to complete"
- Use concrete triggers: "after you have 20+ notes", "when you notice..."
