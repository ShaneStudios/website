import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const directoryView = document.getElementById('directory-view');
const profileViewContainer = document.getElementById('profile-view-container');
const userGridContainer = document.getElementById('user-grid-container');
const searchInput = document.getElementById('search-input');
const discoverButton = document.getElementById('discover-button');
let searchDebounceTimer;

const renderUserGrid = (users) => {
    userGridContainer.innerHTML = '';
    if (!users || users.length === 0) {
        userGridContainer.innerHTML = `<p class="info-message">No users found.</p>`;
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'user-grid';
    grid.innerHTML = users.map(user => `
        <a href="/users.html?u=${user.member_id}" class="user-card">
            <div class="user-card-header">
                <div class="user-avatar">${(user.display_name || user.username).charAt(0).toUpperCase()}</div>
                <div class="display-name">${user.display_name || 'N/A'}</div>
                <div class="username">@${user.username}</div>
                <div class="member-id">ID: ${user.member_id.toString().padStart(8, '0')}</div>
            </div>
        </a>
    `).join('');
    userGridContainer.appendChild(grid);
};

const renderSingleProfile = (user) => {
    profileViewContainer.innerHTML = `
        <div class="profile-card">
            <div class="profile-card-header">
                <div class="user-avatar profile-avatar">${(user.display_name || user.username).charAt(0).toUpperCase()}</div>
                <div>
                    <div class="display-name">${user.display_name || 'N/A'}</div>
                    <div class="username">@${user.username}</div>
                    <div class="member-id">ID: ${user.member_id.toString().padStart(8, '0')}</div>
                </div>
            </div>
            <div class="profile-bio">
                <p>${user.bio || 'This user has not written a bio yet.'}</p>
            </div>
        </div>
    `;
};

const searchUsers = async (term) => {
    userGridContainer.innerHTML = `<p class="info-message">Searching...</p>`;
    const { data, error } = await supabase
        .from('profiles')
        .select('member_id, username, display_name')
        .or(`username.ilike.%${term}%,display_name.ilike.%${term}%`)
        .limit(50);
    if (error) {
        console.error(error);
        userGridContainer.innerHTML = `<p class="info-message">Error fetching users.</p>`;
        return;
    }
    renderUserGrid(data);
};

const discoverUsers = async () => {
    userGridContainer.innerHTML = `<p class="info-message">Discovering...</p>`;
    const { data, error } = await supabase
        .from('profiles')
        .select('member_id, username, display_name')
        .limit(25)
        .order('created_at', { ascending: false });
    if (error) {
        console.error(error);
        userGridContainer.innerHTML = `<p class="info-message">Error fetching users.</p>`;
        return;
    }
    renderUserGrid(data);
};

const displayUserProfile = async (userId) => {
    directoryView.style.display = 'none';
    profileViewContainer.innerHTML = `<p class="info-message">Loading profile...</p>`;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('member_id', userId)
        .single();

    if (error || !data) {
        profileViewContainer.innerHTML = `<p class="info-message">User not found.</p>`;
        return;
    }
    renderSingleProfile(data);
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('u');

    if (userId) {
        displayUserProfile(userId);
    } else {
        profileViewContainer.style.display = 'none';
        discoverUsers();
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                searchUsers(e.target.value);
            }, 300);
        });
        discoverButton.addEventListener('click', discoverUsers);
    }
});
