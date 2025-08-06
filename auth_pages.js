import { signUp, signIn } from './auth.js';
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('form-message');
    const showMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
    };
    if (registerForm) {
        const registerButton = document.getElementById('register-button');
        const checkRegisterFormState = () => {
            const inputs = registerForm.querySelectorAll('input');
            let allValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    allValid = false;
                }
            });
            registerButton.disabled = !allValid;
        };
        registerForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', checkRegisterFormState);
        });
        checkRegisterFormState();
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerButton.disabled = true;
            registerButton.textContent = 'Registering...';
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;
            const displayName = document.getElementById('display-name').value;
            const { error } = await signUp(email, password, username, displayName);
            if (error) {
                showMessage(error.message || 'An unknown error occurred.');
                registerButton.disabled = false;
                registerButton.textContent = 'Register';
            } else {
                registerForm.style.display = 'none';
                document.querySelector('.switch-form-link').style.display = 'none';
                showMessage('Success! Please check your email for a verification link.', 'success');
            }
        });
    }
    if (loginForm) {
        const loginButton = document.getElementById('login-button');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginButton.disabled = true;
            loginButton.textContent = 'Logging In...';
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const { data, error } = await signIn(email, password);
            if (error) {
                showMessage(error.message);
                loginButton.disabled = false;
                loginButton.textContent = 'Log In';
            } else if (data) {
                showMessage('Login successful! Redirecting...', 'success');
                window.location.href = '/website/profile.html';
            }
        });
    }
});
