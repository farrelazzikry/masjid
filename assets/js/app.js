// index.js
document.addEventListener('DOMContentLoaded', function () {
    // ========== KONFIGURASI ==========
    const kota = "Batam";
    const DURASI_SHOLAT = 30;

    // ========== FUNGSI UTAMA UNTUK INDEX.HTML ==========

    // 1. Update Waktu Real-time
    function updateDateTime() {
        const now = new Date();

        const jam = String(now.getHours()).padStart(2, '0');
        const menit = String(now.getMinutes()).padStart(2, '0');
        const detik = String(now.getSeconds()).padStart(2, '0');
        document.getElementById("realtime-clock").innerText = `${jam}:${menit}:${detik}`;

        const hari = now.toLocaleDateString('id-ID', { weekday: 'long' });
        document.getElementById("hari-ini").innerText = hari;

        const tanggalMasehi = now.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        document.getElementById("tanggal-masehi").innerText = tanggalMasehi;
    }

    // 2. Ambil Data Jadwal Sholat dari API
    async function fetchPrayerTimes() {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=11`);
            const data = await response.json();
            const timings = data.data.timings;
            const dateInfo = data.data.date;

            // Ambil nama bulan dari API
            let bulan = dateInfo.hijri.month.en;

            // SOLUSI: Ganti semua Sha menjadi Sya (termasuk Sha'ban jadi Sya'ban)
            bulan = bulan.replace('Sha\'', 'Sya\'').replace('Sha`', 'Sya\'').replace('Sha', 'Sya');

            document.getElementById("tanggal-hijri").innerText =
                `${dateInfo.hijri.day} ${bulan} ${dateInfo.hijri.year}H`;

            renderPrayerCards(timings);
            setInterval(() => renderPrayerCards(timings), 30000);

        } catch (error) {
            console.error("Gagal mengambil jadwal sholat:", error);
            document.getElementById("jadwal-container").innerHTML = `
            <p style="color: #ef4444; text-align: center; grid-column: 1/-1;">
                Gagal mengambil jadwal sholat. Pastikan koneksi internet aktif.
            </p>
        `;
        }
    }

    // 3. Render Kartu Jadwal Sholat
    function renderPrayerCards(timings) {
        const jadwal = [
            { nama: "Subuh", waktu: timings.Fajr, icon: "fa-cloud-moon" },
            { nama: "Dzuhur", waktu: timings.Dhuhr, icon: "fa-sun" },
            { nama: "Ashar", waktu: timings.Asr, icon: "fa-cloud-sun" },
            { nama: "Maghrib", waktu: timings.Maghrib, icon: "fa-moon" },
            { nama: "Isya", waktu: timings.Isha, icon: "fa-star-and-crescent" }
        ];

        const container = document.getElementById("jadwal-container");
        container.innerHTML = "";

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        jadwal.forEach(item => {
            const [h, m] = item.waktu.split(":").map(Number);
            const start = h * 60 + m;
            const end = start + DURASI_SHOLAT;

            const card = document.createElement("div");
            card.className = "prayer-card";

            let statusHTML = "";
            if (nowMinutes >= start && nowMinutes < end) {
                card.classList.add("active");
                statusHTML = `<span class="prayer-status status-live">● LIVE</span>`;
            } else if (nowMinutes < start) {
                const diff = start - nowMinutes;
                const jamSisa = Math.floor(diff / 60);
                const menSisa = diff % 60;

                statusHTML = jamSisa > 0
                    ? `<span class="prayer-status status-next">${jamSisa} jam ${menSisa} mnt</span>`
                    : `<span class="prayer-status status-next">${menSisa} menit</span>`;
            } else {
                statusHTML = `<span class="prayer-status status-done">Selesai</span>`;
            }

            card.innerHTML = `
                <i class="fas ${item.icon} prayer-icon"></i>
                <div class="prayer-name">${item.nama}</div>
                <div class="prayer-time">${item.waktu}</div>
                ${statusHTML}
            `;

            // Efek Hover Dinamis
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('active')) {
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 10px 20px rgba(6, 78, 59, 0.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                } else {
                    card.style.transform = 'translateY(-5px)';
                }
            });

            container.appendChild(card);
        });
    }

    // 4. Smooth Scroll System untuk navigasi internal
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

        // Smooth scroll untuk link internal di index.html
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - navbarHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 5. Mobile Menu Toggle
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

    // 6. Active Nav Link based on current page
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

    // 7. Add fade-in class to all sections
    function initFadeAnimations() {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-in');
        });
    }

    // 8. Enhanced button animation for hero
    function initHeroButtonAnimation() {
        const heroButton = document.querySelector('.hero-content .btn-primary');
        if (!heroButton) return;

        const buttonText = heroButton.textContent;
        heroButton.innerHTML = `<span>${buttonText}</span>`;

        heroButton.addEventListener('mousemove', (e) => {
            const rect = heroButton.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            heroButton.style.setProperty('--mouse-x', `${x}%`);
            heroButton.style.setProperty('--mouse-y', `${y}%`);
        });

        heroButton.addEventListener('mouseleave', () => {
            heroButton.style.setProperty('--mouse-x', '50%');
            heroButton.style.setProperty('--mouse-y', '50%');
        });
    }

    // 9. Ripple effect untuk tombol
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

    // ========== INITIALIZE SEMUA FUNGSI UNTUK INDEX.HTML ==========

    // Update waktu real-time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Ambil jadwal sholat
    fetchPrayerTimes();

    // Inisialisasi fungsi lainnya
    initMobileMenu();
    setActiveNavLink();
    initSmoothScroll();
    initFadeAnimations();
    initHeroButtonAnimation();
    initRippleEffects();
});