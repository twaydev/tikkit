import * as fs from 'fs';
import * as path from 'path';

interface StepDefinition {
  keyword: 'Given' | 'When' | 'Then' | 'And';
  text: string;
  pattern: string;
  parameters: string[];
  hasDataTable: boolean;
}

/**
 * Escapes special characters in Cucumber expressions
 * Note: Forward slashes should be escaped BEFORE calling this function
 */
function escapeCucumberExpression(text: string): string {
  // Escape parentheses (optional groups)
  // Replace unescaped parentheses
  text = text.replace(/([^\\])\(/g, '$1\\(');
  text = text.replace(/([^\\])\)/g, '$1\\)');
  // Handle parentheses at the start of string
  if (text.startsWith('(')) {
    text = '\\(' + text.substring(1);
  }
  if (text.startsWith(')')) {
    text = '\\)' + text.substring(1);
  }
  return text;
}

/**
 * Converts a step text to a Cucumber expression pattern
 */
function convertToPattern(stepText: string): { pattern: string; parameters: string[]; hasDataTable: boolean } {
  let pattern = stepText.trim();
  const parameters: string[] = [];
  const hasDataTable = pattern.endsWith(':');
  
  if (hasDataTable) {
    pattern = pattern.slice(0, -1).trim();
  }

  // Replace quoted strings with {string}
  pattern = pattern.replace(/"([^"]*)"/g, (match, content) => {
    parameters.push('string');
    return '{string}';
  });

  // Handle parameters inside parentheses - extract them first
  // Pattern: (text {int} text) or (text > {int} text)
  // We'll extract the parameter and move it outside or restructure
  const parenWithParamRegex = /\(([^)]*?)(\d+)([^)]*?)\)/g;
  const parenMatches: Array<{ full: string; before: string; num: string; after: string }> = [];
  let match;
  
  while ((match = parenWithParamRegex.exec(pattern)) !== null) {
    parenMatches.push({
      full: match[0],
      before: match[1],
      num: match[2],
      after: match[3]
    });
  }

  // Replace parentheses with parameters - restructure to avoid parameter inside parentheses
  for (const pm of parenMatches) {
    // Extract the number and replace the whole parenthetical with a restructured version
    // Example: "(1 hour validity)" -> "{int} hour validity" (removing parentheses)
    // Or: "(> 7 days)" -> "greater than {int} days"
    let replacement = '';
    if (pm.before.trim() === '>') {
      replacement = `greater than {int}${pm.after}`;
    } else if (pm.before.trim() === '' && pm.after.trim()) {
      replacement = `{int}${pm.after}`;
    } else {
      // Keep the structure but move parameter outside
      replacement = `${pm.before}{int}${pm.after}`;
    }
    pattern = pattern.replace(pm.full, replacement);
    parameters.push('number');
  }

  // Handle parentheses without parameters but with forward slashes
  // These need special handling to avoid alternation issues
  // Pattern: (text/text) -> remove parentheses entirely and replace slash with " or "
  // We need to do this before escaping, and we need to track which parentheses we've already processed
  const parenWithSlashRegex = /\(([^)]*\/[^)]*)\)/g;
  const processedParens = new Set<string>();
  let slashMatch;
  const replacements: Array<{ original: string; replacement: string }> = [];
  
  while ((slashMatch = parenWithSlashRegex.exec(pattern)) !== null) {
    const fullParen = slashMatch[0];
    if (!processedParens.has(fullParen)) {
      processedParens.add(fullParen);
      const content = slashMatch[1];
      // Replace forward slash with " or " and remove parentheses entirely to avoid alternation issues
      const fixedContent = content.replace(/\//g, ' or ');
      replacements.push({
        original: fullParen,
        replacement: fixedContent // Remove parentheses completely
      });
    }
  }
  
  // Apply replacements in reverse order to maintain indices
  for (let i = replacements.length - 1; i >= 0; i--) {
    pattern = pattern.replace(replacements[i].original, replacements[i].replacement);
  }

  // Replace remaining numbers with {int}
  // Match standalone numbers (not part of words or already in curly braces)
  pattern = pattern.replace(/\b(\d+)\b/g, (match, num) => {
    // Check if this number is already part of a parameter
    if (!pattern.includes(`{${num}}`)) {
      parameters.push('number');
      return '{int}';
    }
    return match;
  });

  // Handle forward slashes - replace with " or " when they represent alternatives
  // This avoids Cucumber alternation issues
  // Pattern: "link/code" -> "link or code", "hours/minutes" -> "hours or minutes"
  // Also handle cases like "hours/{int}" -> "hours or {int}"
  pattern = pattern.replace(/(\w+)\/(\w+)/g, '$1 or $2');
  pattern = pattern.replace(/(\w+)\/(\{[^}]+\})/g, '$1 or $2');
  pattern = pattern.replace(/(\{[^}]+\})\/(\w+)/g, '$1 or $2');
  pattern = pattern.replace(/(\{[^}]+\})\/(\{[^}]+\})/g, '$1 or $2');
  
  // Escape any remaining forward slashes (shouldn't be many after the above)
  pattern = pattern.replace(/\//g, '\\/');

  // Escape special characters (parentheses)
  // Note: We escape parentheses but Cucumber may still have issues with them in some contexts
  pattern = escapeCucumberExpression(pattern);

  return { pattern, parameters, hasDataTable };
}

/**
 * Generates TypeScript parameter list
 */
function generateParameters(parameters: string[], hasDataTable: boolean): string {
  const params: string[] = [];
  
  parameters.forEach((type, index) => {
    const paramName = `arg${index}`;
    const tsType = type === 'string' ? 'string' : 'number';
    params.push(`${paramName}: ${tsType}`);
  });

  if (hasDataTable) {
    params.push('dataTable: DataTable');
  }

  return params.length > 0 ? params.join(', ') : '';
}

/**
 * Gets the comment for the step type
 */
function getStepComment(keyword: 'Given' | 'When' | 'Then' | 'And'): string {
  const comments: Record<string, string> = {
    Given: '[Given] Sets up the initial state of the system.',
    When: '[When] Describes the action or event that triggers the scenario.',
    Then: '[Then] Describes the expected outcome or result of the scenario.',
    And: '[And] Additional step that continues the previous step type.'
  };
  return comments[keyword] || comments['Given'];
}

/**
 * Normalizes keyword (And -> previous keyword)
 */
function normalizeKeyword(keyword: string, previousKeyword: string): 'Given' | 'When' | 'Then' {
  if (keyword === 'And' || keyword === 'But') {
    return previousKeyword as 'Given' | 'When' | 'Then';
  }
  return keyword as 'Given' | 'When' | 'Then';
}

/**
 * Parses a feature file and extracts all step definitions
 */
function parseFeatureFile(filePath: string): StepDefinition[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const steps: StepDefinition[] = [];
  let previousKeyword: 'Given' | 'When' | 'Then' = 'Given';

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, comments, and feature/scenario headers
    if (!trimmed || 
        trimmed.startsWith('#') || 
        trimmed.startsWith('Feature:') ||
        trimmed.startsWith('Scenario:') ||
        trimmed.startsWith('Background:') ||
        trimmed.startsWith('##')) {
      continue;
    }

    // Match step keywords
    const stepMatch = trimmed.match(/^(Given|When|Then|And|But)\s+(.+)$/);
    if (stepMatch) {
      const keyword = stepMatch[1] as 'Given' | 'When' | 'Then' | 'And' | 'But';
      const stepText = stepMatch[2];
      const normalizedKeyword = normalizeKeyword(keyword, previousKeyword);
      
      // Update previous keyword if this is not an And/But
      if (keyword !== 'And' && keyword !== 'But') {
        previousKeyword = normalizedKeyword;
      }

      const { pattern, parameters, hasDataTable } = convertToPattern(stepText);
      
      steps.push({
        keyword: normalizedKeyword,
        text: stepText,
        pattern,
        parameters,
        hasDataTable
      });
    }
  }

  return steps;
}

/**
 * Generates TypeScript step definition code
 */
function generateStepDefinition(step: StepDefinition): string {
  const params = generateParameters(step.parameters, step.hasDataTable);
  const comment = getStepComment(step.keyword);
  
  let code = `${step.keyword}(\`${step.pattern}\`, (${params}) => {\n`;
  code += `    // ${comment}\n`;
  
  if (step.hasDataTable) {
    code += `    // <DataTable> argument is detected:\n`;
    code += `    // - With column headers: use DataTable.rowsHash(), which outputs an object containing key-value pairs for each row (e.g. { key1: value, key2: value }).\n`;
    code += `    // - With row headers: use DataTable.hashes(), which outputs an array of objects (e.g. [{ key1: value, key2: value }]).\n`;
  }
  
  code += `});\n`;
  
  return code;
}

/**
 * Removes duplicate step definitions (keeps first occurrence)
 */
function deduplicateSteps(steps: StepDefinition[]): StepDefinition[] {
  const seen = new Set<string>();
  const unique: StepDefinition[] = [];

  for (const step of steps) {
    const key = `${step.keyword}:${step.pattern}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(step);
    }
  }

  return unique;
}

/**
 * Recursively finds all .feature files in a directory
 */
function findFeatureFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFeatureFiles(filePath, fileList);
    } else if (file.endsWith('.feature')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main function
 */
function main() {
  // Get script directory - handle both CommonJS and ESM
  const scriptPath = typeof __filename !== 'undefined' ? __filename : process.argv[1];
  const scriptDir = path.dirname(scriptPath);
  const projectDir = path.resolve(scriptDir, '..');
  const featuresDir = path.join(projectDir, 'tests/features');
  const stepsDir = path.join(projectDir, 'tests/steps');

  // Find all .feature files
  console.log(`Searching for .feature files in: ${featuresDir}`);
  const featureFiles = findFeatureFiles(featuresDir);
  
  if (featureFiles.length === 0) {
    console.error('No .feature files found!');
    process.exit(1);
  }

  console.log(`Found ${featureFiles.length} feature file(s):`);
  featureFiles.forEach((file) => {
    console.log(`  - ${path.relative(projectDir, file)}`);
  });

  // Ensure steps directory exists
  if (!fs.existsSync(stepsDir)) {
    fs.mkdirSync(stepsDir, { recursive: true });
  }

  // Process each feature file and generate separate step files
  let totalUniqueSteps = 0;
  const allUniqueSteps = new Set<string>();

  for (const featureFile of featureFiles) {
    const relativeFeaturePath = path.relative(projectDir, featureFile);
    console.log(`\nReading: ${relativeFeaturePath}`);
    
    const steps = parseFeatureFile(featureFile);
    console.log(`  Found ${steps.length} step definitions`);
    
    // Remove duplicates for this feature file
    const uniqueSteps = deduplicateSteps(steps);
    console.log(`  After deduplication: ${uniqueSteps.length} unique step definitions`);

    // Generate TypeScript code for this feature file
    let output = `import { Given, When, Then, DataTable } from '@cucumber/cucumber';\n\n\n`;
    
    // Add comment about source file
    output += `// Generated from: ${relativeFeaturePath}\n`;
    output += `// Total steps: ${steps.length} (${uniqueSteps.length} unique)\n\n\n`;
    
    // Group by keyword for better organization
    const grouped: Record<string, StepDefinition[]> = {
      Given: [],
      When: [],
      Then: []
    };

    for (const step of uniqueSteps) {
      grouped[step.keyword].push(step);
      // Track unique steps across all files
      allUniqueSteps.add(`${step.keyword}:${step.pattern}`);
    }

    // Generate code for each keyword type
    for (const keyword of ['Given', 'When', 'Then'] as const) {
      for (const step of grouped[keyword]) {
        output += generateStepDefinition(step);
        output += '\n';
      }
    }

    // Generate output file name based on feature file name
    const featureFileName = path.basename(featureFile, '.feature');
    const outputFileName = `${featureFileName}.steps.ts`;
    const outputFilePath = path.join(stepsDir, outputFileName);

    // Write to file
    fs.writeFileSync(outputFilePath, output, 'utf-8');
    console.log(`✓ Generated: ${path.relative(projectDir, outputFilePath)}`);
    console.log(`  - Given: ${grouped.Given.length}`);
    console.log(`  - When: ${grouped.When.length}`);
    console.log(`  - Then: ${grouped.Then.length}`);
    
    totalUniqueSteps += uniqueSteps.length;
  }

  console.log(`\n📊 Summary:`);
  console.log(`  - Processed ${featureFiles.length} feature file(s)`);
  console.log(`  - Generated ${featureFiles.length} step definition file(s)`);
  console.log(`  - Total unique step definitions across all files: ${allUniqueSteps.size}`);
}

// Run the script
if (require.main === module) {
  main();
}

