/* Component Loader & Logic */
async function loadComponents() {
  const nav = document.getElementById('global-navbar');
  const foot = document.getElementById('global-footer');

  if (nav) {
    try {
      const res = await fetch('./components/navbar.html');
      if (res.ok) {
        nav.innerHTML = await res.text();
        updateAuthUI();
        setActiveLink();

        // Init Theme Icon after load
        const isDark = localStorage.getItem('theme') === 'dark';
        updateThemeIcon(isDark);

        // Re-attach PWA listener
        if (window.deferredPrompt && document.getElementById('installAppBtn')) {
          const btn = document.getElementById('installAppBtn');
          btn.classList.remove('hidden');
          btn.addEventListener('click', () => {
            btn.style.display = 'none';
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then(() => window.deferredPrompt = null);
          });
        }
      }
    } catch (e) { console.error("Error loading navbar", e); }
  }

  if (foot) {
    try {
      const res = await fetch('./components/footer.html');
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

      // Premium color mapping
      const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];
      const colorIndex = initial.charCodeAt(0) % colors.length;
      if (profileBtn) {
        profileBtn.classList.remove('bg-white/10');
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
    icon.classList.remove('fa-moon', 'text-emerald-500');
    icon.classList.add('fa-sun', 'text-yellow-400');
  } else {
    icon.classList.remove('fa-sun', 'text-yellow-400');
    icon.classList.add('fa-moon', 'text-emerald-500');
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
      .then((reg) => console.log('Service Worker Registered!', reg))
      .catch((err) => console.log('Service Worker Failed!', err));
  });
}

let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.classList.remove('hidden');
    // Listener attached in loadComponents if button dynamic, or here if static
  }
});
