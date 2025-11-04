/**
 * Handler for image gallery combo assets
 * Populates gallery from combo assets (image + json metadata)
 */
export function handle(comboData) {
  if (!comboData) return;

  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  // Clear existing gallery
  galleryGrid.innerHTML = '';

  // Iterate through combo assets (keys are base names)
  Object.keys(comboData).forEach((baseName) => {
    const combo = comboData[baseName];

    // Find the image file (check for different extensions)
    let imagePath = null;
    let metadata = null;

    // Get image path (check common image extensions)
    for (const ext of ['.webp', '.jpg', '.jpeg', '.png']) {
      if (combo[ext]) {
        imagePath = combo[ext];
        break;
      }
    }

    // Get metadata from JSON file
    if (combo['.json']) {
      metadata = combo['.json'];
    }

    // Skip if no image found
    if (!imagePath) return;

    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = (metadata && metadata.alt) ? metadata.alt : '';
    img.loading = 'lazy';

    galleryItem.appendChild(img);
    galleryGrid.appendChild(galleryItem);
  });
}
