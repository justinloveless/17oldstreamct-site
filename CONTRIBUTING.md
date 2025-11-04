# Contributing Guide

## Setting Up a New Site

### Using as a Template Repository

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Run `npm install`
4. Update content files with your own content
5. Modify HTML/CSS to match your needs

### Manual Clone

```bash
git clone <your-repo-url> my-site
cd my-site
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

### Example: Adding a Team Members Data File

```bash
npm run add-asset content/team.json
```

The tool will prompt you for:
- **Asset type**: json
- **Label**: Team Members
- **Description**: Information about team members
- **Max size**: 5120 (5KB)
- **Allowed extensions**: .json
- **Add schema?**: Yes (optional)

If you choose to add a schema, you can define:
```json
{
  "type": "object",
  "properties": {
    "members": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "role": { "type": "string" },
          "bio": { "type": "string" }
        }
      }
    }
  }
}
```

### Example: Adding a New Text Section

```bash
npm run add-asset content/about.md
```

The tool will:
1. Create `content/about.md` with starter content
2. Add entry to `site-assets.json`
3. Generate handler file `handlers/about.js`:

```javascript
/**
 * Handler for content/about.md
 * About page content
 */
export function handle(data) {
  if (!data) return;

  // TODO: Add logic to display About
  // Example:
  // const container = document.querySelector('.about');
  // if (container) {
  //   container.innerHTML = data; // Or parse markdown first
  // }
}
```

### After Adding an Asset

1. **Edit the content file** with your actual data
2. **Implement the handler** in `handlers/your-asset.js`
3. **Update HTML** to include elements that will display the content
4. The handler will be **automatically loaded** by `script.js`

Example HTML addition:
```html
<section class="about">
  <div class="container">
    <!-- Content will be loaded from about.md -->
  </div>
</section>
```

## Content File Examples

### JSON Content
```json
{
  "title": "Our Services",
  "items": [
    { "name": "Web Development", "description": "Custom websites" },
    { "name": "Design", "description": "UI/UX design services" }
  ]
}
```

### Markdown Content
```markdown
# About Us

We are a team dedicated to building great experiences...

## What We Do
- Web development
- Mobile apps
- Consulting
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
