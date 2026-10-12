#!/usr/bin/env bash
# Обновление и сборка сайта loomixx.ru на сервере (/var/www/loomixx).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

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

echo "==> nginx reload"
sudo nginx -t
sudo systemctl reload nginx

echo "OK → https://loomixx.ru"
echo "    static: $DIST"
