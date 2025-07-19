# [BotC Script Viewer](https://botc-script-viewer.sthom.kiwi)

A web app for viewing scripts for [Blood on the Clocktower](https://bloodontheclocktower.com/). i made this because I was going somewhere I knew people would have phones but not printers.

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
