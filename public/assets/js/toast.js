const toastStyles = `
#toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.toast {
    min-width: 250px;
    padding: 16px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
    transform: translateX(100%);
    border-left: 4px solid #333;
}
.toast.success { border-color: #22c55e; }
.toast.error { border-color: #ef4444; }
.toast.info { border-color: #3b82f6; }

.toast i { font-size: 1.2rem; }
.toast.success i { color: #22c55e; }
.toast.error i { color: #ef4444; }
.toast.info i { color: #3b82f6; }

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
        <span class="font-medium text-gray-800 text-sm">${message}</span>
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

// Override alert for quick migration (optional, but requested to "replace alert")
window.alert = function (msg) {
    showToast(msg, 'info');
};
