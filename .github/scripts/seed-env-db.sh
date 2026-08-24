#!/usr/bin/env bash
# Usage: seed-env-db.sh <environment>
# Restores a scrubbed copy of production's payload schema into <environment>.
set -euo pipefail

ENV_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$ENV_NAME" = "production" ]; then
  echo "refusing to target production" >&2
  exit 1
fi

PROD_DB=$(railway variables --service Postgres --environment production --json | jq -r '.DATABASE_PUBLIC_URL')

# Wait for the duplicated Postgres to deploy and start accepting connections.
TARGET_DB=""
for i in $(seq 1 30); do
  TARGET_DB=$(railway variables --service Postgres --environment "$ENV_NAME" --json | jq -r '.DATABASE_PUBLIC_URL // empty')
  if [ -n "$TARGET_DB" ] && pg_isready -d "$TARGET_DB" >/dev/null 2>&1; then
    echo "Postgres in $ENV_NAME ready"
    break
  fi
  echo "waiting for Postgres in $ENV_NAME... ($i)"
  sleep 10
done
if [ -z "$TARGET_DB" ] || ! pg_isready -d "$TARGET_DB" >/dev/null 2>&1; then
  echo "Postgres in $ENV_NAME never became ready" >&2
  exit 1
fi

# DROP first so the restore is order-independent (the duplicated web may have auto-migrated).
psql "$TARGET_DB" -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS payload CASCADE;"
pg_dump "$PROD_DB" --schema=payload --no-owner --no-privileges \
  | psql "$TARGET_DB" -v ON_ERROR_STOP=1
psql "$TARGET_DB" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/scrub-ci-db.sql"
