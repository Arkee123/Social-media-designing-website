document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Light/Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    
    // Get saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        themeIcon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. Hide/Show Header on Scroll
    let lastScroll = 0;
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && !mainNav.classList.contains('active')) {
            // Scroll Down
            header.classList.add('hidden');
        } else {
            // Scroll Up
            header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    // 4. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightboxImgContainer = document.querySelector('.lightbox-image-container');

    let currentlyFocusedElement = null;

    const openLightbox = (card) => {
        currentlyFocusedElement = document.activeElement;
        
        const imgSrc = card.getAttribute('data-full-image');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');

        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        
        // Reset scroll position to the start for wide carousels
        lightboxImgContainer.scrollLeft = 0;

        // Add interactive swipe message if the design is wide
        if (card.classList.contains('wide')) {
            lightboxDesc.innerHTML = `${desc}<br><span class="carousel-hint" style="display: inline-block; margin-top: 12px; font-weight: 600; font-size: 0.9rem; color: var(--accent-color); padding: 4px 12px; background: rgba(184, 90, 68, 0.08); border-radius: 4px; border-left: 3px solid var(--accent-color);">← Swipe or scroll horizontally to view the full design carousel →</span>`;
        } else {
            lightboxDesc.textContent = desc;
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Set focus for accessibility
        setTimeout(() => lightboxClose.focus(), 100);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus
        if (currentlyFocusedElement) {
            currentlyFocusedElement.focus();
        }
    };

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
        // Keyboard support for cards
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(card);
            }
        });
    });

    // 4.1 Portfolio Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workPortfolioGrid = document.querySelector('#work .portfolio-grid');
    
    if (filterBtns.length > 0 && workPortfolioGrid) {
        const gridCards = workPortfolioGrid.querySelectorAll('.portfolio-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');
                
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                gridCards.forEach(card => {
                    const cardCategories = (card.getAttribute('data-category') || '').split(' ');
                    
                    if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 5. Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // 6. Basic Form Submission (Prevent Default for Demo)
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Message Sent!';
            btn.style.color = 'var(--accent-color)';
            contactForm.reset();
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = '';
            }, 3000);
        });
    }
});

