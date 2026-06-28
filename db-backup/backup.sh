#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?}"
: "${R2_BUCKET:?}"
: "${R2_ENDPOINT:?}"
: "${R2_ACCESS_KEY_ID:?}"
: "${R2_SECRET_ACCESS_KEY:?}"

timestamp=$(date -u +%Y-%m-%dT%H-%M-%SZ)
file="/tmp/baf-${timestamp}.dump"
key="baf-${timestamp}.dump"
[ -n "${R2_PREFIX:-}" ] && key="${R2_PREFIX}/${key}"

echo "Dumping database to ${file}"
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-privileges --file="$file"

echo "Uploading to s3://${R2_BUCKET}/${key}"
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION=auto \
  aws s3 cp "$file" "s3://${R2_BUCKET}/${key}" --endpoint-url "$R2_ENDPOINT"

echo "Backup complete: ${key} ($(du -h "$file" | cut -f1))"
