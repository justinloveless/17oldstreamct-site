/**
 * Handler for hero image asset
 * Sets the hero image source
 */
export function handle(data, assetPath) {
  // For image assets, data will be null and we use assetPath
  const heroImg = document.getElementById('hero-img');
  if (heroImg && assetPath) {
    heroImg.src = assetPath;
  }
}
