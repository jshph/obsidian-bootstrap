---
tags: devotional
reflectionType: personal
created: <% tp.file.creation_date("YYYY-MM-DD") %>
---

## Passage

## Reflection

## Highlights from [[Emotionally Healthy Spirituality Day by Day by Peter Scazzero Highlights|Emotionally Healthy Spirituality Day by Day Highlights]]

```dataviewjs
const results = await dv.tryQuery(`
	LIST L.text FROM "Readwise/Books" FLATTEN file.lists as L
	WHERE contains(file.path, "Readwise/Books/Emotionally Healthy Spirituality Day")
	AND contains(L.text, "<% tp.date.now("YYYY-MM-DD") %>")
`)

dv.table(["Quote", "Notes"],
	results.values.map(r => {
		const split = r.value.split("**Note**:")
		const text = `${split[0]}`
		let notes = ""
		if (split.length > 1) {
			notes = split[1]
		}
		return [text, notes]
	})
)
```