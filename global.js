import { menuItems } from './menu.js';
import { onAuthStateChange, getCurrentUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuList = document.querySelector('#side-menu ul');
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const openMenu = () => {
        if (sideMenu) sideMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('active');
    };

    const closeMenu = () => {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('active');
    };
    
    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    try {
        const updateMenuForAuthState = (user) => {
            const updatedMenuItems = menuItems.map(item => {
                if (item.text === 'Profile') {
                    return {
                        ...item,
                        href: user ? 'website/profile.html' : 'website/register.html'
                    };
                }
                return item;
            });

            if (menuList) {
                menuList.innerHTML = updatedMenuItems.map(item => `
                    <li>
                        <a href="/${item.href}">
                            <i class="${item.icon}"></i> ${item.text}
                        </a>
                    </li>
                `).join('');
            }
        };

        const handleAccountNag = async () => {
            const user = await getCurrentUser();
            const nagDismissed = sessionStorage.getItem('accountNagDismissed');
            if (!user && !nagDismissed) {
                const nagBanner = document.createElement('div');
                nagBanner.className = 'nag-banner';
                nagBanner.innerHTML = `
                    <p>Create a free account to unlock future features and engage with the community!</p>
                    <div class="nag-actions">
                        <a href="website/register.html" class="nag-button primary">Create Account</a>
                        <button class="nag-button" id="dismiss-nag">Dismiss</button>
                    </div>
                `;
                document.body.prepend(nagBanner);
                document.getElementById('dismiss-nag').addEventListener('click', () => {
                    nagBanner.style.transform = 'translateY(-100%)';
                    sessionStorage.setItem('accountNagDismissed', 'true');
                    setTimeout(() => nagBanner.remove(), 300);
                });
            }
        };
        
        onAuthStateChange(async (event, session) => {
            const user = session?.user || null;
            updateMenuForAuthState(user);
        });

        getCurrentUser().then(user => {
            updateMenuForAuthState(user);
        });
        
        handleAccountNag();

    } catch (error) {
        console.error("Authentication module failed to load. Some features may be unavailable.", error);
        if (menuList) {
            menuList.innerHTML = menuItems.map(item => `
                <li>
                    <a href="/${item.href}">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                </li>
            `).join('');
        }
    }
});
