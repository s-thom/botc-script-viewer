---
layout: ../layouts/MarkdownLayout.astro
title: What is this site?
---

[Blood on the Clocktower](https://bloodontheclocktower.com/) is a social deduction game. Players can put together combinations of characters called a "script" to share around. This website allows players to see scripts digitally, in case they have a phone to hand but no printer to print off physical copies of a script.

This website was made by [Stuart Thomson](https://sthom.kiwi), and is not affiliated with The Pandemonium Institute or Blood on the Clocktower. I hope you like it.

## What is a script?

A script is a set of characters that have been put together to play. As there are many characters in Blood on the Clocktower, storytellers will usually limit the game to around 25 to help balance the game. Doing this can emphasise certain characters and interactions, leading to more interesting games.

You can find more scripts on the [unofficial BotC Scripts website](https://www.botcscripts.com/). In you want to try making your own, you can use the [official script tool](https://script.bloodontheclocktower.com/).

## What is JSON?

JSON is a way of storing data for computers to read later. When downloaded, the file will usually have the `.json` file extension. The official Blood on the Clocktower app can read specially formatted JSON files that contain information about a script, and most other tools around Clocktower have all adopted this format. JSON files are text-based, so you can open them up in something like Notepad or TextEdit to see what's inside. When you open it, it might look like:

```jsonc
[
  { "type": "_meta", "name": "Trouble Brewing" },
  "washerwoman",
  "librarian",
  "investigator",
  // And more lines like the ones above
]
```

Usually you won't be looking inside the JSON file yourself. Instead, you can use the [official script tool](https://script.bloodontheclocktower.com/) to select characters interactively.

On this website, you can upload a JSON file on the home page. If you are viewing a script, there is a "Download JSON" link at the top that allows you to download the script you're viewing.

## How do I turn a script JSON into a PDF?

JSON files can't be printed directly. Both this website and the [official script tool](https://script.bloodontheclocktower.com/) allow you to turn a JSON file into a PDF.

1. Upload the script to [this website](/) or the [script tool](https://script.bloodontheclocktower.com/).
2. Open your browser's print dialog (through the menu or pressing `ctrl/cmd + P`).
3. Select "Save as PDF", or similar, from the printer selection.
4. Select "Print".
