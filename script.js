document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. MOBILE NAVIGATION ==========
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('nav-open');
            mobileToggle.classList.toggle('is-active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('nav-open');
                mobileToggle.classList.remove('is-active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Legal pages hamburger (backward compat)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            hamburger.classList.toggle('is-active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ========== 2. SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ========== 3. HERO SLIDESHOW ==========
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startAutoSlide() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 6000);
        }
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide, 10));
            resetAutoSlide();
        });
    });

    startAutoSlide();

    // ========== 4. MODALS ==========
    const portfolioCards = document.querySelectorAll('.portfolio-card[data-modal]');
    const modals = document.querySelectorAll('.modal');
    let lastFocusedElement = null;

    // Focus trap helper
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                lastFocusedElement = card;
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';

                // Set focus to close button
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    modals.forEach(modal => {
        trapFocus(modal);

        // Close on X button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('is-open');
                document.body.style.overflow = '';
                if (lastFocusedElement) lastFocusedElement.focus();
            });
        }

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-open');
                document.body.style.overflow = '';
                if (lastFocusedElement) lastFocusedElement.focus();
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('is-open')) {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                    if (lastFocusedElement) lastFocusedElement.focus();
                }
            });
        }
    });

    // ========== 5. ACTIVE NAV LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.main-nav a[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === '#' + id) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }

    if (navItems.length > 0) {
        window.addEventListener('scroll', updateActiveNav, { passive: true });
    }

    // ========== 6. FADE-IN ANIMATIONS ==========
    const fadeElements = document.querySelectorAll(
        '.portfolio-card, .kontakt-card, .info-card, .timeline-item, .therapeutin-grid'
    );

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ========== 7. KONTAKTFORMULAR VALIDIERUNG ==========
    const kontaktForm = document.getElementById('kontaktForm');

    if (kontaktForm) {
        kontaktForm.addEventListener('submit', function (e) {
            let isValid = true;

            // Clear previous errors
            kontaktForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
            kontaktForm.querySelectorAll('.form-error').forEach(err => err.remove());

            // Validate required fields
            const requiredFields = kontaktForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    field.closest('.form-group').classList.add('has-error');
                } else if (field.type !== 'checkbox' && !field.value.trim()) {
                    isValid = false;
                    field.closest('.form-group').classList.add('has-error');
                }
            });

            // Validate email format
            const emailField = document.getElementById('form-email');
            if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                isValid = false;
                emailField.closest('.form-group').classList.add('has-error');
            }

            // Validate PLZ (5 digits)
            const plzField = document.getElementById('form-plz');
            if (plzField && plzField.value && !/^[0-9]{5}$/.test(plzField.value)) {
                isValid = false;
                plzField.closest('.form-group').classList.add('has-error');
                const errMsg = document.createElement('span');
                errMsg.className = 'form-error';
                errMsg.id = 'form-plz-error';
                errMsg.textContent = 'Bitte gültige 5-stellige PLZ eingeben';
                plzField.setAttribute('aria-describedby', 'form-plz-error');
                plzField.closest('.form-group').appendChild(errMsg);
            }

            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = kontaktForm.querySelector('.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        // Remove error styling on input
        kontaktForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.closest('.form-group')?.classList.remove('has-error');
                field.closest('.form-group')?.querySelector('.form-error')?.remove();
                field.removeAttribute('aria-describedby');
            });
        });

        // PLZ: only allow digits
        const plzInput = document.getElementById('form-plz');
        if (plzInput) {
            plzInput.addEventListener('input', () => {
                plzInput.value = plzInput.value.replace(/[^0-9]/g, '');
            });
        }
    }

    // ========== ACCORDION ==========
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = document.getElementById(header.getAttribute('aria-controls'));
            const isOpen = header.getAttribute('aria-expanded') === 'true';

            // Close all other accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherBody = document.getElementById(otherHeader.getAttribute('aria-controls'));
                    if (otherBody) {
                        otherBody.classList.remove('is-open');
                        otherBody.style.maxHeight = null;
                    }
                }
            });

            // Toggle current item
            if (isOpen) {
                header.setAttribute('aria-expanded', 'false');
                body.classList.remove('is-open');
                body.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                body.classList.add('is-open');
                body.style.maxHeight = body.scrollHeight + 40 + 'px';
            }
        });
    });

});
