import { signUp, signIn } from './auth.js';
import { TURNSTILE_SITE_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('form-message');
    let captchaToken = null;

    const showMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.className = type;
    };

    const renderTurnstile = () => {
        const container = document.getElementById('turnstile-container');
        if (!container) return;
        const checkTurnstile = setInterval(() => {
            if (window.turnstile) {
                clearInterval(checkTurnstile);
                window.turnstile.render('#turnstile-container', {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => {
                        captchaToken = token;
                        if (registerForm) checkRegisterFormState();
                    },
                    'expired-callback': () => {
                        captchaToken = null;
                        if (registerForm) checkRegisterFormState();
                    },
                });
            }
        }, 100);
    };

    const checkRegisterFormState = () => {
        const registerButton = document.getElementById('register-button');
        const inputs = registerForm.querySelectorAll('input');
        let allValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                allValid = false;
            }
        });
        registerButton.disabled = !(allValid && captchaToken);
    };

    if (registerForm) {
        const registerButton = document.getElementById('register-button');
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => input.addEventListener('input', checkRegisterFormState));

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerButton.disabled = true;
            registerButton.textContent = 'Registering...';
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;
            const displayName = document.getElementById('display-name').value;

            const { data, error } = await signUp(email, password, username, displayName, captchaToken);

            if (error) {
                showMessage(error.message);
                registerButton.disabled = false;
                registerButton.textContent = 'Register';
            } else {
                registerForm.style.display = 'none';
                document.querySelector('.switch-form-link').style.display = 'none';
                showMessage('Success! Please check your email for a verification link to complete your registration.', 'success');
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

            if (!captchaToken) {
                showMessage('Please complete the CAPTCHA verification.');
                loginButton.disabled = false;
                loginButton.textContent = 'Log In';
                return;
            }

            const { data, error } = await signIn(email, password, captchaToken);

            if (error) {
                showMessage(error.message);
                window.turnstile.reset();
                captchaToken = null;
                loginButton.disabled = false;
                loginButton.textContent = 'Log In';
            } else {
                showMessage('Login successful! Redirecting...', 'success');
                window.location.href = '/profile.html';
            }
        });
    }

    renderTurnstile();
});
