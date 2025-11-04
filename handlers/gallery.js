/**
 * Handler for image gallery assets
 * Populates gallery from image-descriptions.json and assets directory
 */
export function handle(imageDescriptions, galleryPath) {
  if (!imageDescriptions || !galleryPath) return;

  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  // Clear existing gallery
  galleryGrid.innerHTML = '';

  // Iterate through image descriptions (keys are filenames)
  const imageFiles = Object.keys(imageDescriptions);
  
  imageFiles.forEach((filename) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    // Construct image path
    const imagePath = `${galleryPath}/${filename}`;
    img.src = imagePath;
    
    // Get alt text from descriptions, default to empty string
    const description = imageDescriptions[filename];
    img.alt = (description && description.alt) ? description.alt : '';
    
    img.loading = 'lazy';
    galleryItem.appendChild(img);
    galleryGrid.appendChild(galleryItem);
  });
}
