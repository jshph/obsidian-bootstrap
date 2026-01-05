# Getting Started Template

Generate a personalized, **beginner-friendly** `Getting-Started.md`. Use plain language, focus on building habits, and reassure users they can't mess this up.

---

```markdown
# Welcome to [VAULT_NAME]

You're all set up. This guide will help you build a simple note-taking habit - no complex system required.

## The Only Rule

**Just capture.** When you have a thought, write it down. Don't worry about where it goes or how it's organized. That comes naturally over time.

## Your First Week

Here's a gentle path to building your note-taking habit:

### Day 1: Capture something
- Press `Cmd/Ctrl + D` to open today's note
- Write down one thought, idea, or task
- That's it. You're using Obsidian.

### Days 2-3: Keep capturing
- Open your daily note each morning
- Jot down what's on your mind
- Don't organize - just write

### Days 4-7: Notice patterns
- You might notice recurring topics
- Some notes might want to link to others
- That's natural - follow that instinct when it comes

### After Week 1
- Review your `inbox/` folder
- Move notes that feel related into groups
- Create your first [[link]] between notes
- See how connections emerge on their own

## Your Setup

| | |
|---|---|
| **Location** | [VAULT_PATH] |
| **Plugins** | [PLUGIN_COUNT] tools ready to help |
| **Theme** | Minimal (easy on the eyes) |

## Where Your Notes Live

[INCLUDE ONE - use friendly descriptions]

### Simple Inbox Style
| Folder | What goes here |
|--------|----------------|
| `inbox/` | Everything starts here - quick thoughts, ideas, tasks |
| `templates/` | Starter templates to speed up note creation |

When your inbox gets full, you'll naturally want to organize. That's when you create new folders - not before.

### Separate Folders Style
| Folder | What goes here |
|--------|----------------|
| `work/` | Job-related notes and projects |
| `personal/` | Life stuff, ideas, journals |
| `inbox/` | Quick capture when you're not sure |
| `templates/` | Starter templates |

### Minimal Style
| Folder | What goes here |
|--------|----------------|
| `inbox/` | Quick capture |
| `templates/` | Note templates |

Everything else? Just create notes. Use [[links]] and #tags to connect them - no folders needed.

[END FOLDER SECTION]

## Keyboard Shortcuts Worth Learning

> **Note:** On Mac, use `Cmd`. On Windows/Linux, use `Ctrl`.

Start with just these three:

| Shortcut | What it does |
|----------|--------------|
| `Cmd/Ctrl + D` | Open today's note (your daily scratch pad) |
| `Cmd/Ctrl + O` | Quick open any note by typing its name |
| `Cmd/Ctrl + Enter` | Check off a task |

Once those feel natural, try:

| Shortcut | What it does |
|----------|--------------|
| `Cmd/Ctrl + Shift + N` | QuickAdd menu (capture, new note, new meeting) |
| `Cmd/Ctrl + T` | Insert a template |
| `Cmd/Ctrl + Shift + K` | Link to another note |

[FULL HOTKEY REFERENCE - collapsed or at end]

## Your Tools (Plugins)

These work in the background to make your notes more useful. You don't need to configure anything yet - just know they're there.

[IF dataview INSTALLED]
### Dataview - Find your notes
Automatically creates lists and tables from your notes. Example: see all notes tagged #idea or all unchecked tasks. You'll learn this naturally as you need it.

[IF templater-obsidian INSTALLED]
### Templater - Speed up note creation
Press `Cmd/Ctrl + T` to insert a template. Templates auto-fill dates and titles so you can start writing faster.

[IF obsidian-tasks-plugin INSTALLED]
### Tasks - Track your to-dos
Write `- [ ] Do something` and it becomes a checkbox. Press `Cmd/Ctrl + Shift + Enter` to mark it done. Tasks can have due dates too: `- [ ] Call mom 📅 2024-01-15`

[IF quickadd INSTALLED]
### QuickAdd - Instant capture
Press `Cmd/Ctrl + Shift + N` to open the QuickAdd menu, or use these direct shortcuts:

[GENERATE TABLE BASED ON CONFIGURED CHOICES - include only what was set up]

| Shortcut | Action | What it does |
|----------|--------|--------------|
| `Cmd/Ctrl + Shift + C` | 📥 Quick Capture | Jot a thought → saved to today's inbox |
| `Cmd/Ctrl + Shift + T` | ✅ Quick Task | Add a task → saved as checkbox to inbox |
| `Cmd/Ctrl + Shift + M` | 🗓️ New Meeting | Create meeting notes with agenda template |
| `Cmd/Ctrl + Shift + J` | 📝 Journal Entry | Start a journal entry from template |
| `Cmd/Ctrl + Shift + I` | 💡 Quick Idea | Capture an idea to inbox |
| `Cmd/Ctrl + Shift + R` | 📚 Reading Note | Create a reading note from template |
| `Cmd/Ctrl + Shift + U` | 📖 Study Note | Create a study note from template |

[END TABLE - only include rows for choices that were configured]

Each takes ~3 seconds. Press the shortcut, type your thought, press Enter, done.

[IF pdf-plus INSTALLED]
### PDF Plus - Read and annotate
Open PDFs directly in Obsidian. Highlight text and it links back to the exact page.

[IF readwise-official INSTALLED]
### Readwise - Your reading highlights
[IF CONFIGURED] Your Kindle highlights and saved articles sync automatically to `Readwise/`.
[IF NOT CONFIGURED] Connect your Readwise account in Settings to sync highlights.

[IF media-extended INSTALLED]
### Media Extended - Audio and video
Embed audio or video files and take timestamped notes.

[END PLUGIN SECTION]

## A Day in the Life

Here's what using Obsidian might actually look like, based on your setup:

[GENERATE SCENARIOS BASED ON USER'S WORKFLOW AND INSTALLED PLUGINS]

### Morning: Starting your day
You sit down with coffee. Press `Cmd/Ctrl + D` to open today's note. Jot down:
- What's on your mind
- What you want to accomplish
- Any lingering thoughts from yesterday

[IF tasks INSTALLED]
Add tasks as you think of them:
```
- [ ] Reply to Sarah's email
- [ ] Review budget proposal
- [ ] Call dentist 📅 2024-01-20
```

---

### During the day: Capturing in the moment

[IF quickadd INSTALLED]
**Quick thought while working:**
`Cmd/Ctrl + Shift + C` → type your thought → Enter. Done in 2 seconds, back to work.

**Someone gives you a task:**
`Cmd/Ctrl + Shift + T` → type "Follow up with Mike about report" → Enter. It's saved as a checkbox.

**Starting a meeting:**
`Cmd/Ctrl + Shift + M` → type meeting name → your template opens with agenda and action items ready.

**Random idea:**
`Cmd/Ctrl + Shift + I` → "What if we tried X approach" → saved to inbox for later.

[IF tasks INSTALLED]
**Task without leaving your current note:**
Just type `- [ ] Do the thing` anywhere. Tasks plugin will find it later.

[IF pdf-plus INSTALLED]
**Reading a PDF:**
Open the PDF in Obsidian. Highlight important text. Press `Ctrl + Shift + C` to copy a link. Paste it in your notes - now you can jump back to that exact spot.

[IF readwise INSTALLED]
**After reading an article:**
Your highlights from Readwise automatically appear in `Readwise/`. Browse them later for ideas.

---

### When inspiration strikes

**You have an idea:**
1. `Cmd/Ctrl + Shift + I` → type your idea
2. Press Enter - it's captured
3. Add `#idea` if you want to find it later
4. Done. Move on.

**You want to connect two ideas:**
While writing, type `[[` and start typing the other note's name. Select it. Now they're linked - you can click between them.

**You remember something related:**
Add it to the current note, or use QuickAdd to create a separate one. Link them with `[[Note Name]]` if it feels right.

---

### End of day: Light review (optional)

Take 2 minutes:
- Glance at today's daily note
- Check off completed tasks (`Cmd/Ctrl + Enter`)
- Notice if any notes want to be linked or moved

That's it. Don't force organization - let it happen.

---

### Real scenarios

[CUSTOMIZE BASED ON USER'S DISCLOSED WORKFLOW]

[IF user works with meetings/projects]
**Before a meeting:**
- `Cmd/Ctrl + Shift + N` → "🗓️ New Meeting" → type meeting name
- Your template opens with agenda, attendees, action items sections ready

**During the meeting:**
- Capture notes in bullet points
- Mark action items: `- [ ] @me Send proposal by Friday`
- Don't worry about formatting - capture first

**After the meeting:**
- Check off items you can do now (`Cmd/Ctrl + Enter`)
- Link to related project notes with `[[Project Name]]`

[IF user reads/researches]
**When you read something interesting:**
- Highlight in Kindle/browser (syncs via Readwise)
- OR paste quotes into a note
- Add your own thoughts below
- Tag with `#to-process` if you want to revisit

**When you want to write about what you read:**
- Open a new note
- Link to your highlights: `[[Readwise/Article Title]]`
- Write your synthesis in your own words

[IF user tracks tasks]
**Weekly review (10 mins on Sunday/Monday):**
1. Open a new note or your weekly template
2. Look at incomplete tasks from the week
3. Move or reschedule what still matters
4. Delete what no longer matters (liberating!)
5. Set intentions for the new week

[IF user captures ideas/creative]
**When brainstorming:**
- Open a blank note
- Write freely - no structure
- Use bullet points or freeform
- Add `#brainstorm` to find later
- Link to related ideas as they come: `[[Other Idea]]`

**When an idea matures:**
- You'll notice some notes keep coming up
- That's a sign they want more attention
- Expand them, link them, let them grow

---

## Building Your Habit

The goal isn't a perfect system - it's a trusted place to think.

### Start ridiculously small
- One note per day is enough
- A few bullet points count
- Partial thoughts are fine

### Lower the friction
- Keep Obsidian open or in your dock
- Use `Cmd/Ctrl + D` to jump straight to today
- Don't organize until it feels necessary

### Trust the mess
- Your notes don't need to be neat
- Future you will understand past you
- Links and search make everything findable

### Let organization emerge
- After a few weeks, you'll notice patterns
- Notes will naturally want to group together
- That's when folders and tags make sense - not before

[IF USER EXPRESSED INTEREST IN KNOWLEDGE GROWTH - include based on Step 5.5 responses]

## Growing Your Knowledge

You expressed interest in building connections between your ideas. Here's how that works in practice - but there's no rush. These habits make more sense once you have notes to connect.

[IF user selected "Connecting ideas"]
### Connecting Ideas with Links

The magic of Obsidian is the humble `[[link]]`. When you type `[[` and start typing a note name, you create a connection between two ideas.

**When to link:**
- When you mention something you've written about before
- When two ideas feel related (even if you're not sure how)
- When you want to find your way back to something

**Try this:** Next time you're writing and think "this reminds me of..." - create a link. Even if the other note doesn't exist yet, Obsidian will create it when you click.

**The backlinks panel** (right sidebar) shows every note that links *to* the current note. This is how you discover unexpected connections.

> **Tutorial:** [How Linking Creates a Web of Knowledge](placeholder://tutorials/linking-basics)

[IF user selected "Creating hubs"]
### Hub Notes (Index Notes)

As your notes grow, you'll notice clusters of related ideas. A hub note gathers these together in one place.

**Example:** You have 15 notes about "productivity." Create a note called `Productivity Hub` that links to all of them:

```markdown
# Productivity Hub

Ideas I'm exploring about getting things done.

## Core concepts
- [[Deep Work]]
- [[Time blocking]]
- [[Energy management]]

## Experiments I'm trying
- [[Morning routine]]
- [[Weekly review practice]]

## Books and articles
- [[Book - Atomic Habits]]
- [[Article - The Myth of Multitasking]]
```

**Don't force it.** Wait until you naturally have 10+ notes on a topic. The hub should feel useful, not obligatory.

> **Tutorial:** [Creating Your First Hub Note](placeholder://tutorials/hub-notes)

[IF user selected "Growing ideas over time"]
### Growing Ideas Over Time

Some notes are quick captures. Others become something more - ideas you return to, refine, and develop. These are sometimes called "evergreen notes."

**Signs a note wants to grow:**
- You keep linking to it from other notes
- You add to it over multiple sessions
- It captures a core concept you're developing

**How to nurture them:**
- Give them clear, concept-based titles ("Creativity requires constraints" not "Ideas from Tuesday")
- Keep them atomic - one idea per note
- Let them link freely to related concepts
- Revisit them when you learn something new

**Don't overthink it.** Most notes stay quick captures. The important ones will make themselves obvious.

> **Tutorial:** [Developing Ideas That Last](placeholder://tutorials/evergreen-notes)

[IF user selected "Regular tending"]
### Regular Tending

A knowledge system isn't "set and forget" - it benefits from occasional attention. Think of it like tending a garden.

**Weekly tending (10 minutes):**
- Browse your inbox folder
- Move notes that have grown up (out of inbox into your structure)
- Notice notes that want to link to each other
- Check your daily notes for seeds worth planting

**Monthly tending (30 minutes):**
- Open the graph view (`Ctrl + G`) and explore
- Look for orphan notes (no links in or out)
- Revisit a random hub note - is it still accurate?
- Notice what topics have the most notes - that's what you're actually thinking about

**The random note habit:** Open a random note occasionally. You'll be surprised what past-you was thinking about. This creates serendipitous connections.

> **Tutorial:** [The Art of Tending Your Notes](placeholder://tutorials/note-gardening)

[IF user selected "Connecting ideas" OR "Creating hubs"]
### The Graph View

Press `Ctrl + G` to see your notes as a visual network. Each note is a dot, each link is a line connecting them.

**Early on:** Your graph will look sparse. That's normal.

**Over time:** Clusters will form around topics you think about most. This is your mind made visible.

**Use it for:**
- Discovering notes you forgot about
- Seeing which ideas are most connected
- Finding orphan notes that need links
- Just enjoying the view

**Don't obsess over it.** The graph is a side effect of good linking, not a goal in itself.

---

**Remember:** These are habits to develop over months, not tasks to complete. Start with capturing. Links and connections will follow naturally.

[END KNOWLEDGE GROWTH SECTION]

[IF USER SAID "MAYBE LATER" - include this shorter teaser instead]

## When You're Ready to Go Deeper

You mentioned you might want to explore more advanced note-taking habits later. When that time comes, here are some concepts worth learning:

| Concept | What it means | When to explore |
|---------|---------------|-----------------|
| **Linking** | Connecting notes with `[[links]]` | After you have 20+ notes |
| **Hub notes** | Index notes that gather related ideas | After you have 10+ notes on one topic |
| **Evergreen notes** | Ideas you develop over time | After you notice certain notes keep coming up |
| **Tending** | Regular review and connecting | After a month of daily notes |

**Resources when you're ready:**
- [Linking Your Thinking (YouTube)](https://youtube.com/c/linkingyourthinking) - Nick Milo's channel on connected note-taking
- [Obsidian Hub](https://publish.obsidian.md/hub) - Community-curated resources
- [Effective Note-Taking](placeholder://tutorials/getting-started-advanced) - A gentle next step

No rush. The basics will take you far.

[END MAYBE LATER SECTION]

## What "Success" Looks Like

**Week 1**: You opened Obsidian a few times and wrote something.

**Week 2**: Opening Obsidian feels natural. You have 10-20 notes.

**Month 1**: You've searched for an old note and found it. You made your first [[link]].

**Month 2+**: You're developing your own style. The system fits you.

## Starter Templates

Your `templates/` folder has three simple templates to try:

- **daily.md** - For your daily notes (tasks, thoughts, reflections)
- **note.md** - Basic note with a title and date
- **meeting.md** - Meeting notes with agenda and action items

Press `Cmd/Ctrl + T` to insert one.

## When You're Ready for More

You don't need these yet, but when you're curious:

- **Linking notes**: Type `[[` to link to another note
- **Tags**: Add `#project` or `#idea` to categorize notes
- **Search**: Press `Cmd/Ctrl + Shift + F` to search all notes
- **Graph view**: Press `Ctrl+G` to see how your notes connect

## Getting Help

- **Obsidian Help**: help.obsidian.md
- **Community**: forum.obsidian.md (friendly people!)
- **YouTube**: Search "Obsidian beginner" for video walkthroughs

---

Remember: there's no wrong way to do this. Just start capturing.

*Vault created with obsidian-bootstrap*
```

---

## Generation Instructions

1. **Use friendly, encouraging language** - no jargon
2. **Focus on habits over systems** - "capture first, organize later"
3. **Reassure repeatedly** - "you can't mess this up"
4. **Progressive disclosure** - basics first, advanced stuff at the end
5. **Only include installed plugins** - don't overwhelm

### Customizing "A Day in the Life" scenarios

Based on what the user selected for "What situations will you use this in?":

| User selected | Include these scenarios |
|---------------|------------------------|
| Meetings and calls | Before/during/after meeting flow |
| Research and reading | Reading → highlighting → synthesizing |
| Projects and work tasks | Weekly review, project notes |
| Personal ideas and journaling | Freeform capture, morning pages |
| Learning and studying | Note-taking, flashcard patterns |
| Creative work | Brainstorming, idea development |

**Make scenarios specific:**
- Use realistic examples ("Reply to Sarah's email" not "Do task")
- Show the exact keystrokes (`Cmd/Ctrl + Shift + N` → type → done)
- Include timing ("Back to work in 5 seconds", "2 minute review")
- Match their plugins (only show QuickAdd scenarios if installed)

**Keep it practical:**
- "Here's what Monday morning looks like..."
- "When your boss asks you to do something..."
- "After a meeting, take 30 seconds to..."

### Customizing "Growing Your Knowledge" section

Based on user responses in Step 5.5 (Knowledge Growth Discovery):

| User response | What to include |
|---------------|-----------------|
| "Yes, that sounds exciting" | Full "Growing Your Knowledge" section |
| + "Connecting ideas" | Include "Connecting Ideas with Links" + "The Graph View" |
| + "Creating hubs" | Include "Hub Notes" + "The Graph View" |
| + "Growing ideas over time" | Include "Growing Ideas Over Time" |
| + "Regular tending" | Include "Regular Tending" |
| "Maybe later" | Include shorter "When You're Ready to Go Deeper" teaser |
| "Keep it simple" | Omit both sections entirely |

**Tutorial placeholders:**
The `placeholder://tutorials/*` links are intentional placeholders. In a future version, these could:
- Link to curated YouTube tutorials
- Link to Obsidian community guides
- Trigger an in-vault tutorial system
- Open a contextual help panel

For now, they signal "this is where a tutorial would go" and can be replaced with real links when available.

**Tone for knowledge growth content:**
- Emphasize patience: "no rush", "over months not days"
- Normalize the messy middle: "your graph will look sparse"
- Avoid perfectionism: "don't overthink it", "don't force it"
- Frame as optional: "habits to develop" not "steps to complete"
- Use concrete triggers: "after you have 20+ notes", "when you notice..."
