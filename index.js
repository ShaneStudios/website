document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const openMenu = () => {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
    };
    const closeMenu = () => {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
    };
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
});
