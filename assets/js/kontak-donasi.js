// kontak-donasi.js
document.addEventListener('DOMContentLoaded', function () {
    // ========== FUNGSI UNTUK HALAMAN KONTAK & DONASI ==========

    // 1. Mobile Menu Toggle
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

    // 2. Active Nav Link based on current page
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

    // 3. QR Code Modal
    function initQRModal() {
        const modal = document.getElementById('qrModal');
        const qrBtn = document.querySelector('.qr-btn');
        const closeModal = document.querySelector('.close-modal');

        if (!modal || !qrBtn) return;

        qrBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

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

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 4. Copy Buttons for Donation Information
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');

        copyButtons.forEach(button => {
            button.addEventListener('click', async function (e) {
                e.preventDefault();

                const textToCopy = this.getAttribute('data-text');

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showCopyNotification(this);

                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Berhasil disalin!';
                    this.style.background = '#10b981';

                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                    }, 2000);

                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopyNotification(this);
                }
            });
        });
    }

    // 5. Function to show copy notification
    function showCopyNotification(button) {
        const oldNotification = button.parentElement.querySelector('.copy-notification');
        if (oldNotification) oldNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = "✅ Berhasil disalin!";
        button.parentElement.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // 6. Smooth Scroll System for internal page links
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

        // Smooth scroll for internal links
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
        document.querySelectorAll('.contact-btn, .copy-btn, .qr-btn').forEach(button => {
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

    // 9. Initialize all functions for contact & donation page
    initMobileMenu();
    setActiveNavLink();
    initQRModal();
    initCopyButtons();
    initSmoothScroll();
    initFadeAnimations();
    initRippleEffects();
});
// Di dalam fungsi initQRModal, tambahkan penanganan untuk semua tombol qr-btn
function initQRModal() {
    const modal = document.getElementById('qrModal');
    const qrBtns = document.querySelectorAll('.qr-btn');
    const closeModal = document.querySelector('.close-modal');

    if (!modal || qrBtns.length === 0) return;

    qrBtns.forEach(qrBtn => {
        qrBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

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

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}