// Load site assets and populate content
let siteAssets = null;
let contentData = {};

async function loadSiteAssets() {
    try {
        const response = await fetch('site-assets.json');
        siteAssets = await response.json();
        await loadContentFiles();
        populateContent();
    } catch (error) {
        console.error('Error loading site assets:', error);
    }
}

async function loadContentFiles() {
    if (!siteAssets || !siteAssets.assets) return;

    // Load all content files defined in assets
    for (const asset of siteAssets.assets) {
        try {
            const response = await fetch(asset.path);
            if (!response.ok) continue;

            if (asset.path.endsWith('.json')) {
                contentData[asset.path] = await response.json();
            } else if (asset.path.endsWith('.md')) {
                const text = await response.text();
                contentData[asset.path] = text;
            }
        } catch (error) {
            console.warn(`Failed to load ${asset.path}:`, error);
        }
    }
}

function populateContent() {
    // Load property data
    const propertyData = contentData['content/property.json'];
    if (propertyData) {
        const addressEl = document.querySelector('.address');
        if (addressEl && propertyData.address) {
            addressEl.textContent = propertyData.address;
        }
        const locationEl = document.querySelector('.location');
        if (locationEl && propertyData.location) {
            locationEl.textContent = propertyData.location;
        }
        const priceEl = document.querySelector('.price');
        if (priceEl && propertyData.price) {
            priceEl.textContent = propertyData.price;
        }
        const zillowLinks = document.querySelectorAll('.zillow-link, .contact-zillow');
        zillowLinks.forEach(link => {
            if (propertyData.zillowUrl) {
                link.href = propertyData.zillowUrl;
            }
        });

        // Populate property details
        if (propertyData.details) {
            const details = propertyData.details;
            const detailItems = document.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const label = item.querySelector('.detail-label');
                if (label) {
                    const labelText = label.textContent.trim();
                    const value = item.querySelector('.detail-value');
                    if (value) {
                        if (labelText.includes('Bedrooms')) {
                            value.textContent = details.bedrooms || '';
                        } else if (labelText.includes('Bathrooms')) {
                            value.textContent = details.bathrooms || '';
                        } else if (labelText.includes('Square Feet')) {
                            value.textContent = details.squareFeet || '';
                        } else if (labelText.includes('Lot Size')) {
                            value.textContent = details.lotSize || '';
                        } else if (labelText.includes('Year Built')) {
                            value.textContent = details.yearBuilt || '';
                        } else if (labelText.includes('Price/sqft')) {
                            value.textContent = details.pricePerSqft || '';
                        }
                    }
                }
            });
        }
    }

    // Load hero data
    const heroData = contentData['content/hero.json'];
    if (heroData) {
        const heroImg = document.getElementById('hero-img');
        if (heroImg && heroData.image) {
            heroImg.src = heroData.image;
            heroImg.alt = heroData.alt || '';
        }
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && heroData.title) {
            heroTitle.textContent = heroData.title;
        }
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && heroData.subtitle) {
            heroSubtitle.textContent = heroData.subtitle;
        }
    }

    // Load gallery manifest
    const galleryManifest = contentData['assets/manifest.json'];
    if (galleryManifest && Array.isArray(galleryManifest)) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
            galleryManifest.forEach((item, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                const img = document.createElement('img');
                img.src = item.path;
                img.alt = item.alt || item.description || `Property photo ${index + 1}`;
                img.loading = 'lazy';
                galleryItem.appendChild(img);
                galleryGrid.appendChild(galleryItem);
            });
        }
    }

    // Load summary markdown
    const summaryMarkdown = contentData['content/summary.md'];
    if (summaryMarkdown) {
        parseAndPopulateSummary(summaryMarkdown);
    }

    // Initialize lightbox after gallery is populated
    initializeLightbox();
}

function parseAndPopulateSummary(markdown) {
    const lines = markdown.split('\n');
    const summarySection = document.querySelector('.summary');
    if (!summarySection) return;

    const container = summarySection.querySelector('.container');
    if (!container) return;

    // Clear existing content except the container
    container.innerHTML = '';

    let currentElement = null;
    let highlightsContainer = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) continue;

        // Parse heading levels
        if (line.startsWith('# ')) {
            const h2 = document.createElement('h2');
            h2.textContent = line.substring(2);
            container.appendChild(h2);
            currentElement = null;
        } else if (line.startsWith('## ')) {
            const h3 = document.createElement('h3');
            h3.textContent = line.substring(3);
            container.appendChild(h3);
            currentElement = null;
        } else if (line.startsWith('### ')) {
            // This is a highlight title
            if (!highlightsContainer) {
                highlightsContainer = document.createElement('div');
                highlightsContainer.className = 'highlights-grid';
                container.appendChild(highlightsContainer);
            }
            const highlightItem = document.createElement('div');
            highlightItem.className = 'highlight-item';
            const h4 = document.createElement('h4');
            h4.textContent = line.substring(4);
            highlightItem.appendChild(h4);
            highlightsContainer.appendChild(highlightItem);
            currentElement = highlightItem;
        } else if (line === '---') {
            // Horizontal rule - start footer section
            currentElement = null;
        } else if (line.match(/^[????]/)) {
            // Emoji line - summary note
            const note = document.createElement('p');
            note.className = 'summary-note';
            note.innerHTML = line.replace(/\n/g, '<br>');
            container.appendChild(note);
            currentElement = null;
        } else if (line) {
            // Regular paragraph
            if (currentElement && currentElement.classList.contains('highlight-item')) {
                // This is highlight description
                const p = document.createElement('p');
                p.textContent = line;
                currentElement.appendChild(p);
            } else {
                // Regular paragraph or footer
                const p = document.createElement('p');
                if (i > 0 && lines[i - 1].trim() === '---') {
                    p.className = 'summary-footer';
                }
                p.textContent = line;
                container.appendChild(p);
            }
        }
    }
}

// Image gallery lightbox functionality
let lightboxInitialized = false;
let currentImageIndex = 0;
let images = [];

// Lightbox functions
function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    if (lightbox && lightboxImage) {
        lightbox.classList.add('active');
        updateLightboxImage();
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    if (lightboxImage && images.length > 0) {
        lightboxImage.src = images[currentImageIndex];
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }
    }
}

function showPrevImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
}

function showNextImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
}

function initializeLightbox() {
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!galleryGrid || !lightbox || !lightboxImage) return;

    // Use event delegation for gallery images
    if (!lightboxInitialized) {
        galleryGrid.addEventListener('click', function (e) {
            const img = e.target.closest('.gallery-item img');
            if (img) {
                const galleryItems = document.querySelectorAll('.gallery-item img');
                images = Array.from(galleryItems).map(item => item.src);
                currentImageIndex = Array.from(galleryItems).indexOf(img);
                if (currentImageIndex !== -1) {
                    openLightbox();
                }
            }
        });

        // Event listeners
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        // Close lightbox when clicking outside the image
        if (lightbox) {
            lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        });

        lightboxInitialized = true;
    } else {
        // Update images array when gallery is repopulated
        const galleryItems = document.querySelectorAll('.gallery-item img');
        images = Array.from(galleryItems).map(img => img.src);
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    loadSiteAssets();
    initializeSmoothScrolling();
});