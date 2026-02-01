# openclaw-config

Full reference for managing, debugging, and searching everything in `~/.openclaw` — channels, sessions, logs, cron jobs, memory, extensions, and credentials.

v2: Rewritten with real file paths, copy-paste debug commands, troubleshooting playbooks, and session search recipes.

## Install

```bash
npx add-skill adisinghstudent/easyclaw
```

Or for specific agents:

```bash
npx add-skill adisinghstudent/easyclaw -a claude-code
npx add-skill adisinghstudent/easyclaw -a cursor
npx add-skill adisinghstudent/easyclaw -a codex
```

## What's Inside

- **Full file map** of every directory and file in `~/.openclaw/`
- **Session search** — find conversations by keyword, contact, channel, or date
- **Log analysis** — gateway events, errors, channel-specific filtering
- **Cron debugging** — failed jobs, run history, next scheduled times
- **Memory inspection** — SQLite queries for the persistent memory DB
- **Channel status** — quick overview of all channel configs and policies
- **Credential health checks** — verify WhatsApp, Telegram, Signal, Twitter creds
- **Config editing** — safe `jq` one-liners for common changes (model, concurrency, policies)
- **Troubleshooting playbooks** for: channel not connecting, Signal RPC failures, cron failures, WhatsApp disconnect, iMessage permissions, broken config, finding old messages
- **Workspace file reference** — what each `.md` file does and when to edit it
- **Session JSONL format** — how to parse transcripts programmatically
- **Extension plugin format** — structure for building custom channel plugins

## Quick Examples

Search all sessions for a keyword:
```bash
grep "KEYWORD" ~/.openclaw/agents/main/sessions/*.jsonl | head -20
```

Check which cron jobs are failing:
```bash
cat ~/.openclaw/cron/jobs.json | jq '.jobs[] | select(.state.lastStatus == "error") | {name, error: .state.lastError}'
```

Channel overview:
```bash
cat ~/.openclaw/openclaw.json | jq '{
  whatsapp: .channels.whatsapp.dmPolicy,
  signal: .channels.signal.dmPolicy,
  telegram: .channels.telegram.dmPolicy,
  imessage: .channels.imessage.enabled
}'
```

## Requirements

- OpenClaw installed
- `jq` for config editing commands
- `sqlite3` for memory database queries
- `python3` for session transcript parsing

## License

MIT
