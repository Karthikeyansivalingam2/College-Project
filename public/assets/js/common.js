// --- Global Debug System ---
function logDebug(msg) {
  console.log(`[DEBUG] ${msg}`);

  let debugContent = document.getElementById('debugContent');
  let debugOverlay = document.getElementById('debugOverlay');

  // If overlay doesn't exist, create it (enables debug on all pages)
  if (!debugOverlay) {
    debugOverlay = document.createElement('div');
    debugOverlay.id = 'debugOverlay';
    debugOverlay.className = 'fixed top-20 right-4 z-[5000] bg-black/90 text-xs text-green-400 p-3 rounded-lg border border-green-500/50 hidden max-w-xs overflow-auto max-h-[400px] shadow-2xl';
    debugOverlay.innerHTML = `<h4 class="font-bold border-b border-green-500/30 mb-2 pb-1 flex justify-between">Debug info <span class="opacity-50">Ctrl+Shift+D</span></h4><div id="debugContent"></div>`;
    document.body.appendChild(debugOverlay);
    debugContent = document.getElementById('debugContent');

    // Add toggle listener if it's the first time
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugOverlay.classList.toggle('hidden');
      }
    });
  }

  if (debugContent) {
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = 'mb-1 border-b border-white/5 pb-1';
    line.innerHTML = `<span class="opacity-50">[${time}]</span> ${msg}`;
    debugContent.prepend(line);
  }
}

// Global Error Catcher for all pages
window.addEventListener('error', (e) => {
  logDebug(`GLOBAL ERROR: ${e.message} at ${e.filename}:${e.lineno}`);
});

logDebug("Global Debug Loaded - PWA System Initializing...");

async function loadComponents() {
  const nav = document.getElementById('global-navbar');
  const foot = document.getElementById('global-footer');

  if (nav) {
    try {
      const res = await fetch('/components/navbar.html');
      if (res.ok) {
        nav.innerHTML = await res.text();
        updateAuthUI();
        setActiveLink();

        // Init Theme Icon after load
        const isDark = localStorage.getItem('theme') === 'dark';
        updateThemeIcon(isDark);

        // PWA button will be handled by the interval in showInstallButton()
      }
    } catch (e) { console.error("Error loading navbar", e); }
  }

  if (foot) {
    try {
      const res = await fetch('/components/footer.html');
      if (res.ok) foot.innerHTML = await res.text();
    } catch (e) { console.error("Error loading footer", e); }
  }
}

function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
    else link.classList.remove('active');
  });
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    const profileBtn = document.getElementById('navProfile');
    const loginLink = document.querySelector('.nav-login');

    if (profileBtn) {
      profileBtn.classList.remove('hidden');
      profileBtn.style.display = 'flex';
    }
    if (loginLink) loginLink.style.display = 'none';

    if (user.username) {
      const initial = user.username.charAt(0).toUpperCase();
      const initialEl = document.getElementById('navUserInitial');
      if (initialEl) initialEl.innerText = initial;

      const icon = document.getElementById('navUserIcon');
      if (icon) icon.classList.add('hidden');

      // Red-theme color mapping for profile initial
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];
      const colorIndex = initial.charCodeAt(0) % colors.length;
      if (profileBtn) {
        profileBtn.classList.remove('bg-white/10', 'bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500');
        profileBtn.classList.add(colors[colorIndex]);
      }
    }
  }
}

// -- Theme Logic --
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (isDark) {
    icon.classList.remove('fa-moon', 'text-red-500');
    icon.classList.add('fa-sun', 'text-yellow-400');
  } else {
    icon.classList.remove('fa-sun', 'text-yellow-400');
    icon.classList.add('fa-moon', 'text-red-500');
  }
}

// Init Theme Immediately
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', loadComponents);

/* Mobile menu toggle */
function toggleMenu() {
  var nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
}
/* Navbar scroll effect */
window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
});

/* Quick search redirect */
function quickSearch(place) {
  window.location.href = "search.html?q=" + encodeURIComponent(place);
}

// -- PWA Install & Service Worker Logic --
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((reg) => {
        console.log('SW Registered!', reg);
        if (typeof logDebug === 'function') logDebug("PWA: Service Worker Active");
      })
      .catch((err) => {
        console.log('SW Failed!', err);
        if (typeof logDebug === 'function') logDebug("PWA: SW Error - " + err.message);
      });
  });
}

// Global variable for the prompt
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  if (typeof logDebug === 'function') logDebug("PWA: Install Prompt Detected!");

  // Try showing button immediately
  showInstallButton();
});

function showInstallButton() {
  const installBtn = document.getElementById('installAppBtn');
  if (installBtn && window.deferredPrompt) {
    installBtn.classList.remove('hidden');
    installBtn.style.display = 'flex';

    installBtn.addEventListener('click', () => {
      installBtn.style.display = 'none';
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then(() => {
        window.deferredPrompt = null;
        if (typeof logDebug === 'function') logDebug("PWA: App Installed!");
      });
    });
  }
}

// Check every few seconds if button should be shown (for dynamic navbar)
setInterval(showInstallButton, 2000);
