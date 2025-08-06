import { getCurrentUser, signOut } from './auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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
        messageDiv.style.display = 'block';
        setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
    };
    const user = await getCurrentUser();
    if (!user || !user.isVerified) {
        window.location.href = '/website/login.html';
        return;
    }
    welcomeMessage.textContent = `Welcome, ${user.profile.display_name || user.profile.username}!`;
    emailInput.value = user.email;
    if (user.profile.member_id) {
        memberIdInput.value = user.profile.member_id.toString().padStart(8, '0');
    } else {
        memberIdInput.value = 'N/A';
    }
    displayNameInput.value = user.profile.display_name || '';
    usernameInput.value = user.profile.username || '';
    bioInput.value = user.profile.bio || '';
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateButton.disabled = true;
        updateButton.textContent = 'Updating...';
        const profileRef = doc(db, "profiles", user.uid);
        try {
            await updateDoc(profileRef, {
                display_name: displayNameInput.value,
                username: usernameInput.value,
                bio: bioInput.value,
            });
            showMessage('Profile updated successfully!', 'success');
            welcomeMessage.textContent = `Welcome, ${displayNameInput.value || usernameInput.value}!`;
        } catch (error) {
            showMessage(`Error: ${error.message}`);
        }
        updateButton.disabled = false;
        updateButton.textContent = 'Update Profile';
    });
    logoutButton.addEventListener('click', async () => {
        logoutButton.textContent = 'Logging Out...';
        await signOut();
        window.location.href = '/website/index.html';
    });
});
