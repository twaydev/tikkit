#!/bin/bash
OUTPUT=$(npx cucumber-js --dry-run 2>&1)
SNIPPETS=$(echo "$OUTPUT" | sed -n '/Undefined. Implement with the following snippet:/,/^$/p')

if [ -z "$SNIPPETS" ]; then
  echo "✅ All steps defined!"
  exit 0
fi

TIMESTAMP=$(date +%Y-%m-%d)
OUTPUT_FILE="tests/steps/auto-generated-${TIMESTAMP}.ts"

{
  echo "import { Given, When, Then, DataTable } from '@cucumber/cucumber';"
  echo "import { ICustomWorld } from '../support/world';"
  echo ""
  echo "$SNIPPETS"
} >> "$OUTPUT_FILE"

echo "✅ Snippets appended to $OUTPUT_FILE"
