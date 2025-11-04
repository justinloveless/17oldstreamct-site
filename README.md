# Static Site Template

Static website template with JSON-based content management system.

> **Note**: This repository includes a property listing site as an example, but the pattern works for any static website. Use it as-is for property listings, or replace the content and HTML with your own use case.

## Features

- **Dynamic Content Loading**: All content loaded from JSON and Markdown files
- **Asset Management**: Centralized `site-assets.json` configuration
- **Schema Validation**: Define data structure with JSON schemas
- **CLI Tools**: Commands to easily add new content assets
- **Easy Content Updates**: No code changes needed to update content
- **Framework-agnostic**: Pure HTML, CSS, and vanilla JavaScript

## Quick Start

1. **Use this as a GitHub template**
   - Click "Use this template" button on GitHub
   - Clone your new repository

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Edit content files for your site**
   - Update JSON files in `content/` directory with your data
   - Modify `content/summary.md` with your content
   - Replace images in `assets/` folder
   - Update `content/image-descriptions.json` with your image filenames

4. **Open `index.html`** in browser to view

## What Makes This Template Reusable?

This template separates **content** from **code**:
- All editable content lives in JSON/Markdown files
- `site-assets.json` defines what content exists
- `script.js` loads content dynamically based on the config
- Update content without touching code

Perfect for:
- Property listings, portfolios, product pages
- Marketing landing pages
- Documentation sites
- Any site where content changes frequently

## Example Site Structure

This repository includes a property listing site as an example. You can:
- **Keep the example** and customize it for your property listing
- **Replace everything** with your own content and HTML structure
- **Use as reference** to understand the pattern

## Adding New Assets

Use the CLI tool to easily add new content assets:

```bash
# Add existing file
npm run add-asset path/to/file.json

# Create new file (will prompt for details)
npm run add-asset content/new-section.json
```

The tool will:
1. ✓ Add entry to `site-assets.json` with validation rules
2. ✓ Generate handler code for `script.js`
3. ✓ Create starter file if it doesn't exist

### Manual Asset Addition

Alternatively, edit `site-assets.json` directly and add corresponding loader code to `script.js`.

## Content Structure

### `site-assets.json`
Central configuration defining all manageable assets:
- File paths and types
- Validation rules (max size, allowed extensions)
- JSON schemas for structured data
- Human-readable labels and descriptions

### Content Files (Example)
The included example is a property listing site with:
- `content/property.json` - Property data
- `content/hero-description.json` - Hero section text
- `content/summary.md` - Markdown content
- `content/image-descriptions.json` - Gallery metadata
- `assets/` - Images and media files

For your own site, create whatever content files make sense for your use case.

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in Settings → Pages
3. Select branch (usually `main`) and root folder
4. Site will be live at `https://username.github.io/repo-name`

### Custom Domain
Add `CNAME` file with your domain name.

## Customization

### Styling
Edit `styles.css` to customize appearance.

### Content Loading
Modify `script.js` to add new content handlers. Follow pattern in `populateContent()` function.

### HTML Structure
Edit `index.html` to change layout or add sections.

## Schema Validation

Assets with JSON schemas in `site-assets.json` can be validated. Schemas define:
- Required fields
- Data types
- Format constraints

Example schema:
```json
{
  "type": "object",
  "required": ["address", "location", "price"],
  "properties": {
    "address": { "type": "string" },
    "price": { "type": "string" }
  }
}
```

## License

MIT