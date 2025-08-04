import { getCurrentUser, signOut } from './auth.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const profileForm = document.getElementById('profile-form');
    const updateButton = document.getElementById('update-button');
    const logoutButton = document.getElementById('logout-button');
    const messageDiv = document.getElementById('form-message');

    const emailInput = document.getElementById('email');
    const memberIdInput = document.getElementById('member-id');
    const displayNameInput = document.getElementById('display-name');
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');

    const showMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.className = type;
        setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
    };

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    welcomeMessage.textContent = `Welcome, ${user.profile.display_name || user.profile.username}!`;
    emailInput.value = user.email;
    memberIdInput.value = user.profile.member_id.toString().padStart(8, '0');
    displayNameInput.value = user.profile.display_name || '';
    usernameInput.value = user.profile.username || '';
    bioInput.value = user.profile.bio || '';

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateButton.disabled = true;
        updateButton.textContent = 'Updating...';

        const updates = {
            id: user.id,
            display_name: displayNameInput.value,
            username: usernameInput.value,
            bio: bioInput.value,
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            showMessage(`Error: ${error.message}`);
        } else {
            showMessage('Profile updated successfully!', 'success');
            welcomeMessage.textContent = `Welcome, ${displayNameInput.value || usernameInput.value}!`;
        }

        updateButton.disabled = false;
        updateButton.textContent = 'Update Profile';
    });
    
    logoutButton.addEventListener('click', async () => {
        logoutButton.textContent = 'Logging Out...';
        await signOut();
        window.location.href = '/index.html';
    });
});
