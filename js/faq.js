if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    window.scrollTo(0, 0);
    
    // Mobile Menu Functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const closeMobileBtn = document.getElementById('closeMobileBtn');

        if (mobileMenuBtn && mobileNavOverlay && closeMobileBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNavOverlay.classList.add('open');
            });
            closeMobileBtn.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('open');
            });
            mobileNavOverlay.addEventListener('click', (e) => {
                if (e.target === mobileNavOverlay) {
                    mobileNavOverlay.classList.remove('open');
                }
            });
        }

        // FAQ Accordion Functionality
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Category Filter Functionality
        const catBtns = document.querySelectorAll('.faq-cat-btn');
        const allFaqItems = document.querySelectorAll('.faq-item');

        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                
                // Filter items
                allFaqItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Close all open FAQs when filtering
                allFaqItems.forEach(item => {
                    item.classList.remove('active');
                });
            });
        });

        // Active link highlighting for FAQ page
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.textContent.trim() === 'FAQ') {
                link.style.color = 'var(--primary-light)';
            }
        });