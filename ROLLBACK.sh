#!/usr/bin/env bash
set -euo pipefail
cp -- "src/LyricVideo.tsx.before_upgrade" "src/LyricVideo.tsx"
printf 'ROLLBACK_OK: restored src/LyricVideo.tsx\n'
