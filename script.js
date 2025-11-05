// Site-specific code - uses generic asset-loader module
import { loadSiteAssets } from 'dynaloader';

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
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await loadSiteAssets(() => {
            // Initialize lightbox after all handlers have run
            initializeLightbox();
        });
    } catch (error) {
        console.error('Error initializing site:', error);
    }
    initializeSmoothScrolling();
});
