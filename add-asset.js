#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Load site-assets.json
function loadSiteAssets() {
  try {
    const data = fs.readFileSync('site-assets.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    log('Error loading site-assets.json', 'red');
    process.exit(1);
  }
}

// Save site-assets.json
function saveSiteAssets(assets) {
  try {
    fs.writeFileSync('site-assets.json', JSON.stringify(assets, null, 2));
    log('✓ Updated site-assets.json', 'green');
  } catch (error) {
    log('Error saving site-assets.json', 'red');
    process.exit(1);
  }
}

// Detect file type based on extension
function detectFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.json'].includes(ext)) return 'json';
  if (['.md', '.txt'].includes(ext)) return 'text';
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'image';
  return 'unknown';
}

// Get schema suggestions based on file name
function suggestSchema(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  
  // Common schemas
  const schemas = {
    contact: {
      type: 'object',
      required: ['email', 'phone'],
      properties: {
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        address: { type: 'string' }
      }
    },
    metadata: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } }
      }
    }
  };
  
  if (basename.includes('contact')) return schemas.contact;
  if (basename.includes('meta')) return schemas.metadata;
  return null;
}

// Generate handler code for script.js
function generateHandlerCode(asset) {
  const { path: assetPath, type, label } = asset;
  const varName = label.replace(/[^a-zA-Z0-9]/g, '').replace(/^[A-Z]/, c => c.toLowerCase());
  
  let code = `\n  // Load ${label}\n`;
  code += `  const ${varName}Data = contentData['${assetPath}'];\n`;
  code += `  if (${varName}Data) {\n`;
  
  if (type === 'json') {
    code += `    // TODO: Add DOM manipulation to populate ${label} data\n`;
    code += `    // Example: document.querySelector('.${varName}').textContent = ${varName}Data.propertyName;\n`;
  } else if (type === 'text') {
    code += `    // TODO: Add logic to display ${label}\n`;
    code += `    // Example: document.querySelector('.${varName}').innerHTML = ${varName}Data;\n`;
  }
  
  code += `  }\n`;
  
  return code;
}

// Create empty file with starter content
function createStarterFile(filePath, type) {
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`✓ Created directory: ${dir}`, 'green');
  }
  
  let content = '';
  
  if (type === 'json') {
    content = '{\n  "example": "value"\n}\n';
  } else if (type === 'text') {
    content = '# New Content\n\nAdd your content here.\n';
  }
  
  fs.writeFileSync(filePath, content);
  log(`✓ Created file: ${filePath}`, 'green');
}

// Main function
async function main() {
  log('\n=== Add New Asset to Property Site ===\n', 'bright');
  
  // Get file path from command line or prompt
  let filePath = process.argv[2];
  let fileExists = false;
  
  if (filePath) {
    fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      log(`File "${filePath}" does not exist.`, 'yellow');
    }
  }
  
  // Prompt for asset details
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Asset path (relative to project root):',
      default: filePath || 'content/new-asset.json',
      when: !filePath
    },
    {
      type: 'confirm',
      name: 'createFile',
      message: 'File does not exist. Create it?',
      default: true,
      when: () => filePath && !fileExists || false
    },
    {
      type: 'list',
      name: 'type',
      message: 'Asset type:',
      choices: ['json', 'text', 'image', 'directory'],
      default: () => {
        const targetPath = filePath || answers?.path || '';
        return detectFileType(targetPath);
      }
    },
    {
      type: 'input',
      name: 'label',
      message: 'Asset label (human-readable name):',
      default: (answers) => {
        const targetPath = filePath || answers.path;
        return path.basename(targetPath, path.extname(targetPath))
          .split(/[-_]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Asset description:',
      default: ''
    },
    {
      type: 'number',
      name: 'maxSize',
      message: 'Max file size (bytes):',
      default: (answers) => {
        if (answers.type === 'image') return 2097152; // 2MB
        if (answers.type === 'json') return 5120; // 5KB
        if (answers.type === 'text') return 51200; // 50KB
        return 10485760; // 10MB for directory
      }
    },
    {
      type: 'input',
      name: 'allowedExtensions',
      message: 'Allowed file extensions (comma-separated):',
      default: (answers) => {
        if (answers.type === 'image') return '.jpg,.jpeg,.png,.webp';
        if (answers.type === 'json') return '.json';
        if (answers.type === 'text') return '.md,.txt';
        return '';
      },
      filter: (input) => input.split(',').map(ext => ext.trim())
    },
    {
      type: 'confirm',
      name: 'addSchema',
      message: 'Add JSON schema validation?',
      default: false,
      when: (answers) => answers.type === 'json'
    },
    {
      type: 'editor',
      name: 'schema',
      message: 'Edit JSON schema (opens in editor):',
      default: (answers) => {
        const targetPath = filePath || answers.path;
        const suggested = suggestSchema(targetPath);
        return JSON.stringify(suggested || {
          type: 'object',
          properties: {}
        }, null, 2);
      },
      when: (answers) => answers.addSchema,
      filter: (input) => {
        try {
          return JSON.parse(input);
        } catch {
          return null;
        }
      }
    },
    {
      type: 'confirm',
      name: 'generateHandler',
      message: 'Generate handler code for script.js?',
      default: true,
      when: (answers) => answers.type !== 'directory' && answers.type !== 'image'
    }
  ]);
  
  // Use provided path or answered path
  const targetPath = filePath || answers.path;
  
  // Create file if needed
  if (!fs.existsSync(targetPath)) {
    if (answers.createFile !== false && answers.type !== 'directory') {
      createStarterFile(targetPath, answers.type);
    }
  }
  
  // Build asset object
  const asset = {
    path: targetPath,
    type: answers.type,
    label: answers.label,
    description: answers.description,
    maxSize: answers.maxSize,
    allowedExtensions: answers.allowedExtensions
  };
  
  if (answers.schema) {
    asset.schema = answers.schema;
  }
  
  // Add to site-assets.json
  const siteAssets = loadSiteAssets();
  
  // Check if asset already exists
  const existingIndex = siteAssets.assets.findIndex(a => a.path === targetPath);
  if (existingIndex !== -1) {
    log(`\nAsset with path "${targetPath}" already exists. Updating...`, 'yellow');
    siteAssets.assets[existingIndex] = asset;
  } else {
    siteAssets.assets.push(asset);
  }
  
  saveSiteAssets(siteAssets);
  
  // Generate handler code
  if (answers.generateHandler) {
    const handlerCode = generateHandlerCode(asset);
    log('\n=== Generated Handler Code ===', 'cyan');
    log('Add this to the populateContent() function in script.js:\n', 'yellow');
    log(handlerCode, 'bright');
  }
  
  log('\n✓ Asset added successfully!', 'green');
  log(`\nNext steps:`, 'cyan');
  log(`1. Edit ${targetPath} with your content`);
  log(`2. Add handler code to script.js (if not already done)`);
  log(`3. Update HTML to include elements for displaying this content\n`);
}

// Run
main().catch(error => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});
