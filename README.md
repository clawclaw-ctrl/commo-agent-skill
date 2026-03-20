# commo-agent-stack

Commo agent stack for OpenClaw: skill guidance + dedicated API plugin.

## What matters for agents

- `SKILL.md` is the authoritative skill definition.
- `references/api.md` contains endpoint and payload reference details.
- `plugins/commo-api/` provides the dedicated `commo_task` tool.

## Environment setup

Set both environments and switch with `COMMO_ENV`:

- `COMMO_ENV=dev|prod`
- `COMMO_DEV_WORKFLOW_ROOT`
- `COMMO_DEV_API_TOKEN`
- `COMMO_PROD_WORKFLOW_ROOT`
- `COMMO_PROD_API_TOKEN`

## Repository layout

- `SKILL.md` — Commo skill guidance
- `references/` — API endpoint and payload references
- `plugins/commo-api/` — dedicated OpenClaw plugin tool for Commo API actions

## Security posture (org agent)

Recommended org-agent tool policy:

- allow: `commo_task` (and optional `read`)
- deny: runtime shell tools (`exec`, `process`, `bash`) and cross-session tools

This keeps org-facing automation constrained to approved Commo API workflows.
