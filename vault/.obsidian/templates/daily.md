
## urgent tasks from /inbox
```tasks
path includes inbox
not done
priority is high
```

## Work
```dataview
LIST
WHERE reflectionType = "work"
AND created = date(this.file.name)
```

## Personal
```dataview
LIST
WHERE reflectionType = "personal"
AND created = date(this.file.name)
```
