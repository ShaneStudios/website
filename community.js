(async () => {
    try {
        const { submissions } = await import('./submission_list.js');
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('submission-list-container');
            const filterControls = document.querySelector('.filter-controls');
            const searchInput = document.getElementById('search-input');
            const langFilter = document.getElementById('language-filter');
            const typeFilter = document.getElementById('type-filter');
            const sortBy = document.getElementById('sort-by');
            let state = { searchTerm: '', language: 'All', type: 'All', sort: 'newest' };
            const populateFilters = () => {
                const languages = ['All', ...new Set(submissions.map(s => s.language))];
                const types = ['All', ...new Set(submissions.map(s => s.type))];
                langFilter.innerHTML = languages.map(lang => `<option value="${lang}">${lang === 'All' ? 'All Languages' : lang}</option>`).join('');
                typeFilter.innerHTML = types.map(type => `<option value="${type}">${type === 'All' ? 'All Types' : type}</option>`).join('');
            };
            const renderSubmissions = () => {
                let filtered = [...submissions];
                if (state.language !== 'All') {
                    filtered = filtered.filter(s => s.language === state.language);
                }
                if (state.type !== 'All') {
                    filtered = filtered.filter(s => s.type === state.type);
                }
                if (state.searchTerm) {
                    const term = state.searchTerm.toLowerCase();
                    filtered = filtered.filter(s => 
                        s.title.toLowerCase().includes(term) || 
                        s.description.toLowerCase().includes(term)
                    );
                }
                if (state.sort === 'newest') {
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                } else if (state.sort === 'oldest') {
                    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                }
                container.innerHTML = '';
                if (filtered.length === 0) {
                    renderEmptyState();
                    return;
                }
                filtered.forEach(s => {
                    const card = document.createElement('a');
                    card.href = s.url;
                    card.className = 'submission-card';
                    card.innerHTML = `
                        <div class="card-header">
                            <h2>${s.title}</h2>
                            <span class="author">by ${s.author}</span>
                        </div>
                        <p class="card-body">${s.description}</p>
                        <div class="card-footer">
                            <div class="card-tags">
                                <span class="tag">${s.language}</span>
                                <span class="tag">${s.type}</span>
                            </div>
                            <span class="date">${new Date(s.date).toLocaleDateString()}</span>
                        </div>
                    `;
                    container.appendChild(card);
                });
            };
            const renderEmptyState = () => {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-ghost"></i>
                        <p>Sorry, but no community submissions are available right now. Please try again later or make your own submission!</p>
                        <div class="empty-state-actions">
                            <a href="contact.html" class="action-button">Make a Submission</a>
                            <a href="submission_guidelines.html" class="action-button secondary">View Guidelines</a>
                        </div>
                    </div>
                `;
            };
            const initializePage = () => {
                if (!submissions || submissions.length === 0) {
                    renderEmptyState();
                    if (filterControls) filterControls.style.display = 'none';
                } else {
                    populateFilters();
                    renderSubmissions();
                    searchInput.addEventListener('input', e => { state.searchTerm = e.target.value; renderSubmissions(); });
                    langFilter.addEventListener('change', e => { state.language = e.target.value; renderSubmissions(); });
                    typeFilter.addEventListener('change', e => { state.type = e.target.value; renderSubmissions(); });
                    sortBy.addEventListener('change', e => { state.sort = e.target.value; renderSubmissions(); });
                }
            };
            initializePage();
        });
    } catch (error) {
        console.error("Failed to load submission list:", error);
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('submission-list-container');
            if (container) {
                container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Submissions failed to load. Please try refreshing the page.</p></div>`;
            }
        });
    }
})();