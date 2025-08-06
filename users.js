import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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
        <a href="/website/users.html?u=${user.member_id}" class="user-card">
            <div class="user-card-header">
                <div class="user-avatar">${(user.display_name || user.username).charAt(0).toUpperCase()}</div>
                <div class="display-name">${user.display_name || 'N/A'}</div>
                <div class="username">@${user.username}</div>
                <div class="member-id">ID: ${user.member_id ? user.member_id.toString().padStart(8, '0') : 'N/A'}</div>
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
                    <div class="member-id">ID: ${user.member_id ? user.member_id.toString().padStart(8, '0') : 'N/A'}</div>
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
    const profilesRef = collection(db, "profiles");
    const usernameQuery = query(profilesRef, where('username', '>=', term), where('username', '<=', term + '\uf8ff'));
    const displayNameQuery = query(profilesRef, where('display_name', '>=', term), where('display_name', '<=', term + '\uf8ff'));
    try {
        const [usernameSnapshot, displayNameSnapshot] = await Promise.all([getDocs(usernameQuery), getDocs(displayNameQuery)]);
        const usersById = {};
        usernameSnapshot.docs.forEach(doc => usersById[doc.id] = doc.data());
        displayNameSnapshot.docs.forEach(doc => usersById[doc.id] = doc.data());
        renderUserGrid(Object.values(usersById));
    } catch (error) {
        console.error(error);
        userGridContainer.innerHTML = `<p class="info-message">Error fetching users.</p>`;
    }
};
const discoverUsers = async () => {
    userGridContainer.innerHTML = `<p class="info-message">Discovering...</p>`;
    const profilesRef = collection(db, "profiles");
    const q = query(profilesRef, orderBy('created_at', 'desc'), limit(25));
    try {
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data());
        renderUserGrid(users);
    } catch (error) {
        console.error(error);
        userGridContainer.innerHTML = `<p class="info-message">Error fetching users.</p>`;
    }
};
const displayUserProfile = async (userId) => {
    directoryView.style.display = 'none';
    profileViewContainer.innerHTML = `<p class="info-message">Loading profile...</p>`;
    const profilesRef = collection(db, "profiles");
    const q = query(profilesRef, where('member_id', '==', parseInt(userId, 10)), limit(1));
    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            profileViewContainer.innerHTML = `<p class="info-message">User not found.</p>`;
            return;
        }
        const user = querySnapshot.docs[0].data();
        renderSingleProfile(user);
    } catch (error) {
        console.error(error);
        profileViewContainer.innerHTML = `<p class="info-message">Error fetching profile.</p>`;
    }
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
            if (!e.target.value) {
                discoverUsers();
                return;
            }
            searchDebounceTimer = setTimeout(() => {
                searchUsers(e.target.value);
            }, 500);
        });
        discoverButton.addEventListener('click', discoverUsers);
    }
});
