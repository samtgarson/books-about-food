#!/usr/bin/env bash
# Install step for Railway builds. Materialises the private-registry auth from
# the NPM_RC env var into a local .npmrc (needed for @samtgarson/* packages on
# GitHub Packages), then runs a clean install.
#
# The auth lives in NPM_RC and is read at runtime here (not referenced in the
# Railway build-command config) so the token never gets interpolated into the
# build command or its logs.
set -euo pipefail

if [ -n "${NPM_RC:-}" ]; then
  printf '%s' "$NPM_RC" > .npmrc
fi

npm ci
