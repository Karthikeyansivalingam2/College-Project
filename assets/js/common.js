/* Component Loader */
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
        // Re-attach PWA listener if button exists
        if (window.deferredPrompt && document.getElementById('installAppBtn')) {
          const btn = document.getElementById('installAppBtn');
          btn.classList.remove('hidden');
          btn.addEventListener('click', () => {
            btn.style.display = 'none';
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choice) => {
              window.deferredPrompt = null;
            });
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
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
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

document.addEventListener('DOMContentLoaded', loadComponents);

/* Mobile menu toggle */
function toggleMenu() {
  var nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
}
/* Navbar scroll effect */
window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".navbar");

  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
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
    installBtn.addEventListener('click', () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});


