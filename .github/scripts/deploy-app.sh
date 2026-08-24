#!/usr/bin/env bash
# Usage: deploy-app.sh <environment>
# Deploys App to <environment> and prints its reachable URL on stdout.
set -euo pipefail

ENV_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# In CI, railway up returns after build; poll for the terminal deploy status.
railway up --service App --environment "$ENV_NAME" --ci >&2
"$SCRIPT_DIR/wait-for-deploy.sh" App "$ENV_NAME" >&2

# railway domain returns {domain} when new, {domains:[...]} when one already exists.
WEB_URL=$(railway domain --service App --environment "$ENV_NAME" --json | jq -r '.domain // .domains[0]')
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$WEB_URL" || true)
  echo "GET $WEB_URL -> $code" >&2
  [ "$code" != "000" ] && [ "$code" -lt 500 ] && break
  sleep 5
done

echo "$WEB_URL"
