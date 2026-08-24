#!/usr/bin/env bash
# Usage: create-preview-env.sh <environment> [--recreate]
# Forks production into <environment>. By default an existing environment is
# reused; with --recreate it is deleted and rebuilt from scratch.
# Prints "created" or "exists" on stdout.
set -euo pipefail

ENV_NAME="$1"
RECREATE="${2:-}"

if [ "$ENV_NAME" = "production" ]; then
  echo "refusing to target production" >&2
  exit 1
fi

env_exists() {
  railway environment list --json \
    | jq -e --arg n "$ENV_NAME" '.environments | any(.name == $n)' >/dev/null
}

if [ "$RECREATE" = "--recreate" ]; then
  # Clear any orphan left by a cancelled run, then wait for the delete to land
  # so the fork below does not race it.
  railway environment delete "$ENV_NAME" -y >/dev/null 2>&1 || true
  for _ in $(seq 1 12); do
    env_exists || break
    sleep 5
  done
  if env_exists; then
    echo "environment $ENV_NAME still exists after delete" >&2
    exit 1
  fi
elif env_exists; then
  echo "exists"
  exit 0
fi

railway environment new "$ENV_NAME" --duplicate production --json >&2

# The fork copies every service, including the nightly backup cron and its
# production R2 credentials. Backup keys carry no environment discriminator, so
# a live preview would upload its own database into the production backup
# bucket looking exactly like a real backup. Deletion is scoped to this
# environment; retried because the fork is still provisioning.
for i in $(seq 1 10); do
  if railway service delete --service "Database Backup" --environment "$ENV_NAME" -y >&2; then
    echo "created"
    exit 0
  fi
  echo "waiting to remove Database Backup from $ENV_NAME... ($i)" >&2
  sleep 5
done

echo "could not remove Database Backup from $ENV_NAME; tearing the environment down rather than leave it running the production backup cron" >&2
railway environment delete "$ENV_NAME" -y >&2 || true
exit 1
