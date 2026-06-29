/**
 * SOS Infocity - Unified Architecture Core
 * Consolidates Counter Analytics, Responsive Layout Overlays, 
 * 3D Engine Trackers, and Continuous Ribbon States.
 */
(function () {
    "use strict";

    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    window.scrollTo(0, 0);
    
    // 1. GLOBAL INITIALIZATION & WINDOW MANAGEMENT
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });

    // 2. COUNTER ANIMATION ENGINE
    function animateCounter(elementId, targetValue, duration = 2800) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const stepTime = 16; // Targets ~60fps layout loops
        const increments = targetValue / (duration / stepTime);
        
        const timer = setInterval(() => {
            current += increments;
            if (current >= targetValue) {
                element.innerText = targetValue;
                clearInterval(timer);
            } else {
                element.innerText = Math.floor(current);
            }
        }, stepTime);
    }

    // 3. RESPONSIVE NAVIGATION DRAWER CONTEXT
    function initMobileNavigation() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const overlay = document.getElementById('mobileNavOverlay');
        const closeBtn = document.getElementById('closeMobileBtn');

        if (!mobileBtn || !overlay || !closeBtn) return;

        const openMenu = () => overlay.classList.add('open');
        const closeMenu = () => overlay.classList.remove('open');

        mobileBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
    }

    // 4. PERSPECTIVE MOUSE TRACKING CONTROLLER (3D Matrix Transform)
    function initPerspectiveController() {
        const stage = document.querySelector('.marquee-display-pane');
        const display = document.querySelector('.led-tv-display-curve');

        if (!stage || !display || window.innerWidth <= 1024) return;

        let frameId;

        stage.addEventListener('mousemove', (e) => {
            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                const rect = stage.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                
                // Max angular deviation calculated boundaries (2.5 degrees)
                const rotateX = -(y / rect.height) * 2.5; 
                const rotateY = (x / rect.width) * 2.5;
                
                display.style.transform = `rotateX(${1 + rotateX}deg) rotateY(${6 + rotateY}deg) translateZ(0px)`;
            });
        });

        stage.addEventListener('mouseleave', () => {
            if (frameId) cancelAnimationFrame(frameId);
            display.style.transform = `rotateX(1deg) rotateY(6deg) translateZ(0px)`;
        });
    }

    // 5. MARQUEE HOVER INTERACTION CONTROLLERS
    function initMarqueeInteractions() {
        const track = document.getElementById('testimonialMarqueeTrack');
        if (!track) return;

        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }

    // SYNCED SYNCHRONIZATION HOOK PIPELINES
    const runSystemInitializations = () => {
        window.scrollTo(0, 0);
        initMobileNavigation();
        initPerspectiveController();
        initMarqueeInteractions();
        
        // Execute Metrics Counters
        animateCounter('projectsCount', 185, 2600);
        animateCounter('clientsCount', 340, 2600);
        
        console.log("SOS Infocity Engineering Layer: Active Optimization Framework Loaded.");
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        runSystemInitializations();
    } else {
        document.addEventListener('DOMContentLoaded', runSystemInitializations);
    }

    // RESIZE MONITOR THREAD
    window.addEventListener('resize', () => {
        const display = document.querySelector('.led-tv-display-curve');
        if (display && window.innerWidth <= 1024) {
            display.style.transform = 'none';
        }
    });
})();