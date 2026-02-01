---
name: openclaw-config
description: Manage OpenClaw bot configuration - channels, agents, security, and autopilot settings
version: 2.0.0
---

# OpenClaw Configuration & Debugging

Fast reference for managing, debugging, and searching everything in `~/.openclaw`.

---

## File Map

```
~/.openclaw/
├── openclaw.json                    # MAIN CONFIG (channels, auth, gateway, plugins, skills)
├── openclaw.json.bak                # Auto-backups (.bak, .bak.1, .bak.2 ...)
├── exec-approvals.json              # Execution approval socket + defaults
│
├── agents/main/
│   ├── agent/auth-profiles.json     # Auth tokens per provider
│   └── sessions/
│       ├── sessions.json            # SESSION INDEX — start here to find any session
│       └── *.jsonl                  # Session transcripts (one JSON object per line)
│
├── workspace/                       # Agent workspace (git-tracked)
│   ├── SOUL.md                      # Personality & writing style
│   ├── IDENTITY.md                  # Name, creature, vibe
│   ├── USER.md                      # Owner context
│   ├── AGENTS.md                    # Session behavior rules
│   ├── BOOT.md                      # Boot-time instructions (autopilot protocol)
│   ├── HEARTBEAT.md                 # Heartbeat task checklist
│   ├── MEMORY.md                    # Long-term curated memory
│   ├── TOOLS.md                     # Local tool notes (contacts, SSH, etc.)
│   ├── memory/                      # Daily logs: YYYY-MM-DD.md
│   └── skills/                      # Workspace-level skills
│
├── memory/main.sqlite               # Persistent memory database
│
├── logs/
│   ├── gateway.log                  # Runtime events (startup, reload, pairing)
│   ├── gateway.err.log              # Errors and stack traces
│   └── commands.log                 # Command execution log
│
├── cron/
│   ├── jobs.json                    # Scheduled job definitions
│   └── runs/                        # Per-job run logs (JSONL by job UUID)
│
├── credentials/
│   ├── whatsapp/default/            # WA pre-keys, sessions, lid-mapping
│   ├── telegram/{botname}/token.txt # Bot tokens
│   └── bird/cookies.json            # X/Twitter auth cookies
│
├── extensions/                      # Custom plugins (TypeScript)
│   └── {name}/
│       ├── openclaw.plugin.json     # Plugin manifest
│       ├── index.ts                 # Entry point
│       └── src/                     # Source files
│
├── identity/
│   ├── device.json                  # Device config
│   └── device-auth.json             # Device auth keys
│
├── devices/
│   ├── paired.json                  # Connected devices
│   └── pending.json                 # Pending pairing requests
│
├── media/
│   ├── inbound/                     # Received files (images, audio)
│   └── browser/                     # Browser screenshots
│
├── browser/openclaw/user-data/      # Chromium profile
├── tools/signal-cli/                # Signal CLI binary
├── subagents/runs.json              # Sub-agent execution log
├── canvas/index.html                # Web canvas UI
└── telegram/update-offset-*.json    # Telegram message offsets
```

---

## Quick Debug Commands

### Search Sessions for Keywords

```bash
# Find which sessions mention something (fast — searches filenames in index)
grep -l "KEYWORD" ~/.openclaw/agents/main/sessions/*.jsonl

# Search session content for actual message text
grep "KEYWORD" ~/.openclaw/agents/main/sessions/*.jsonl | head -20

# Search with context (2 lines around match)
grep -C2 "KEYWORD" ~/.openclaw/agents/main/sessions/*.jsonl | head -40

# Find sessions by channel (signal, whatsapp, telegram)
cat ~/.openclaw/agents/main/sessions/sessions.json | jq -r 'to_entries[] | select(.value.lastChannel == "signal") | "\(.value.sessionId) | \(.value.origin.label // "unknown") | \(.value.updatedAt | . / 1000 | todate)"'

# Find sessions by contact name/number
cat ~/.openclaw/agents/main/sessions/sessions.json | jq -r 'to_entries[] | select(.value.origin.label // "" | test("KEYWORD"; "i")) | "\(.value.sessionId) | \(.value.origin.label) | \(.value.lastChannel)"'

# Most recent sessions (by last update)
cat ~/.openclaw/agents/main/sessions/sessions.json | jq -r '[to_entries[] | {key: .key, id: .value.sessionId, updated: .value.updatedAt, label: (.value.origin.label // .key), channel: (.value.lastChannel // "?")}] | sort_by(.updated) | reverse | .[:10][] | "\(.updated | . / 1000 | todate) | \(.channel) | \(.label)"'

# Read a specific session transcript (last 30 messages)
tail -30 ~/.openclaw/agents/main/sessions/SESSION_ID.jsonl | python3 -c "
import sys, json
for line in sys.stdin:
    obj = json.loads(line)
    if obj.get('type') == 'message':
        role = obj['message']['role']
        text = ''.join(c.get('text','') for c in obj['message'].get('content',[]) if isinstance(c,dict))
        if text.strip():
            print(f'[{role}] {text[:200]}')
"
```

### Check Logs

```bash
# Recent gateway events (last 30 lines)
tail -30 ~/.openclaw/logs/gateway.log

# Recent errors
tail -50 ~/.openclaw/logs/gateway.err.log

# Follow logs live
tail -f ~/.openclaw/logs/gateway.log

# Search errors for a specific channel
grep -i "signal\|whatsapp\|telegram" ~/.openclaw/logs/gateway.err.log | tail -20

# Count errors by type
grep -oP 'Error: [^"]+' ~/.openclaw/logs/gateway.err.log | sort | uniq -c | sort -rn | head -10
```

### Cron Jobs

```bash
# List all jobs with status
cat ~/.openclaw/cron/jobs.json | jq '.jobs[] | {name, enabled, status: .state.lastStatus, error: .state.lastError, id}'

# Check failed jobs
cat ~/.openclaw/cron/jobs.json | jq '.jobs[] | select(.state.lastStatus == "error") | {name, error: .state.lastError}'

# View run history for a specific job
tail -5 ~/.openclaw/cron/runs/JOB_UUID.jsonl

# See next scheduled run times
cat ~/.openclaw/cron/jobs.json | jq '.jobs[] | select(.enabled) | {name, nextRun: (.state.nextRunAtMs // 0 | . / 1000 | todate)}'
```

### Memory Database

```bash
# List tables in memory DB
sqlite3 ~/.openclaw/memory/main.sqlite ".tables"

# Show table schemas
sqlite3 ~/.openclaw/memory/main.sqlite ".schema"

# Search memory for a keyword
sqlite3 ~/.openclaw/memory/main.sqlite "SELECT * FROM memories WHERE content LIKE '%KEYWORD%' ORDER BY created_at DESC LIMIT 10;"

# Count memories
sqlite3 ~/.openclaw/memory/main.sqlite "SELECT COUNT(*) FROM memories;"

# Recent memories
sqlite3 ~/.openclaw/memory/main.sqlite "SELECT substr(content, 1, 100), created_at FROM memories ORDER BY created_at DESC LIMIT 10;"
```

### Channel Status

```bash
# Quick channel overview from config
cat ~/.openclaw/openclaw.json | jq '{
  whatsapp: {policy: .channels.whatsapp.dmPolicy, selfChat: .channels.whatsapp.selfChatMode},
  signal: {enabled: .channels.signal.enabled, policy: .channels.signal.dmPolicy, account: .channels.signal.account},
  telegram: {enabled: .channels.telegram.enabled, policy: .channels.telegram.dmPolicy, bots: (.channels.telegram.accounts | keys)},
  imessage: {enabled: .channels.imessage.enabled}
}'

# Which plugins are enabled
cat ~/.openclaw/openclaw.json | jq '.plugins.entries'

# Check gateway binding
cat ~/.openclaw/openclaw.json | jq '{port: .gateway.port, bind: .gateway.bind, mode: .gateway.mode}'
```

### Extensions

```bash
# List installed extensions
ls ~/.openclaw/extensions/

# View extension manifest
cat ~/.openclaw/extensions/*/openclaw.plugin.json | jq .

# Check extension source files
find ~/.openclaw/extensions/ -name "*.ts" -not -path "*/node_modules/*"
```

### Credentials Health Check

```bash
# WhatsApp — check session files exist
ls ~/.openclaw/credentials/whatsapp/default/ 2>/dev/null | head -5

# Telegram — verify bot tokens exist (don't print them)
for d in ~/.openclaw/credentials/telegram/*/; do
  bot=$(basename "$d")
  [ -f "$d/token.txt" ] && echo "$bot: OK" || echo "$bot: MISSING"
done

# Twitter/Bird — check cookies exist
[ -f ~/.openclaw/credentials/bird/cookies.json ] && echo "Bird cookies: OK" || echo "Bird cookies: MISSING"

# Signal — verify CLI exists
[ -x "$(cat ~/.openclaw/openclaw.json | jq -r '.channels.signal.cliPath')" ] && echo "signal-cli: OK" || echo "signal-cli: MISSING or not executable"
```

### Devices

```bash
# Paired devices
cat ~/.openclaw/devices/paired.json | jq .

# Pending pairing requests
cat ~/.openclaw/devices/pending.json | jq .
```

---

## Config Editing

### openclaw.json Structure

| Section | What It Controls |
|---|---|
| `meta` | Version tracking, last-touched timestamps |
| `wizard` | Last setup wizard run info |
| `browser` | Chromium browser profile (enabled, profile name) |
| `auth.profiles` | API provider auth tokens (anthropic, etc.) |
| `agents.defaults` | Model, workspace path, concurrency, compaction |
| `tools.web.search` | Brave search API config |
| `tools.message` | Cross-context messaging settings |
| `messages` | Ack reaction scope |
| `commands` | Native command / skill modes |
| `hooks.internal` | Internal hooks (boot-md, etc.) |
| `channels.*` | Per-channel config (dmPolicy, allowFrom, groupPolicy) |
| `gateway` | Port, bind, auth token, tailscale |
| `skills.entries` | Skill-specific API keys and settings |
| `plugins.entries` | Enable/disable each channel plugin |

### Channel Security Modes

| Mode | Behavior | Risk |
|---|---|---|
| `open` | Anyone can message, no restrictions | HIGH — anyone sends, you pay API |
| `allowlist` | Only listed numbers/IDs get through | LOW — explicit control |
| `pairing` | Unknown senders get a code, you approve | LOW — approval required |
| `disabled` | Channel off | NONE |

### Edit Config Safely

```bash
# 1. Always backup first
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.manual

# 2. Edit with jq (example: switch WhatsApp to allowlist)
cat ~/.openclaw/openclaw.json | jq '.channels.whatsapp.dmPolicy = "allowlist" | .channels.whatsapp.allowFrom = ["+1XXXXXXXXXX"]' > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json

# 3. Restart gateway to apply
openclaw gateway restart
```

### Common Config Changes

**Switch WhatsApp to allowlist:**
```bash
jq '.channels.whatsapp.dmPolicy = "allowlist" | .channels.whatsapp.allowFrom = ["+1XXXXXXXXXX"]' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

**Enable autopilot (WhatsApp open + BOOT.md notification protocol):**
```bash
jq '.channels.whatsapp += {dmPolicy: "open", selfChatMode: false, allowFrom: ["*"]}' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

**Add a number to Signal allowlist:**
```bash
jq '.channels.signal.allowFrom += ["+1XXXXXXXXXX"]' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

**Change default model:**
```bash
jq '.agents.defaults.models = {"anthropic/claude-sonnet-4": {"alias": "sonnet"}}' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

**Set concurrency:**
```bash
jq '.agents.defaults.maxConcurrent = 10 | .agents.defaults.subagents.maxConcurrent = 10' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

**Disable a plugin:**
```bash
jq '.plugins.entries.imessage.enabled = false' ~/.openclaw/openclaw.json > /tmp/oc.json && mv /tmp/oc.json ~/.openclaw/openclaw.json
```

---

## Troubleshooting Playbooks

### "Channel not connecting"

```bash
# 1. Is the plugin enabled?
cat ~/.openclaw/openclaw.json | jq '.plugins.entries.CHANNEL'

# 2. Is the channel config present?
cat ~/.openclaw/openclaw.json | jq '.channels.CHANNEL'

# 3. Check credentials exist
ls -la ~/.openclaw/credentials/CHANNEL/

# 4. Check gateway logs for the channel
grep -i "CHANNEL" ~/.openclaw/logs/gateway.log | tail -20
grep -i "CHANNEL" ~/.openclaw/logs/gateway.err.log | tail -20

# 5. Restart and watch
openclaw gateway restart && tail -f ~/.openclaw/logs/gateway.log
```

### "Signal RPC Failed to send message"

```bash
# 1. Check signal-cli is installed and accessible
which signal-cli || ls -la /opt/homebrew/bin/signal-cli

# 2. Verify the bundled signal-cli
ls ~/.openclaw/tools/signal-cli/*/signal-cli

# 3. Check the configured account
cat ~/.openclaw/openclaw.json | jq '.channels.signal'

# 4. Test signal-cli directly
signal-cli -a +ACCOUNT_NUMBER send -m "test" +TARGET_NUMBER

# 5. Check if daemon is running
ps aux | grep signal-cli

# 6. Look for RPC errors
grep -i "signal.*rpc\|signal.*error\|signal.*fail" ~/.openclaw/logs/gateway.err.log | tail -10
```

### "Cron job failing"

```bash
# 1. Check which jobs are failing
cat ~/.openclaw/cron/jobs.json | jq '.jobs[] | select(.state.lastStatus == "error") | {name, id, error: .state.lastError, lastRun: (.state.lastRunAtMs | . / 1000 | todate)}'

# 2. Read the run log for the failing job
JOB_ID="paste-job-uuid-here"
tail -20 ~/.openclaw/cron/runs/$JOB_ID.jsonl

# 3. Check if it's a delivery error (channel down) vs task error
grep "Failed to send\|channel.*error\|delivery" ~/.openclaw/cron/runs/$JOB_ID.jsonl | tail -5

# 4. Manually trigger the job to test
# (copy the payload.message from jobs.json and send it via the channel)
```

### "WhatsApp disconnected"

```bash
# 1. Check WA credential files
ls -la ~/.openclaw/credentials/whatsapp/default/

# 2. Check for WA errors in logs
grep -i "whatsapp\|wa\|baileys" ~/.openclaw/logs/gateway.err.log | tail -20

# 3. Check if phone is linked
grep -i "pair\|link\|qr\|scan" ~/.openclaw/logs/gateway.log | tail -10

# 4. Re-pair if needed
openclaw configure  # re-run wizard
```

### "iMessage permission denied"

```bash
# 1. Check if chat.db is accessible
ls -la ~/Library/Messages/chat.db

# 2. Terminal needs Full Disk Access
# System Settings → Privacy & Security → Full Disk Access → add your terminal app

# 3. Check imsg CLI
which imsg || ls /opt/homebrew/bin/imsg

# 4. Test manually
imsg chats | head -5
```

### "Config broken / gateway won't start"

```bash
# 1. Validate JSON syntax
python3 -m json.tool ~/.openclaw/openclaw.json > /dev/null && echo "JSON OK" || echo "JSON BROKEN"

# 2. If broken, restore backup
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json

# 3. If all backups are bad
ls -lt ~/.openclaw/openclaw.json.bak*  # pick an older one

# 4. Nuclear: re-run wizard
openclaw configure
```

### "Can't find what someone said"

```bash
# Step 1: Search session index for the person
cat ~/.openclaw/agents/main/sessions/sessions.json | jq -r 'to_entries[] | select(.value.origin.label // "" | test("NAME"; "i")) | "\(.value.sessionId) \(.value.lastChannel) \(.value.origin.label)"'

# Step 2: Search across all sessions for their message
grep -l "KEYWORD" ~/.openclaw/agents/main/sessions/*.jsonl

# Step 3: Once you have the session ID, read it
python3 -c "
import json, sys
for line in open(sys.argv[1]):
    obj = json.loads(line)
    if obj.get('type') == 'message':
        role = obj['message']['role']
        text = ''.join(c.get('text','') for c in obj['message'].get('content',[]) if isinstance(c, dict))
        if text.strip() and 'KEYWORD' in text.lower():
            ts = obj.get('timestamp','?')
            print(f'[{ts}] [{role}] {text[:300]}')
" ~/.openclaw/agents/main/sessions/SESSION_ID.jsonl

# Step 4: Also check workspace memory
grep -ri "KEYWORD" ~/.openclaw/workspace/memory/
```

---

## Workspace Files Reference

| File | Purpose | When to Edit |
|---|---|---|
| `SOUL.md` | Personality, writing style, boundaries | To change how the bot communicates |
| `IDENTITY.md` | Name, creature type, emoji, avatar | To rebrand the bot |
| `USER.md` | Owner info, preferences | When user context changes |
| `AGENTS.md` | Session behavior, memory rules, safety | To change bot operating rules |
| `BOOT.md` | Boot-time instructions (autopilot notification protocol) | To change startup behavior |
| `HEARTBEAT.md` | Periodic task checklist | To add/remove heartbeat checks |
| `MEMORY.md` | Curated long-term memory | Bot updates this itself |
| `TOOLS.md` | Local tool notes (contacts, SSH, etc.) | To add contacts, device info |
| `memory/*.md` | Daily conversation logs | Bot writes these automatically |

---

## Session JSONL Format

Each line is one of these types:

```
{"type": "session", "id": "...", "timestamp": "...", "cwd": "..."}
{"type": "message", "id": "...", "message": {"role": "user|assistant", "content": [{"type": "text", "text": "..."}], "model": "...", "usage": {...}}}
{"type": "custom", "customType": "model-snapshot|openclaw.cache-ttl", "data": {...}}
```

Key fields in session index (`sessions.json`):
- `sessionId` — UUID, matches the JSONL filename
- `lastChannel` — signal, whatsapp, telegram, etc.
- `origin.label` — human-readable sender label (name + ID)
- `origin.from` — canonical sender address
- `updatedAt` — epoch ms of last activity
- `chatType` — direct, group, etc.

---

## Extension Plugin Format

```
~/.openclaw/extensions/{name}/
├── openclaw.plugin.json    # {"id": "name", "channels": ["name"], "configSchema": {...}}
├── package.json            # Standard npm package
├── index.ts                # Entry point
└── src/
    ├── channel.ts          # Channel implementation
    ├── actions.ts          # Available actions
    ├── runtime.ts          # Runtime initialization
    ├── config-schema.ts    # Configuration schema
    └── types.ts            # TypeScript types
```

---

## License

MIT
