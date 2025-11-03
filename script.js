// Load site assets and populate content
let siteData = null;

async function loadSiteAssets() {
    try {
        const response = await fetch('site-assets.json');
        siteData = await response.json();
        populateContent();
    } catch (error) {
        console.error('Error loading site assets:', error);
    }
}

function populateContent() {
    if (!siteData) return;

    // Populate hero section
    if (siteData.hero) {
        const heroImg = document.getElementById('hero-img');
        if (heroImg && siteData.hero.image) {
            heroImg.src = siteData.hero.image;
            heroImg.alt = siteData.hero.alt || '';
        }
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && siteData.hero.title) {
            heroTitle.textContent = siteData.hero.title;
        }
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && siteData.hero.subtitle) {
            heroSubtitle.textContent = siteData.hero.subtitle;
        }
    }

    // Populate gallery
    if (siteData.gallery && Array.isArray(siteData.gallery)) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
            siteData.gallery.forEach((item, index) => {
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

    // Populate summary section
    if (siteData.summary) {
        const summaryHeading = document.querySelector('.summary h2');
        if (summaryHeading && siteData.summary.heading) {
            summaryHeading.textContent = siteData.summary.heading;
        }

        const summaryDescription = document.querySelector('.summary .container > p:first-of-type');
        if (summaryDescription && siteData.summary.description) {
            summaryDescription.textContent = siteData.summary.description;
        }

        const highlightsGrid = document.querySelector('.highlights-grid');
        if (highlightsGrid && siteData.summary.highlights && Array.isArray(siteData.summary.highlights)) {
            highlightsGrid.innerHTML = '';
            siteData.summary.highlights.forEach(highlight => {
                const highlightItem = document.createElement('div');
                highlightItem.className = 'highlight-item';
                const title = document.createElement('h4');
                title.textContent = highlight.title;
                const description = document.createElement('p');
                description.textContent = highlight.description;
                highlightItem.appendChild(title);
                highlightItem.appendChild(description);
                highlightsGrid.appendChild(highlightItem);
            });
        }

        const summaryFooter = document.querySelector('.summary-footer');
        if (summaryFooter && siteData.summary.footer) {
            summaryFooter.textContent = siteData.summary.footer;
        }

        const summaryNote = document.querySelector('.summary-note');
        if (summaryNote && siteData.summary.note) {
            summaryNote.innerHTML = siteData.summary.note;
        }
    }

    // Populate property details
    if (siteData.property && siteData.property.details) {
        const details = siteData.property.details;
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

    // Populate header
    if (siteData.property) {
        const addressEl = document.querySelector('.address');
        if (addressEl && siteData.property.address) {
            addressEl.textContent = siteData.property.address;
        }
        const locationEl = document.querySelector('.location');
        if (locationEl && siteData.property.location) {
            locationEl.textContent = siteData.property.location;
        }
        const priceEl = document.querySelector('.price');
        if (priceEl && siteData.property.price) {
            priceEl.textContent = siteData.property.price;
        }
        const zillowLinks = document.querySelectorAll('.zillow-link, .contact-zillow');
        zillowLinks.forEach(link => {
            if (siteData.property.zillowUrl) {
                link.href = siteData.property.zillowUrl;
            }
        });
    }

    // Initialize lightbox after gallery is populated
    initializeLightbox();
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