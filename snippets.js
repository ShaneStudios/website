document.addEventListener('DOMContentLoaded', () => {
    const allCopyButtons = document.querySelectorAll('.copy-btn');
    allCopyButtons.forEach(copyButton => {
        copyButton.addEventListener('click', (event) => {
            const button = event.currentTarget;
            const codeContainer = button.closest('.code-container');
            const codeBlock = codeContainer.querySelector('pre code');
            if (!codeBlock) {
                console.error("Could not find code block to copy.");
                return;
            }
            const codeText = codeBlock.innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                const originalContent = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.classList.add('copied');
                button.disabled = true;
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.classList.remove('copied');
                    button.disabled = false;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.innerText = 'Error!';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    });
});