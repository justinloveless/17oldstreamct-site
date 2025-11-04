# Property Site Template

Dynamic property listing site with JSON-based content management.

## Features

- **Dynamic Content Loading**: All content loaded from JSON and Markdown files
- **Asset Management**: Centralized `site-assets.json` configuration
- **Responsive Design**: Mobile-friendly property listing layout
- **Image Gallery**: Lightbox with keyboard navigation
- **Easy Content Updates**: No code changes needed to update property info

## Quick Start

### New Property Site (Recommended)

1. **Use this as a GitHub template**
   - Click "Use this template" button on GitHub
   - Clone your new repository

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run initialization wizard**
   ```bash
   npm run init
   ```
   This will prompt you for property details and auto-populate content files.

4. **Add your images**
   - Replace images in `assets/` folder
   - Update `content/image-descriptions.json` with your image filenames

5. **Open `index.html`** in browser to view

### Manual Setup

1. **Clone or use as template**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Edit content files**
   - `content/property.json` - Property details (address, price, specs)
   - `content/hero-description.json` - Hero section text
   - `content/summary.md` - Property description and highlights
   - `content/image-descriptions.json` - Gallery image metadata
   - Replace images in `assets/` folder

4. **Open `index.html`** in browser to view

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

### Content Files
- `content/property.json` - Property data matching schema
- `content/hero-description.json` - Hero section text
- `content/summary.md` - Markdown content
- `content/image-descriptions.json` - Gallery metadata
- `assets/` - Images and media files

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

Example schema from `property.json`:
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