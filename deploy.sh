#!/usr/bin/env bash
# Обновление и сборка сайта loomixx.ru на сервере (/var/www/loomixx).
# Собирает SPA + api-server (Люмик), перезапускает API-сервис, reload nginx.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

API_ENV="${API_ENV:-/etc/loomixx/api.env}"
API_SERVICE="${API_SERVICE:-loomixx-api}"

echo "==> git pull"
git pull --ff-only

echo "==> pnpm install"
pnpm install --frozen-lockfile

echo "==> build @workspace/loomixx"
export PORT=4173
export BASE_PATH=/
pnpm --filter @workspace/loomixx run build

DIST="$ROOT/artifacts/loomixx/dist/public"
if [[ ! -f "$DIST/index.html" ]]; then
  echo "ERROR: нет $DIST/index.html — сборка не удалась" >&2
  exit 1
fi

echo "==> build @workspace/api-server"
pnpm --filter @workspace/api-server run build

API_DIST="$ROOT/artifacts/api-server/dist/index.mjs"
if [[ ! -f "$API_DIST" ]]; then
  echo "ERROR: нет $API_DIST — сборка API не удалась" >&2
  exit 1
fi

if [[ ! -f "$API_ENV" ]]; then
  echo "WARN: нет $API_ENV — Люмик без DEEPSEEK_API_KEY уйдёт в soft fallback" >&2
  echo "      создай файл (chmod 600) с:" >&2
  echo "      DEEPSEEK_API_KEY=sk-..." >&2
  echo "      DEEPSEEK_MODEL=deepseek-flash" >&2
elif ! grep -qE '^DEEPSEEK_API_KEY=.+' "$API_ENV"; then
  echo "WARN: в $API_ENV пустой/нет DEEPSEEK_API_KEY — soft fallback" >&2
fi

if systemctl list-unit-files "${API_SERVICE}.service" >/dev/null 2>&1 \
  || systemctl cat "${API_SERVICE}.service" >/dev/null 2>&1; then
  echo "==> restart ${API_SERVICE}"
  sudo systemctl restart "${API_SERVICE}"
  sudo systemctl --no-pager --full status "${API_SERVICE}" | head -n 12 || true
else
  echo "WARN: systemd unit ${API_SERVICE}.service не найден" >&2
  echo "      один раз: sudo cp deploy/loomixx-api.service /etc/systemd/system/" >&2
  echo "               sudo systemctl daemon-reload && sudo systemctl enable --now ${API_SERVICE}" >&2
  echo "      nginx: добавь location /api/ из deploy/nginx-api.snippet.conf" >&2
fi

echo "==> nginx reload"
sudo nginx -t
sudo systemctl reload nginx

echo "OK → https://loomixx.ru"
echo "    static: $DIST"
echo "    api:    $API_DIST (systemd: ${API_SERVICE})"
echo "    check:  curl -sS https://loomixx.ru/api/healthz"
