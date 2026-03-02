const toastStyles = `
#toast-container {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.toast {
    min-width: 280px;
    max-width: 380px;
    padding: 14px 18px;
    border-radius: 14px;
    background: #1a1a1a;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
    transform: translateX(100%);
    border-left: 4px solid #333;
    backdrop-filter: blur(12px);
}
.toast .toast-msg {
    font-weight: 600;
    font-size: 0.85rem;
    color: #ffffff;
    line-height: 1.4;
}
.toast.success { border-color: #22c55e; background: rgba(20, 40, 20, 0.95); }
.toast.error   { border-color: #ef4444; background: rgba(40, 15, 15, 0.95); }
.toast.info    { border-color: #ff6b00; background: rgba(30, 20, 10, 0.95); }

.toast i { font-size: 1.2rem; flex-shrink: 0; }
.toast.success i { color: #22c55e; }
.toast.error   i { color: #ef4444; }
.toast.info    i { color: #ff6b00; }

/* Light mode overrides */
body.light-mode .toast {
    background: #ffffff;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}
body.light-mode .toast .toast-msg {
    color: #111827;
}
body.light-mode .toast.success { background: #f0fdf4; }
body.light-mode .toast.error   { background: #fef2f2; }
body.light-mode .toast.info    { background: #fff7ed; }

@keyframes slideIn {
    to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeOut {
    to { opacity: 0; transform: translateX(100%); }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = toastStyles;
document.head.appendChild(styleSheet);

// Create Container
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
document.body.appendChild(toastContainer);

window.showToast = function (message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
};

// Override alert for quick migration
window.alert = function (msg) {
    showToast(msg, 'info');
};
