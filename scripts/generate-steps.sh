#!/bin/bash

# Script to generate authentication.steps.ts from authentication.feature
# Usage: ./scripts/generate-steps.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FEATURE_FILE="$PROJECT_DIR/tests/features/authentication.feature"
OUTPUT_FILE="$PROJECT_DIR/tests/steps/authentication.steps.ts"

if [ ! -f "$FEATURE_FILE" ]; then
    echo "Error: Feature file not found: $FEATURE_FILE"
    exit 1
fi

echo "Reading feature file: $FEATURE_FILE"

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Start generating the TypeScript file
cat > "$OUTPUT_FILE" << 'EOF'
import { Given, When, Then, DataTable } from '@cucumber/cucumber';


EOF

# Track seen step patterns to avoid duplicates
declare -A seen_patterns
previous_keyword="Given"

# Function to escape special characters in Cucumber expressions
escape_pattern() {
    local pattern="$1"
    # Escape forward slashes
    pattern=$(echo "$pattern" | sed 's/\//\\\//g')
    # Escape parentheses
    pattern=$(echo "$pattern" | sed 's/(/\\(/g')
    pattern=$(echo "$pattern" | sed 's/)/\\)/g')
    echo "$pattern"
}

# Function to convert step text to pattern
convert_to_pattern() {
    local step_text="$1"
    local has_data_table=0
    local pattern="$step_text"
    
    # Check if step ends with colon (DataTable indicator)
    if [[ "$pattern" =~ :$ ]]; then
        has_data_table=1
        pattern="${pattern%:}"
        pattern=$(echo "$pattern" | sed 's/[[:space:]]*$//')
    fi
    
    # Replace quoted strings with {string}
    local param_count=0
    while [[ "$pattern" =~ \"([^\"]*)\" ]]; do
        pattern=$(echo "$pattern" | sed "s/\"[^\"]*\"/{string}/")
        param_count=$((param_count + 1))
    done
    
    # Replace standalone numbers with {int}
    # This is a simplified version - may need refinement
    pattern=$(echo "$pattern" | sed -E 's/\b([0-9]+)\b/{int}/g')
    
    # Escape special characters
    pattern=$(escape_pattern "$pattern")
    
    echo "$pattern|$param_count|$has_data_table"
}

# Function to generate parameter list
generate_params() {
    local param_count=$1
    local has_data_table=$2
    local params=""
    
    for ((i=0; i<param_count; i++)); do
        if [ -n "$params" ]; then
            params="$params, "
        fi
        params="${params}arg$i: string"
    done
    
    if [ $has_data_table -eq 1 ]; then
        if [ -n "$params" ]; then
            params="$params, "
        fi
        params="${params}dataTable: DataTable"
    fi
    
    echo "$params"
}

# Function to get step comment
get_step_comment() {
    local keyword="$1"
    case "$keyword" in
        Given)
            echo "[Given] Sets up the initial state of the system."
            ;;
        When)
            echo "[When] Describes the action or event that triggers the scenario."
            ;;
        Then)
            echo "[Then] Describes the expected outcome or result of the scenario."
            ;;
        *)
            echo "[And] Additional step that continues the previous step type."
            ;;
    esac
}

# Function to normalize keyword
normalize_keyword() {
    local keyword="$1"
    case "$keyword" in
        And|But)
            echo "$previous_keyword"
            ;;
        *)
            echo "$keyword"
            ;;
    esac
}

# Process the feature file
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines, comments, and headers
    trimmed=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    if [[ -z "$trimmed" ]] || \
       [[ "$trimmed" =~ ^# ]] || \
       [[ "$trimmed" =~ ^Feature: ]] || \
       [[ "$trimmed" =~ ^Scenario: ]] || \
       [[ "$trimmed" =~ ^Background: ]] || \
       [[ "$trimmed" =~ ^## ]]; then
        continue
    fi
    
    # Match step keywords
    if [[ "$trimmed" =~ ^(Given|When|Then|And|But)[[:space:]]+(.+)$ ]]; then
        keyword="${BASH_REMATCH[1]}"
        step_text="${BASH_REMATCH[2]}"
        
        normalized_keyword=$(normalize_keyword "$keyword")
        if [[ "$normalized_keyword" != "And" && "$normalized_keyword" != "But" ]]; then
            previous_keyword="$normalized_keyword"
        fi
        
        # Convert to pattern
        pattern_info=$(convert_to_pattern "$step_text")
        IFS='|' read -r pattern param_count has_data_table <<< "$pattern_info"
        
        # Create unique key for deduplication
        pattern_key="${normalized_keyword}:${pattern}"
        
        if [[ -z "${seen_patterns[$pattern_key]}" ]]; then
            seen_patterns[$pattern_key]=1
            
            # Generate parameters
            params=$(generate_params "$param_count" "$has_data_table")
            
            # Get comment
            comment=$(get_step_comment "$normalized_keyword")
            
            # Write step definition
            {
                echo "${normalized_keyword}(\`${pattern}\`, (${params}) => {"
                echo "    // ${comment}"
                if [ $has_data_table -eq 1 ]; then
                    echo "    // <DataTable> argument is detected:"
                    echo "    // - With column headers: use DataTable.rowsHash(), which outputs an object containing key-value pairs for each row (e.g. { key1: value, key2: value })."
                    echo "    // - With row headers: use DataTable.hashes(), which outputs an array of objects (e.g. [{ key1: value, key2: value }])."
                fi
                echo "});"
                echo ""
            } >> "$OUTPUT_FILE"
        fi
    fi
done < "$FEATURE_FILE"

echo "Generated step definitions written to: $OUTPUT_FILE"
echo "Total unique step definitions: ${#seen_patterns[@]}"



