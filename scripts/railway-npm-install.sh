#!/usr/bin/env bash
# Writes .npmrc from NPM_RC at build runtime so the token isn't baked into the build command/logs.
set -euo pipefail

if [ -n "${NPM_RC:-}" ]; then
  printf '%s' "$NPM_RC" > .npmrc
fi

npm ci
