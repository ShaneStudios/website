document.addEventListener('DOMContentLoaded', () => {
    const timeEl = document.getElementById('time');
    const modal = document.getElementById('times-up-modal');
    const iframe = document.getElementById('ryxide-iframe');
    const isLoggedIn = localStorage.getItem('shaneStudiosLoggedIn') === 'true';
    let timeInSeconds = isLoggedIn ? 1800 : 900;
    const countdown = setInterval(() => {
        timeInSeconds--;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timeEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `[${timeEl.textContent}] RyxIDE Demo - Shane Studios`;
        if (timeInSeconds <= 0) {
            clearInterval(countdown);
            timeEl.textContent = "00:00";
            document.title = `[Time's Up!] RyxIDE Demo - Shane Studios`;
            showTimesUpModal();
        }
    }, 1000);
    function showTimesUpModal() {
        iframe.style.pointerEvents = 'none';
        modal.classList.add('active');
    }
});