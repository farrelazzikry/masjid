// galeri.js
document.addEventListener('DOMContentLoaded', function () {
    // ========== GALERI FILTER & MODAL ==========

    // 1. Gallery Filter Functionality
    function initGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('galleryModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalDate = document.getElementById('modalDate');
        const closeModal = document.querySelector('.close-modal');

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filter === 'all' || filter === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Modal functionality
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const title = item.querySelector('h4').textContent;
                const description = item.querySelector('p').textContent;
                const date = item.querySelector('.gallery-date').textContent;

                modalImage.src = imgSrc;
                modalImage.alt = title;
                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modalDate.textContent = date;

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 2. Gallery Modal with Navigation
    function initGalleryModal() {
        const modal = document.getElementById('galleryModal');
        const closeModal = document.querySelector('.gallery-modal .close-modal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalDate = document.getElementById('modalDate');
        const prevBtn = document.querySelector('.modal-nav-btn.prev');
        const nextBtn = document.querySelector('.modal-nav-btn.next');

        if (!modal) return;

        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentIndex = 0;

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateModal();
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        function updateModal() {
            const item = galleryItems[currentIndex];
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h4').textContent;
            const description = item.querySelector('p').textContent;
            const date = item.querySelector('.gallery-date').textContent;

            modalImage.src = imgSrc;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalDate.textContent = date;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                updateModal();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateModal();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                } else if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                    updateModal();
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % galleryItems.length;
                    updateModal();
                }
            }
        });
    }

    // 3. Load More Gallery Items
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMore');
        if (!loadMoreBtn) return;

        const hiddenItems = document.querySelectorAll('.gallery-item[style*="display: none"]');
        let itemsToShow = 3;

        loadMoreBtn.addEventListener('click', () => {
            let shownItems = 0;
            hiddenItems.forEach(item => {
                if (shownItems < itemsToShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                    shownItems++;
                }
            });

            // Hide button if no more items
            if (document.querySelectorAll('.gallery-item[style*="display: none"]').length === 0) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // 4. Mobile Menu Toggle
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
                    ? '<i class="fas fa-times"></i>'
                    : '<i class="fas fa-bars"></i>';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }
    }

    // 5. Active Nav Link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage ||
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 6. Smooth Scroll System
    function initSmoothScroll() {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.appendChild(scrollProgress);

        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(backToTopBtn);

        function updateScrollElements() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";

            if (winScroll > 300) {
                backToTopBtn.classList.add('visible');
                document.querySelector('.navbar').classList.add('scrolled');
            } else {
                backToTopBtn.classList.remove('visible');
                document.querySelector('.navbar').classList.remove('scrolled');
            }

            document.querySelectorAll('.fade-in').forEach(element => {
                if (element.getBoundingClientRect().top < window.innerHeight - 150) {
                    element.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', updateScrollElements);
        window.addEventListener('load', updateScrollElements);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // 7. Add fade-in class to all sections
    function initFadeAnimations() {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-in');
        });
    }

    // 8. Ripple effect untuk tombol
    function initRippleEffects() {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Initialize all functions for gallery page
    initGallery();
    initGalleryModal();
    initLoadMore();
    initMobileMenu();
    setActiveNavLink();
    initSmoothScroll();
    initFadeAnimations();
    initRippleEffects();
});