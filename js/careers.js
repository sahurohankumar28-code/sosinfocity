// Drawer toggle code
        const openBtn = document.getElementById('mobileMenuBtn');
        const closeBtn = document.getElementById('closeMobileBtn');
        const overlay = document.getElementById('mobileNavOverlay');

        if(openBtn && overlay && closeBtn) {
            openBtn.addEventListener('click', () => overlay.classList.add('open'));
            closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
        }


if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    window.scrollTo(0, 0);