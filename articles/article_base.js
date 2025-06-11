document.addEventListener('DOMContentLoaded', () => {
    const themeLink = document.querySelector('.breadcrumb-theme-link');
    if (themeLink) {
        themeLink.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = e.currentTarget.dataset.theme;
            if (theme) {
                localStorage.setItem('shaneStudios_articleThemeFilter', theme);
                window.location.href = '../articles.html';
            }
        });
    }
});