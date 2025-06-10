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
    menuToggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    let isLoggedIn = localStorage.getItem('shaneStudiosLoggedIn') === 'true';
    const loggedInItems = document.querySelectorAll('.logged-in-item');
    const loggedOutItems = document.querySelectorAll('.logged-out-item');
    function updateMenuForLoginState() {
        isLoggedIn = localStorage.getItem('shaneStudiosLoggedIn') === 'true';
        if (isLoggedIn) {
            loggedInItems.forEach(item => item.style.display = 'block');
            loggedOutItems.forEach(item => item.style.display = 'none');
            document.querySelector('#logout-link').style.display = 'inline-block';
        } else {
            loggedInItems.forEach(item => item.style.display = 'none');
            loggedOutItems.forEach(item => item.style.display = 'inline-block');
        }
    }
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('shaneStudiosLoggedIn', 'false');
        const currentPagePath = window.location.pathname.split('/').pop() || 'index.html';
        const currentLink = document.querySelector(`a[href="${currentPagePath}"]`);
        const requiresLogin = currentLink ? currentLink.dataset.requiresLogin === 'true' : false;
        alert("You have been logged out.");
        if (requiresLogin) {
            alert("This page requires an account. Redirecting to the homepage.");
            window.location.href = 'index.html';
        } else {
            updateMenuForLoginState();
            closeMenu();
        }
    };
    document.getElementById('logout-link')?.addEventListener('click', handleLogout);
    document.querySelector('a[href="login.html"]')?.addEventListener('click', function(e) {
        if (window.location.pathname.endsWith('login.html')) return;
        let isLoggedInNow = localStorage.getItem('shaneStudiosLoggedIn') === 'true';
        if (!isLoggedInNow) {
            e.preventDefault();
            localStorage.setItem('shaneStudiosLoggedIn', 'true');
            updateMenuForLoginState();
            alert("You are now 'Logged In' for this demo! The menu and timer have updated.");
            closeMenu();
            if (window.location.pathname.endsWith('ryxide.html')) {
                window.location.reload();
            }
        }
    });
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(element => observer.observe(element));
    updateMenuForLoginState();
});