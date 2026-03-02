#!/usr/bin/env sh
set -e

echo "[entrypoint] Running Prisma db push for MongoDB..."
./node_modules/.bin/prisma db push

if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] SEED_ON_START=true -> running seed..."
  node prisma/seed.js || echo "[entrypoint] Seed failed or partially applied, continuing startup"
else
  echo "[entrypoint] SEED_ON_START!=true -> skip seed"
fi

echo "[entrypoint] Starting application..."
if [ -f dist/main.js ]; then
  node dist/main.js
elif [ -f dist/src/main.js ]; then
  node dist/src/main.js
else
  echo "[entrypoint] ERROR: Build output not found. Expected dist/main.js or dist/src/main.js" >&2
  ls -lah dist || true
  exit 1
fi
