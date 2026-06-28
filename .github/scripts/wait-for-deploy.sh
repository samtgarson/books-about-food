#!/usr/bin/env bash
# Usage: wait-for-deploy.sh <service> <environment> [attempts]
set -euo pipefail

SERVICE="$1"
ENVIRONMENT="$2"
ATTEMPTS="${3:-90}"

for _ in $(seq 1 "$ATTEMPTS"); do
  status=$(railway deployment list --service "$SERVICE" --environment "$ENVIRONMENT" --json 2>/dev/null \
    | jq -r '.[0].status // "UNKNOWN"')
  echo "[$SERVICE/$ENVIRONMENT] deployment status: $status"
  case "$status" in
    SUCCESS)
      exit 0
      ;;
    FAILED | CRASHED)
      echo "Deployment for $SERVICE in $ENVIRONMENT ended as $status" >&2
      exit 1
      ;;
  esac
  sleep 10
done

echo "Timed out waiting for $SERVICE in $ENVIRONMENT to deploy" >&2
exit 1
