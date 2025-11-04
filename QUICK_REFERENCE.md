# Quick Reference Guide

## Common Commands

### Initial Setup
```bash
npm install              # Install dependencies
```

### Adding Content
```bash
npm run add-asset <path>    # Add new asset to site-assets.json
npm run add-asset           # Interactive mode (prompts for path)
```

## Workflow Examples

### Starting a New Site

1. Use template on GitHub or clone repo
2. `npm install`
3. Edit existing content files or add new ones with `npm run add-asset`
4. Replace images/media in `assets/`
5. Update HTML structure as needed
6. Open `index.html` to preview

### Adding a New Content Section

**Example: Adding team members data**

```bash
npm run add-asset content/team.json
```

When prompted:
- Type: `json`
- Label: `Team Members`
- Description: `Information about team members`
- Generate handler: `yes`

Then:
1. Edit `content/team.json` with actual data
2. Implement handler in `handlers/team.js`:
   ```javascript
   export function handle(data) {
     if (!data || !data.members) return;
     const container = document.querySelector('.team-grid');
     data.members.forEach(member => {
       // Create and append DOM elements
     });
   }
   ```
3. Add HTML section to display the content
4. Handler is automatically loaded by `script.js`

### Adding a New Text Section

**Example: Adding about page content**

```bash
npm run add-asset content/about.md
```

Creates file, adds to `site-assets.json`, and generates `handlers/about.js`. Then:
1. Edit `content/about.md` with markdown content
2. Implement handler in `handlers/about.js`:
   ```javascript
   export function handle(data) {
     if (!data) return;
     const section = document.querySelector('.about');
     if (section) {
       section.innerHTML = data; // Or parse markdown first
     }
   }
   ```
3. Add HTML section with class `about`

## File Structure

```
├── index.html                    # Main HTML file
├── styles.css                    # All styling
├── script.js                     # Content loading & interactions
├── site-assets.json              # Asset configuration & schemas
├── package.json                  # Node dependencies & scripts
├── add-asset.js                  # CLI tool for adding assets
│
├── content/                      # All editable content
│   ├── property.json             # Example: Property details
│   ├── hero-description.json     # Example: Hero section text
│   ├── summary.md                # Example: Main content
│   └── image-descriptions.json   # Example: Gallery metadata
│
├── handlers/                     # Asset handlers (auto-loaded)
│   ├── property.js               # Handler for property.json
│   ├── hero-description.js       # Handler for hero-description.json
│   ├── hero-image.js             # Handler for hero image
│   ├── summary.js                # Handler for summary.md
│   └── gallery.js                # Handler for gallery
│
└── assets/                       # Images and media
    └── *.webp                    # Example: Images
```

## Key Concepts

### site-assets.json
Central registry of all manageable content:
- Defines what files are content vs. code
- Specifies validation rules
- Includes JSON schemas for structured data
- Used by `script.js` to load content dynamically

### Content Loading Flow
1. `script.js` loads on page load
2. Fetches `site-assets.json`
3. Loads all content files listed in assets
4. Dynamically imports each handler module
5. Calls each `handler.handle(data)` function

### Adding Custom Content
Every new content file needs:
1. Entry in `site-assets.json` (use `npm run add-asset`)
2. Handler file in `handlers/` directory
3. HTML elements to display the content

**The handler is automatically loaded** - no need to modify `script.js`!

## Deployment Checklist

- [ ] All content files updated
- [ ] Images replaced and optimized
- [ ] `image-descriptions.json` updated
- [ ] Test locally (open `index.html`)
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Test live site
- [ ] Configure custom domain (if needed)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Content not loading | Check browser console for fetch errors |
| Images not showing | Verify paths in `image-descriptions.json` |
| Styles broken | Clear browser cache, check `styles.css` |
| CLI tool fails | Run `npm install` first |
| JSON parse error | Validate JSON syntax (use linter) |

## Tips

- **Use the CLI tools** - Much faster than manual editing
- **Test locally first** - Always preview before pushing
- **Keep it simple** - Don't overcomplicate the structure
- **Version control** - Commit frequently
- **Document changes** - Update README for custom additions

## Common Customizations

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add New Data Fields
1. Add fields to your JSON content file
2. Update schema in `site-assets.json` (if using validation)
3. Update handler in `handlers/your-asset.js` to display new fields
4. Add HTML elements in `index.html`

### Custom Sections
Follow pattern:
1. Run `npm run add-asset content/your-section.json`
2. Edit content file with your data
3. Implement handler logic in `handlers/your-section.js`
4. Add HTML structure in `index.html`
5. Handler is auto-loaded - done!

## Handler Pattern

### What are Handlers?
Each asset has a dedicated JavaScript file that defines how to display its content. This keeps code modular and maintainable.

### Handler Structure
```javascript
// handlers/my-asset.js
export function handle(data) {
  if (!data) return;
  // Your DOM manipulation logic here
}
```

### Handler Benefits
- ✓ One file per asset - easy to find and edit
- ✓ Automatically loaded by `script.js`
- ✓ No need to modify main script when adding assets
- ✓ Clean separation of concerns

## Support

- See `README.md` for full documentation
- See `CONTRIBUTING.md` for detailed examples
- Check `handlers/*.js` for implementation examples
