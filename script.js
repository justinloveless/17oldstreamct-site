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
        // Handle directory assets
        if (asset.type === 'directory') {
            if (asset.contains && asset.contains.type === 'combo') {
                // Load combo assets from directory
                contentData[asset.path] = await loadComboAssets(asset);
            } else if (asset.contains) {
                // Simple directory with single asset type
                contentData[asset.path] = await loadSimpleDirectoryAssets(asset);
            } else {
                // Legacy directory handling (just store path)
                contentData[asset.path] = asset.path;
            }
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

async function loadComboAssets(asset) {
    const comboData = {};
    const dirPath = asset.path;

    // Get all allowed extensions from parts
    const extensionMap = {}; // Maps extension to asset type
    asset.contains.parts.forEach(part => {
        part.allowedExtensions.forEach(ext => {
            extensionMap[ext] = part.assetType;
        });
    });

    // Fetch directory listing by trying to load files
    // Since we can't list directory contents in a browser, we need to scan for known files
    // This is a limitation - in practice, files should be explicitly listed or discovered via API
    // For now, we'll try to discover files by attempting to load them

    // Alternative: Build file list from actual filesystem for static sites
    // We'll use a simple approach: try fetching all combinations

    // Since we can't list directories in browser, we'll use a different approach:
    // Attempt to fetch files and group by basename
    const response = await fetch(dirPath);
    if (!response.ok) {
        console.warn(`Could not access directory: ${dirPath}`);
        return comboData;
    }

    // Parse HTML directory listing (if available) or use a manifest
    // For now, we'll use a workaround: try to fetch known patterns

    // Better approach: scan for files by reading directory metadata
    // Since browser can't list directories, we need to be creative
    // Let's fetch the directory as HTML and parse it
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');

    const files = [];
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('..') && !href.endsWith('/')) {
            // Extract just the filename from the href (remove any path components)
            const filename = href.split('/').pop();
            // Check if file has an allowed extension
            const ext = filename.substring(filename.lastIndexOf('.'));
            if (extensionMap[ext]) {
                files.push(filename);
            }
        }
    });

    // Group files by base name
    const fileGroups = {};
    files.forEach(filename => {
        const ext = filename.substring(filename.lastIndexOf('.'));
        const baseName = filename.substring(0, filename.lastIndexOf('.'));

        if (!fileGroups[baseName]) {
            fileGroups[baseName] = {};
        }
        fileGroups[baseName][ext] = filename;
    });

    // Load each file according to its asset type
    for (const [baseName, fileMap] of Object.entries(fileGroups)) {
        comboData[baseName] = {};

        for (const [ext, filename] of Object.entries(fileMap)) {
            const assetType = extensionMap[ext];
            const filePath = `${dirPath}/${filename}`;

            try {
                if (assetType === 'image') {
                    // Store path for images
                    comboData[baseName][ext] = filePath;
                } else if (assetType === 'json') {
                    // Load and parse JSON
                    const response = await fetch(filePath);
                    if (response.ok) {
                        comboData[baseName][ext] = await response.json();
                    }
                } else if (assetType === 'text') {
                    // Load text content
                    const response = await fetch(filePath);
                    if (response.ok) {
                        comboData[baseName][ext] = await response.text();
                    }
                }
            } catch (error) {
                console.warn(`Failed to load ${filePath}:`, error);
            }
        }
    }

    return comboData;
}

async function loadSimpleDirectoryAssets(asset) {
    const files = [];
    const dirPath = asset.path;

    // Similar directory listing logic for simple assets
    try {
        const response = await fetch(dirPath);
        if (!response.ok) return files;

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('..') && !href.endsWith('/')) {
                // Extract just the filename from the href
                const filename = href.split('/').pop();
                const ext = filename.substring(filename.lastIndexOf('.'));
                if (asset.contains.allowedExtensions.includes(ext)) {
                    files.push(`${dirPath}/${filename}`);
                }
            }
        });
    } catch (error) {
        console.warn(`Failed to load directory ${dirPath}:`, error);
    }

    return files;
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
                // Call handler with the loaded content
                const data = contentData[asset.path];
                handlerModule.handle(data, asset.path);
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
