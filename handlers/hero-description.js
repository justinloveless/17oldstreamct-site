/**
 * Handler for hero-description.json asset
 * Populates hero section text and image alt text
 */
export function handle(data) {
  if (!data) return;

  // Update hero image alt text
  const heroImg = document.getElementById('hero-img');
  if (heroImg && data.alt) {
    heroImg.alt = data.alt;
  }

  // Update hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && data.title) {
    heroTitle.textContent = data.title;
  }

  // Update hero subtitle
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && data.subtitle) {
    heroSubtitle.textContent = data.subtitle;
  }
}
