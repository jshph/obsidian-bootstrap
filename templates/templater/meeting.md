---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
type: meeting
tags: meeting/<% tp.date.now("YYYY") %>
project: 
attendees: 
---

# Meeting: <% tp.file.title %>

**Date:** <% tp.date.now("YYYY-MM-DD") %>
**Time:** <% tp.date.now("HH:mm") %> - 
**Duration:** 
**Location:** 
**Attendees:** <% tp.system.prompt("Attendees (comma-separated):") %>

## \ud83c\udfaf Objective
<% tp.system.prompt("What is the main objective of this meeting?") %>

## \ud83d\udccb Agenda
1. <% tp.system.prompt("First agenda item:") %>
2. 
3. 

## \ud83d\udde3\ufe0f Discussion

### Topic 1: 
**Lead:** 
**Notes:**
- 

### Topic 2: 
**Lead:** 
**Notes:**
- 

## \ud83c\udfaf Action Items
```tasks
not done
path includes <% tp.file.path(true) %>
```

- [ ] Action item \u2192 @assignee \ud83d\udcc5 <% tp.date.now("YYYY-MM-DD", 7) %>
- [ ] 

## \ud83d\udd11 Key Decisions
1. 
2. 

## \ud83d\udcce Attachments & Resources
- 

## \ud83d\udd04 Follow-up
- **Next Meeting:** <% tp.date.now("YYYY-MM-DD", 7) %>
- **Check-in Date:** 

---
### Meeting Notes
<% tp.date.now("HH:mm") %> - 

---
*Meeting concluded at: <% tp.date.now("HH:mm") %>*