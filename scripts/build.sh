#!/usr/bin/env bash
set -euo pipefail
input=$(cat)
project=$(echo "$input" | python3 -c "import sys, json; print(json.load(sys.stdin).get('project','unknown'))")
output=$(cat <<JSON
{"status": "build complete", "project": "$project"}
JSON
)
printf "%s" "$output"
