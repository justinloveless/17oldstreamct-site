# Contributing Guide

## Setting Up a New Property Site

### Option 1: Using as a Template Repository

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Run `npm install`
4. Update content files with your property information

### Option 2: Manual Clone

```bash
git clone <your-repo-url> my-property-site
cd my-property-site
npm install
```

## Adding New Content Assets

The `add-asset.js` CLI tool simplifies adding new content to your site.

### Basic Usage

```bash
# Interactive mode - will prompt for all details
npm run add-asset content/amenities.json

# With existing file
npm run add-asset existing/file.json
```

### Example: Adding a Contact Form Data File

```bash
npm run add-asset content/contact-info.json
```

The tool will prompt you for:
- **Asset type**: json
- **Label**: Contact Information
- **Description**: Contact details for property inquiries
- **Max size**: 5120 (5KB)
- **Allowed extensions**: .json
- **Add schema?**: Yes (optional)

If you choose to add a schema, you can define:
```json
{
  "type": "object",
  "required": ["email", "phone"],
  "properties": {
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string" },
    "name": { "type": "string" }
  }
}
```

### Example: Adding a New Text Section

```bash
npm run add-asset content/neighborhood.md
```

The tool will:
1. Create `content/neighborhood.md` with starter content
2. Add entry to `site-assets.json`
3. Generate handler code like:

```javascript
// Load Neighborhood
const neighborhoodData = contentData['content/neighborhood.md'];
if (neighborhoodData) {
  // TODO: Add logic to display Neighborhood
  // Example: document.querySelector('.neighborhood').innerHTML = neighborhoodData;
}
```

### After Adding an Asset

1. **Edit the content file** with your actual data
2. **Add handler code** to `script.js` in the `populateContent()` function
3. **Update HTML** to include elements that will display the content

Example HTML addition:
```html
<section class="neighborhood">
  <div class="container">
    <!-- Content will be loaded from neighborhood.md -->
  </div>
</section>
```

## Content File Examples

### JSON Content
```json
{
  "title": "Nearby Amenities",
  "items": [
    { "name": "Park", "distance": "0.3 miles" },
    { "name": "School", "distance": "0.5 miles" }
  ]
}
```

### Markdown Content
```markdown
# About the Neighborhood

This property is located in a vibrant community...

## Local Attractions
- Shopping centers
- Parks and trails
- Restaurants
```

## Deploying Your Site

### GitHub Pages

1. Push your repository to GitHub
2. Go to Settings → Pages
3. Select source branch (main/master)
4. Your site will be available at `https://username.github.io/repo-name`

### Custom Domain

Create a `CNAME` file in the root:
```
your-custom-domain.com
```

Then configure DNS with your domain provider.

## Troubleshooting

### Asset not loading
- Check browser console for errors
- Verify file path in `site-assets.json` matches actual file location
- Ensure file is valid JSON/Markdown

### Handler code not working
- Verify element selectors match your HTML
- Check that content is loaded before accessing (use browser DevTools)
- Look for JavaScript errors in console

### Images not displaying
- Verify image paths in `image-descriptions.json`
- Check that images are in the correct directory
- Ensure file extensions match allowed extensions in `site-assets.json`
