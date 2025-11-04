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
2. Add generated handler code to `script.js`
3. Add HTML section to display the content

### Adding a New Text Section

**Example: Adding about page content**

```bash
npm run add-asset content/about.md
```

Creates file and adds to `site-assets.json`. Then:
1. Edit `content/about.md` with markdown content
2. Add handler in `script.js`:
   ```javascript
   const aboutData = contentData['content/about.md'];
   if (aboutData) {
     const section = document.querySelector('.about .container');
     section.innerHTML = parseMarkdown(aboutData); // Use your MD parser
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

### Add New Data Fields
1. Add fields to your JSON content file
2. Update schema in `site-assets.json` (if using validation)
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
