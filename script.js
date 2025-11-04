// Load site assets and populate content
let siteAssets = null;
let contentData = {};

async function loadSiteAssets() {
    try {
        const response = await fetch('site-assets.json');
        siteAssets = await response.json();
        await loadContentFiles();
        await loadHandlers();
    } catch (error) {
        console.error('Error loading site assets:', error);
    }
}

async function loadContentFiles() {
    if (!siteAssets || !siteAssets.assets) return;

    // Load all content files defined in assets
    for (const asset of siteAssets.assets) {
        // Skip directory assets for now (they'll be handled by their handlers)
        if (asset.type === 'directory') {
            contentData[asset.path] = asset.path; // Store the path for handlers
            continue;
        }
        
        // For images, just store the path
        if (asset.type === 'image') {
            contentData[asset.path] = asset.path;
            continue;
        }
        
        try {
            const response = await fetch(asset.path);
            if (!response.ok) continue;

            if (asset.type === 'json' || asset.path.endsWith('.json')) {
                contentData[asset.path] = await response.json();
            } else if (asset.type === 'text' && asset.path.endsWith('.md')) {
                const text = await response.text();
                contentData[asset.path] = text;
            }
        } catch (error) {
            console.warn(`Failed to load ${asset.path}:`, error);
        }
    }
}

async function loadHandlers() {
    if (!siteAssets || !siteAssets.assets) return;

    // Load and execute each handler
    for (const asset of siteAssets.assets) {
        if (!asset.handler) continue;

        try {
            // Dynamically import the handler module
            const handlerModule = await import(`./${asset.handler}`);
            
            if (typeof handlerModule.handle === 'function') {
                // Special handling for gallery (needs both image descriptions and directory path)
                if (asset.label === 'Photo Gallery') {
                    // Find the image-descriptions asset
                    const imageDescAsset = siteAssets.assets.find(a => 
                        a.path === 'content/image-descriptions.json'
                    );
                    const imageDescriptions = imageDescAsset ? contentData[imageDescAsset.path] : null;
                    handlerModule.handle(imageDescriptions, asset.path);
                } else {
                    // Call handler with the loaded content
                    const data = contentData[asset.path];
                    handlerModule.handle(data, asset.path);
                }
            } else {
                console.warn(`Handler ${asset.handler} does not export a handle function`);
            }
        } catch (error) {
            console.error(`Failed to load handler ${asset.handler}:`, error);
        }
    }

    // Initialize lightbox after all handlers have run
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
