# [BotC Script Viewer](https://botc-script-viewer.sthom.kiwi)

A web app for viewing scripts for [Blood on the Clocktower](https://bloodontheclocktower.com/). I made this because I was going somewhere I knew people would have phones but not printers.

## Acknowledgements

This site is not in any way affiliated with The Pandemonium Institute. All roles and characters are the property of Steven Medway and The Pandemonium Institute.

Blood on the Clocktower is a trademark of Steven Medway and The Pandemonium Institute.

## Development instructions

<details>
<summary>Development instructions</summary>

Requires a modern version of Node.

```sh
# First, copy the .env.example file to .env and fill in any required variables.
npm ci
npm run setup
npm run dev
```

### Environment variables

| Name        | Description                                                                                 | Default |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| `DATA_JSON` | Game data from <https://botc.app/backend/data>. Not included in repo for copyright reasons. |         |

</details>
