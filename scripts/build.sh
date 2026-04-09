#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Installing dependencies ==="
cd "$ROOT_DIR/apps/web-client" && npm install
cd "$ROOT_DIR/apps/gateway" && npm install

echo "=== Building web-client ==="
cd "$ROOT_DIR/apps/web-client" && npx tsc && npx vite build

echo "=== Building gateway ==="
cd "$ROOT_DIR/apps/gateway" && npx prisma generate && npx tsc

echo "=== Build complete ==="
