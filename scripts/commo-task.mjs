#!/usr/bin/env node
import crypto from "node:crypto";

const ACTIONS = {
  create_task: "oc_create_task",
  update_task: "oc_update_task",
  get_task: "oc_get_task",
  search_tasks: "oc_search_tasks",
  archive_task: "oc_archive_task"
};

function resolveEnvConfig() {
  const env = (process.env.COMMO_ENV || "dev").toLowerCase();
  if (!["dev", "prod"].includes(env)) {
    throw new Error("COMMO_ENV must be either 'dev' or 'prod'");
  }

  const byMode = {
    dev: {
      workflowRoot: process.env.COMMO_DEV_WORKFLOW_ROOT,
      token: process.env.COMMO_DEV_API_TOKEN
    },
    prod: {
      workflowRoot: process.env.COMMO_PROD_WORKFLOW_ROOT,
      token: process.env.COMMO_PROD_API_TOKEN
    }
  };

  const config = byMode[env];
  if (!config.workflowRoot) {
    throw new Error(`Missing ${env === "dev" ? "COMMO_DEV_WORKFLOW_ROOT" : "COMMO_PROD_WORKFLOW_ROOT"}`);
  }
  if (!config.token) {
    throw new Error(`Missing ${env === "dev" ? "COMMO_DEV_API_TOKEN" : "COMMO_PROD_API_TOKEN"}`);
  }

  return { env, ...config };
}

function usage() {
  console.log(`Usage:\n  COMMO_ENV=dev node scripts/commo-task.mjs <action> '<json-payload>'\n\nActions:\n  ${Object.keys(ACTIONS).join("\n  ")}\n  seed_tasks`);
}

function validate(action, data) {
  if (action === "create_task" && (!data?.title || typeof data.title !== "string")) {
    throw new Error("create_task requires string field: title");
  }
  if (["update_task", "get_task", "archive_task"].includes(action) && (!data?.id || typeof data.id !== "string")) {
    throw new Error(`${action} requires string field: id`);
  }
}

function body(action, data, activeEnv) {
  return {
    request_id: crypto.randomUUID(),
    action,
    actor: "openclaw",
    ts: Math.floor(Date.now() / 1000),
    env: activeEnv,
    ...data
  };
}

async function call(action, payload, config) {
  const endpoint = ACTIONS[action];
  const res = await fetch(`${config.workflowRoot}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.token}`
    },
    body: JSON.stringify(body(action, payload, config.env))
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, environment: config.env, response: json };
}

function randomTask() {
  const verbs = ["Review", "Draft", "Plan", "Call", "Email", "Update", "Refactor", "Test", "Prepare", "Sync"];
  const objs = ["onboarding doc", "Q2 roadmap", "customer follow-up", "API checklist", "deploy notes", "invoice batch", "bug triage", "team agenda", "backup policy", "feature spec"];
  const statuses = ["open", "open", "in_progress"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return {
    title: `${pick(verbs)} ${pick(objs)} #${Math.floor(Math.random() * 900) + 100}`,
    status: pick(statuses),
    notes: "seeded by commo-control skill"
  };
}

async function seedTasks(count, config) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const r = await call("create_task", randomTask(), config);
    results.push(r);
  }
  return results;
}

async function main() {
  const config = resolveEnvConfig();

  const [, , action, payloadRaw] = process.argv;
  if (!action) return usage();

  if (action === "seed_tasks") {
    const payload = payloadRaw ? JSON.parse(payloadRaw) : {};
    const count = Number(payload.count || 10);
    const seeded = await seedTasks(count, config);
    console.log(JSON.stringify({ ok: true, environment: config.env, count, seeded }, null, 2));
    return;
  }

  if (!ACTIONS[action]) return usage();

  let payload = {};
  if (payloadRaw) {
    try { payload = JSON.parse(payloadRaw); } catch { throw new Error("Payload must be valid JSON"); }
  }

  validate(action, payload);
  const result = await call(action, payload, config);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
  process.exit(1);
});
