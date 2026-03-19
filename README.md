# commo-agent-skill

Commo task-control skill for OpenClaw agents.

## What matters for agents

- `SKILL.md` is the authoritative skill definition.
- `scripts/commo-task.mjs` is the CLI helper used by the skill.
- `references/api.md` contains endpoint and payload reference details.

## Environment setup

Set both environments and switch with `COMMO_ENV`:

- `COMMO_ENV=dev|prod`
- `COMMO_DEV_WORKFLOW_ROOT`
- `COMMO_DEV_API_TOKEN`
- `COMMO_PROD_WORKFLOW_ROOT`
- `COMMO_PROD_API_TOKEN`

## Quick test

```bash
COMMO_ENV=dev node scripts/commo-task.mjs search_tasks '{"limit":1}'
```
