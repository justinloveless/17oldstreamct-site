# Handlers Directory

This directory contains handler files for each content asset defined in `site-assets.json`.

## What are Handlers?

Each handler is a JavaScript module that defines how to display a specific content asset. Handlers are automatically loaded and executed by `script.js`.

## Handler Structure

Every handler file exports a `handle` function:

```javascript
/**
 * Handler for content/your-asset.json
 * Description of what this handler does
 */
export function handle(data) {
  if (!data) return;
  
  // Your DOM manipulation logic here
  const element = document.querySelector('.your-section');
  if (element) {
    element.textContent = data.title;
  }
}
```

## Parameters

The `handle` function receives:
- **data**: The loaded content from the asset file
  - For JSON files: parsed JavaScript object
  - For text/markdown files: string content
  - For image files: the file path as a string
  - For directory assets: the directory path

## Creating New Handlers

### Automatic Generation
Use the CLI tool to automatically create handlers:
```bash
npm run add-asset content/new-asset.json
```

This will:
1. Add the asset to `site-assets.json`
2. Create `handlers/new-asset.js` with boilerplate code
3. Create the content file if it doesn't exist

### Manual Creation
1. Create a new `.js` file in this directory
2. Export a `handle` function
3. Reference it in `site-assets.json` with the `handler` field

## Examples

See the existing handler files in this directory for implementation examples:
- `property.js` - JSON data handling
- `hero-description.js` - Simple JSON to DOM
- `summary.js` - Markdown parsing and rendering
- `hero-image.js` - Image asset handling
- `gallery.js` - Complex multi-asset handling

## Best Practices

- **Check for data**: Always validate data exists before using it
- **Fail gracefully**: Use optional chaining and null checks
- **Keep it focused**: Each handler should only handle its own asset
- **Use clear selectors**: Document what DOM elements are required
- **Add comments**: Explain complex logic for future maintainers

## Debugging

If a handler isn't working:
1. Check browser console for errors
2. Verify the handler path in `site-assets.json` is correct
3. Ensure `handle` function is exported
4. Check that DOM elements exist before manipulating them
5. Verify content file is loading correctly
