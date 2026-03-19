# Commo Task API Reference

## Environment Variables

- `COMMO_ENV`: `dev` or `prod`
- `COMMO_DEV_WORKFLOW_ROOT`: Dev workflow API root
- `COMMO_DEV_API_TOKEN`: Dev bearer token
- `COMMO_PROD_WORKFLOW_ROOT`: Prod workflow API root
- `COMMO_PROD_API_TOKEN`: Prod bearer token

No fallback or hardcoded default URL is used.

## Base URL (resolved by mode)

- If `COMMO_ENV=dev` -> `COMMO_DEV_WORKFLOW_ROOT`
- If `COMMO_ENV=prod` -> `COMMO_PROD_WORKFLOW_ROOT`

## Auth (resolved by mode)

- Header: `Authorization: Bearer <mode-specific token>`

## Endpoints

- `oc_create_task`
- `oc_get_task`
- `oc_update_task`
- `oc_archive_task`
- `oc_search_tasks`

## Common metadata sent by tool

```json
{
  "request_id": "uuid",
  "action": "create_task",
  "actor": "openclaw",
  "ts": 1760000000
}
```

## Example create payload

```json
{
  "request_id": "uuid",
  "action": "create_task",
  "actor": "openclaw",
  "ts": 1760000000,
  "title": "Example task",
  "status": "open",
  "notes": "optional",
  "due_at": "2026-03-19T10:00:00Z"
}
```
