/**
 * Main JavaScript for Stellar Agency
 * Handles Theme Toggle, Scroll Reveals, Accordions, and Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Screen ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500); // 500ms delay for visual effect
    }

    // --- 2. Theme Toggle (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const isExpanded = navLinks.classList.contains('mobile-active');
            mobileMenuBtn.innerHTML = isExpanded ? '✕' : '☰';
        });
    }

    // --- 4. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Accordion Logic (FAQ) ---
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        const content = acc.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                const isActive = acc.classList.contains('active');
                
                // Close all others
                accordions.forEach(otherAcc => {
                    otherAcc.classList.remove('active');
                    otherAcc.querySelector('.accordion-content').style.maxHeight = null;
                });

                // Toggle current
                if (!isActive) {
                    acc.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // --- 6. Form Validation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Basic validation logic
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.nextElementSibling.style.display = 'block';
                nameInput.style.borderColor = 'var(--accent-tertiary)';
            } else {
                nameInput.nextElementSibling.style.display = 'none';
                nameInput.style.borderColor = '';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                isValid = false;
                emailInput.nextElementSibling.style.display = 'block';
                emailInput.style.borderColor = 'var(--accent-tertiary)';
            } else {
                emailInput.nextElementSibling.style.display = 'none';
                emailInput.style.borderColor = '';
            }

            if (!messageInput.value.trim()) {
                isValid = false;
                messageInput.nextElementSibling.style.display = 'block';
                messageInput.style.borderColor = 'var(--accent-tertiary)';
            } else {
                messageInput.nextElementSibling.style.display = 'none';
                messageInput.style.borderColor = '';
            }

            if (isValid) {
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                btn.style.opacity = '0.7';
                
                // Simulate API call
                setTimeout(() => {
                    btn.innerHTML = 'Message Sent Successfully ✓';
                    btn.style.background = '#10b981'; // Success green
                    btn.style.color = 'white';
                    btn.style.borderColor = '#10b981';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style = '';
                    }, 3000);
                }, 1500);
            }
        });
    }

    // --- 7. Animated Counters (About Page) ---
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length > 0) {
        const counterOptions = {
            threshold: 0.5
        };
        
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, counterOptions);
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
});
