---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
type: project
status: planning
priority: medium
tags: project/<% tp.date.now("YYYY") %>
start_date: <% tp.date.now("YYYY-MM-DD") %>
target_date: <% tp.date.now("YYYY-MM-DD", 30) %>
---

# \ud83d\ude80 <% tp.file.title %>

<% tp.web.random_emoji("rocket,star,gem,trophy,target") %> **Status:** \ud83d\udd34 Planning | \ud83d\udfe1 Active | \ud83d\udd35 On Hold | \u2705 Complete
**Priority:** \ud83d\udd34 High | \ud83d\udfe1 Medium | \ud83d\udfe2 Low
**Timeline:** <% tp.date.now("YYYY-MM-DD") %> \u2192 <% tp.date.now("YYYY-MM-DD", 30) %>

## \ud83c\udfaf Project Objective
<% tp.system.prompt("What is the main objective of this project?") %>

### Success Criteria
- [ ] <% tp.system.prompt("What defines success for this project?") %>
- [ ] 
- [ ] 

## \ud83d\udc65 Team & Stakeholders
| Role | Person | Responsibilities |
|------|--------|-----------------|
| Sponsor | | Project approval & resources |
| Lead | | Overall delivery |
| | | |

## \ud83d\udcc8 Timeline & Milestones

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Planning           :a1, <% tp.date.now("YYYY-MM-DD") %>, 7d
    section Phase 2
    Development        :a2, after a1, 14d
    section Phase 3
    Testing            :a3, after a2, 7d
    section Phase 4
    Deployment         :a4, after a3, 3d
```

### Key Milestones
- [ ] \ud83c\udfc1 **Kickoff** - <% tp.date.now("YYYY-MM-DD") %>
- [ ] \ud83d\udce6 **Phase 1 Complete** - <% tp.date.now("YYYY-MM-DD", 7) %>
- [ ] \ud83d\ude80 **Phase 2 Complete** - <% tp.date.now("YYYY-MM-DD", 21) %>
- [ ] \u2705 **Launch** - <% tp.date.now("YYYY-MM-DD", 30) %>

## \ud83d\udcdd Current Sprint
### Sprint Goal
<% tp.system.prompt("What's the sprint goal?") %>

### Tasks
```tasks
not done
path includes <% tp.file.path(true) %>
group by priority
```

#### This Week
- [ ] \u2b50 Task 1 \ud83d\udcc5 <% tp.date.now("YYYY-MM-DD", 3) %>
- [ ] Task 2 \ud83d\udcc5 <% tp.date.now("YYYY-MM-DD", 5) %>

#### Next Week
- [ ] Task 3 \ud83d\udcc5 <% tp.date.now("YYYY-MM-DD", 10) %>

## \ud83d\udce1 Progress Updates
### <% tp.date.now("YYYY-MM-DD") %>
- Started project planning
- 

## \u26a0\ufe0f Risks & Issues
| Risk/Issue | Impact | Likelihood | Mitigation | Owner |
|------------|--------|------------|------------|-------|
| | High | Medium | | |

## \ud83d\udcca Metrics & KPIs
- **Velocity:** 
- **Burndown:** 
- **Budget:** $ / $

## \ud83d\udcc1 Resources & Documentation
- [[Project Charter]]
- [[Technical Specs]]
- [[Meeting Notes]]

## \ud83d\udca1 Ideas Parking Lot
- 

---
### Quick Links
[[Projects MOC]] | [[Active Projects]] | [[Project Templates]]

*Last updated: <% tp.date.now("YYYY-MM-DD HH:mm") %>*