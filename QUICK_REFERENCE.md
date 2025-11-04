# Quick Reference Guide

## Common Commands

### Initial Setup
```bash
npm install              # Install dependencies
npm run init             # Initialize with property data (interactive)
```

### Adding Content
```bash
npm run add-asset <path>    # Add new asset to site-assets.json
npm run add-asset           # Interactive mode (prompts for path)
```

## Workflow Examples

### Starting a New Property Site

1. Use template on GitHub or clone repo
2. `npm install`
3. `npm run init` - Enter property details
4. Replace images in `assets/`
5. Update `content/image-descriptions.json`
6. Open `index.html` to preview

### Adding a New Content Section

**Example: Adding testimonials**

```bash
npm run add-asset content/testimonials.json
```

When prompted:
- Type: `json`
- Label: `Testimonials`
- Description: `Customer testimonials and reviews`
- Generate handler: `yes`

Then:
1. Edit `content/testimonials.json` with actual testimonials
2. Add generated handler code to `script.js`
3. Add HTML section to display testimonials

### Adding a New Text Section

**Example: Adding neighborhood info**

```bash
npm run add-asset content/neighborhood.md
```

Creates file and adds to `site-assets.json`. Then:
1. Edit `content/neighborhood.md` with markdown content
2. Add handler in `script.js`:
   ```javascript
   const neighborhoodData = contentData['content/neighborhood.md'];
   if (neighborhoodData) {
     const section = document.querySelector('.neighborhood .container');
     section.innerHTML = parseMarkdown(neighborhoodData); // Use your MD parser
   }
   ```
3. Add HTML section with class `neighborhood`

## File Structure

```
├── index.html                    # Main HTML file
├── styles.css                    # All styling
├── script.js                     # Content loading & interactions
├── site-assets.json              # Asset configuration & schemas
├── package.json                  # Node dependencies & scripts
├── add-asset.js                  # CLI tool for adding assets
├── init-new-site.js              # CLI tool for initialization
│
├── content/                      # All editable content
│   ├── property.json             # Property details
│   ├── hero-description.json     # Hero section text
│   ├── summary.md                # Property description
│   └── image-descriptions.json   # Gallery metadata
│
└── assets/                       # Images and media
    └── *.webp                    # Property images
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
4. Calls `populateContent()` to inject into DOM

### Adding Custom Content
Every new content file needs:
1. Entry in `site-assets.json` (use `npm run add-asset`)
2. Loader code in `script.js`
3. HTML elements to display the content

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

### Add New Property Details
1. Add fields to `content/property.json`
2. Update schema in `site-assets.json`
3. Add display code in `script.js`
4. Add HTML elements in `index.html`

### Custom Sections
Follow pattern:
1. Content file (JSON/MD) → `content/`
2. Asset entry → `site-assets.json`
3. Loader → `script.js`
4. Display → `index.html`

## Support

- See `README.md` for full documentation
- See `CONTRIBUTING.md` for detailed examples
- Check inline comments in `script.js` for patterns
