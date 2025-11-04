#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('\n=== Initialize New Property Site ===\n', 'bright');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'address',
      message: 'Property address:',
      validate: (input) => input.trim() !== '' || 'Address is required'
    },
    {
      type: 'input',
      name: 'location',
      message: 'City, State ZIP:',
      validate: (input) => input.trim() !== '' || 'Location is required'
    },
    {
      type: 'input',
      name: 'price',
      message: 'Price (e.g., $379,000):',
      validate: (input) => input.trim() !== '' || 'Price is required'
    },
    {
      type: 'input',
      name: 'zillowUrl',
      message: 'Zillow URL (optional):',
      default: ''
    },
    {
      type: 'input',
      name: 'bedrooms',
      message: 'Number of bedrooms:',
      default: '3'
    },
    {
      type: 'input',
      name: 'bathrooms',
      message: 'Number of bathrooms:',
      default: '2'
    },
    {
      type: 'input',
      name: 'squareFeet',
      message: 'Square footage (e.g., 1,456):',
      default: ''
    },
    {
      type: 'input',
      name: 'lotSize',
      message: 'Lot size (e.g., 10,794 sqft):',
      default: ''
    },
    {
      type: 'input',
      name: 'yearBuilt',
      message: 'Year built:',
      default: ''
    },
    {
      type: 'input',
      name: 'pricePerSqft',
      message: 'Price per sqft (e.g., $260):',
      default: ''
    },
    {
      type: 'input',
      name: 'heroTitle',
      message: 'Hero section title:',
      default: 'Beautiful Property'
    },
    {
      type: 'input',
      name: 'heroSubtitle',
      message: 'Hero section subtitle:',
      default: 'Your dream home awaits'
    },
    {
      type: 'input',
      name: 'heroAlt',
      message: 'Hero image alt text:',
      default: (answers) => `${answers.address} exterior`
    }
  ]);
  
  // Update property.json
  const propertyData = {
    address: answers.address,
    location: answers.location,
    price: answers.price,
    zillowUrl: answers.zillowUrl || undefined,
    details: {
      bedrooms: answers.bedrooms,
      bathrooms: answers.bathrooms,
      squareFeet: answers.squareFeet,
      lotSize: answers.lotSize,
      yearBuilt: answers.yearBuilt,
      pricePerSqft: answers.pricePerSqft
    }
  };
  
  // Remove undefined values
  Object.keys(propertyData).forEach(key => 
    propertyData[key] === undefined && delete propertyData[key]
  );
  Object.keys(propertyData.details).forEach(key => 
    propertyData.details[key] === '' && delete propertyData.details[key]
  );
  
  fs.writeFileSync('content/property.json', JSON.stringify(propertyData, null, 2));
  log('✓ Updated content/property.json', 'green');
  
  // Update hero-description.json
  const heroData = {
    alt: answers.heroAlt,
    title: answers.heroTitle,
    subtitle: answers.heroSubtitle
  };
  
  fs.writeFileSync('content/hero-description.json', JSON.stringify(heroData, null, 2));
  log('✓ Updated content/hero-description.json', 'green');
  
  // Update summary.md with template
  const summaryTemplate = `# ${answers.heroTitle}

Welcome to ${answers.address}, located in ${answers.location.split(',')[0]}. This ${answers.bedrooms}-bedroom, ${answers.bathrooms}-bathroom home offers ${answers.squareFeet} square feet of comfortable living space.

## Property Highlights

### Location
Located in a desirable neighborhood with easy access to local amenities.

### Features
Modern updates and thoughtful design throughout.

### Outdoor Space
Enjoy the ${answers.lotSize} lot with plenty of room for outdoor activities.

---

Schedule a viewing today to see this amazing property in person!

📸 Contact us for more information.
🏡 Make this house your home.
`;
  
  fs.writeFileSync('content/summary.md', summaryTemplate);
  log('✓ Updated content/summary.md', 'green');
  
  log('\n✓ Site initialized successfully!', 'green');
  log('\nNext steps:', 'cyan');
  log('1. Replace images in the assets/ folder');
  log('2. Update content/image-descriptions.json with your image filenames');
  log('3. Edit content/summary.md to add property-specific details');
  log('4. Update the "Facts & Features" section in index.html');
  log('5. Test by opening index.html in a browser\n');
}

main().catch(error => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});
