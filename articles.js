import { articles } from './article_list.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('article-list-container');
    const searchInput = document.getElementById('search-input');
    const themeFilterContainer = document.getElementById('theme-filter-container');

    // On page load, check localStorage for a theme filter request
    let activeTheme = localStorage.getItem('shaneStudios_articleThemeFilter') || 'All';
    // IMPORTANT: Clear the item immediately so it's only used once
    localStorage.removeItem('shaneStudios_articleThemeFilter');

    let searchTerm = '';

    function renderArticles() {
        const themeFiltered = activeTheme === 'All'
            ? articles
            : articles.filter(article => article.mainTheme === activeTheme);
        
        const searchFiltered = themeFiltered.filter(article => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            return (
                article.title.toLowerCase().includes(lowerSearchTerm) ||
                article.subtitle.toLowerCase().includes(lowerSearchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
            );
        });

        const sortedArticles = searchFiltered.sort((a, b) => new Date(b.date) - new Date(a.date));
        container.innerHTML = '';
        if (sortedArticles.length === 0) {
            container.innerHTML = '<p class="no-results-message">No articles match your criteria.</p>';
            return;
        }

        sortedArticles.forEach(article => {
            const articleElement = document.createElement('a');
            articleElement.href = article.url;
            articleElement.className = 'article-list-item';
            const tagsHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p class="subtitle">${article.subtitle}</p>
                <div class="article-meta">
                    <div class="article-tags">${tagsHTML}</div>
                    <span class="article-date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>`;
            container.appendChild(articleElement);
        });
    }

    function setupThemeFilters() {
        const themes = ['All', ...new Set(articles.map(article => article.mainTheme))];
        // Set the 'active' class based on the theme we found in localStorage
        themeFilterContainer.innerHTML = themes.map(theme => 
            `<button class="filter-btn ${theme === activeTheme ? 'active' : ''}" data-theme="${theme}">${theme}</button>`
        ).join('');
    }

    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderArticles();
    });

    themeFilterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            activeTheme = e.target.dataset.theme;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderArticles();
        }
    });

    // Initial Page Load
    setupThemeFilters();
    renderArticles();
});