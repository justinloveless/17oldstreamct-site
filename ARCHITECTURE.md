# Architecture Overview

## Modular Handler System

This template uses a modular architecture where each content asset has its own dedicated handler file. This makes the codebase scalable and maintainable.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│                     (Static Structure)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ loads
                            ▼
                    ┌───────────────┐
                    │   script.js   │
                    │  (Orchestrator)│
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌───────────────┐   ┌──────────────┐
│site-assets   │   │   Content     │   │   Handlers   │
│   .json      │   │    Files      │   │    /*.js     │
│              │   │               │   │              │
│ • Defines    │   │ • JSON data   │   │ • property   │
│   assets     │   │ • Markdown    │   │ • hero-*     │
│ • Schemas    │   │ • Images      │   │ • summary    │
│ • Handlers   │   │               │   │ • gallery    │
└──────┬───────┘   └───────┬───────┘   └──────┬───────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                  Dynamically Combined
                           │
                           ▼
                    ┌─────────────┐
                    │  Rendered   │
                    │    Page     │
                    └─────────────┘
```

## Data Flow

### 1. Page Load
```javascript
document.addEventListener('DOMContentLoaded', () => {
  loadSiteAssets();  // Start the loading process
});
```

### 2. Load Configuration
```javascript
// Fetch site-assets.json
const siteAssets = await fetch('site-assets.json');
// Result: List of all assets with their handlers
```

### 3. Load Content
```javascript
// For each asset in site-assets.json
for (const asset of siteAssets.assets) {
  // Load JSON, markdown, or image
  const content = await fetch(asset.path);
  contentData[asset.path] = content;
}
```

### 4. Execute Handlers
```javascript
// For each asset with a handler
for (const asset of siteAssets.assets) {
  if (asset.handler) {
    // Dynamically import the handler module
    const handler = await import(`./${asset.handler}`);
    // Execute with loaded content
    handler.handle(contentData[asset.path]);
  }
}
```

## Adding New Content

### Traditional Approach (Without Handlers)
```
Add content → Update script.js → Add HTML → Test
            ↑ (Manual code changes required)
```

### Handler Approach (This Template)
```
npm run add-asset → Edit content → Edit handler → Add HTML
                  ↑ (Auto-generated)   ↑ (Isolated module)
```

## File Organization

```
project/
├── Core Files (Don't change often)
│   ├── index.html         - Page structure
│   ├── styles.css         - Styling
│   ├── script.js          - Orchestrator (rarely modified)
│   └── site-assets.json   - Asset registry (auto-updated by CLI)
│
├── Content (Change frequently)
│   └── content/
│       ├── *.json         - Data files
│       └── *.md           - Text content
│
└── Handlers (Add new, rarely modify existing)
    └── handlers/
        ├── asset-name.js  - Display logic for each asset
        └── ...
```

## Benefits of This Architecture

### 1. Separation of Concerns
- **Content**: Pure data in JSON/Markdown
- **Display Logic**: Isolated in handlers
- **Structure**: HTML remains clean
- **Orchestration**: Automated in script.js

### 2. Scalability
- Add unlimited content assets
- No modifications to core files needed
- Each handler is independent

### 3. Maintainability
- Easy to find code for specific content
- Changes don't affect other handlers
- Clear file naming convention

### 4. Developer Experience
- CLI tool automates boilerplate
- Handler template guides implementation
- Auto-loading reduces configuration

## Example: Adding a Testimonials Section

### Step 1: Add Asset
```bash
npm run add-asset content/testimonials.json
```

**Generated Files:**
- `content/testimonials.json` (content)
- `handlers/testimonials.js` (display logic)
- Entry in `site-assets.json` (registration)

### Step 2: Add Content
```json
// content/testimonials.json
{
  "items": [
    { "name": "John Doe", "text": "Great service!", "rating": 5 }
  ]
}
```

### Step 3: Implement Handler
```javascript
// handlers/testimonials.js
export function handle(data) {
  if (!data || !data.items) return;
  
  const container = document.querySelector('.testimonials');
  data.items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'testimonial';
    el.innerHTML = `
      <p>"${item.text}"</p>
      <span>- ${item.name}</span>
    `;
    container.appendChild(el);
  });
}
```

### Step 4: Add HTML
```html
<section class="testimonials">
  <!-- Populated by handler -->
</section>
```

### Result
✓ Content managed separately  
✓ Handler auto-loads  
✓ No changes to script.js  
✓ Easy to maintain  

## Comparison with Other Approaches

### Static HTML
❌ Content mixed with structure  
❌ Repetitive updates  
❌ Hard to maintain  

### Template Engines (e.g., Handlebars)
✓ Separation of content  
❌ Build step required  
❌ Server-side rendering or compilation  

### Frontend Frameworks (e.g., React, Vue)
✓ Component-based  
✓ Reactive updates  
❌ Heavy dependencies  
❌ Complex setup  
❌ Overkill for static sites  

### This Template
✓ Separation of content  
✓ Modular architecture  
✓ No build step  
✓ No dependencies  
✓ Framework-agnostic  
✓ Easy to understand  
✓ Perfect for static sites  

## Extension Patterns

### Custom Handler Logic
Handlers can do anything:
- Parse markdown
- Make API calls
- Perform calculations
- Transform data
- Interact with third-party libraries

### Handler Communication
Handlers can share data via:
- Global variables
- Custom events
- DOM data attributes
- LocalStorage

### Conditional Loading
```javascript
// In script.js, you could add:
if (condition) {
  // Only load certain handlers
}
```

### Lazy Loading
```javascript
// Handlers could implement lazy loading
export function handle(data) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      // Load content when visible
    }
  });
}
```

## Best Practices

1. **Keep handlers focused** - One responsibility per handler
2. **Validate data** - Always check if data exists before using
3. **Fail gracefully** - Don't break the whole page if one asset fails
4. **Document dependencies** - Note which HTML elements are required
5. **Use semantic naming** - Handler filename should match asset name
6. **Add comments** - Explain complex logic for future maintainers
7. **Test individually** - Each handler should work independently

## Troubleshooting

### Handler not loading?
- Check path in `site-assets.json`
- Verify export syntax: `export function handle(data)`
- Check browser console for import errors

### Content not displaying?
- Verify HTML elements exist with correct selectors
- Check if data is loaded correctly (console.log)
- Ensure handler is being called (add logging)

### Performance issues?
- Implement lazy loading for images
- Defer non-critical handlers
- Use efficient DOM manipulation

## Future Enhancements

Possible additions to this architecture:
- Handler dependencies (load order)
- Handler lifecycle hooks (onLoad, onUpdate, onDestroy)
- Built-in caching mechanism
- Asset versioning and cache busting
- Handler hot-reloading for development
- TypeScript support for type safety
