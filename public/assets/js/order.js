/* TOGGLE */
const retail = document.getElementById("retailSection")
const corporate = document.getElementById("monthlySection")
const rBtn = document.getElementById("retailBtn")
const cBtn = document.getElementById("packageBtn")

function toggleLocationModal() {
  document.getElementById('locationModal').classList.toggle('hidden');
}

function logDebug(msg) {
  const el = document.getElementById('debugContent');
  if (el) {
    const time = new Date().toLocaleTimeString();
    el.innerHTML = `[${time}] ${msg}<br>` + el.innerHTML;
  }
  console.log(msg);
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    document.getElementById('debugOverlay')?.classList.toggle('hidden');
  }
});

// Global Error Catcher
window.onerror = function (msg, url, line, col, error) {
  logDebug(`CRASH: ${msg} line:${line}`);
  return false;
};

function setLocation(loc) {
  const el = document.getElementById('currentLoc');
  if (el) el.innerText = loc;
  localStorage.setItem('userLocation', loc);
  toggleLocationModal();
}
function switchMode(mode) {


  if (mode === "retail") {
    retail.classList.remove("hidden")
    corporate.classList.add("hidden")

    rBtn.classList.add("bg-emerald-600", "text-white")
    rBtn.classList.remove("bg-gray-200")

    cBtn.classList.add("bg-gray-200")
    cBtn.classList.remove("bg-emerald-600", "text-white")
  } else {
    corporate.classList.remove("hidden")
    retail.classList.add("hidden")

    cBtn.classList.add("bg-emerald-600", "text-white")
    cBtn.classList.remove("bg-gray-200")

    rBtn.classList.add("bg-gray-200")
    rBtn.classList.remove("bg-emerald-600", "text-white")

    renderPackages()
  }
}


/* RETAIL LOGIC */
let cart = {};
function updateQty(name, price, change) {
  cart[name] = cart[name] || { price, qty: 0 };
  cart[name].qty += change;

  if (cart[name].qty <= 0) {
    delete cart[name];
  }

  renderCart();
  calculateSplit();
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartBar = document.getElementById("cartBar");
  if (!cartItemsEl || !cartBar) return;

  cartItemsEl.innerHTML = "";

  let total = 0;
  let count = 0;

  Object.keys(cart).forEach(k => {
    const i = cart[k];
    total += i.price * i.qty;
    count += i.qty;

    cartItemsEl.innerHTML += `
      <li class="flex justify-between mb-2">
        <span>${k} × ${i.qty}</span>
        <span>₹${i.price * i.qty}</span>
      </li>
    `;
  });

  const totalEl = document.getElementById("total");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");

  if (totalEl) totalEl.innerText = total;
  if (cartTotalEl) cartTotalEl.innerText = total;
  if (cartCountEl) cartCountEl.innerText = count;

  // Show / hide cart bar
  if (count > 0) {
    cartBar.classList.remove("hidden");
    renderMenu();
  } else {
    cartBar.classList.add("hidden");
    renderMenu();
  }
}

function openCart() {
  document.getElementById("cartDrawer").classList.remove("hidden");
  document.getElementById("btnTotal").innerText = document.getElementById("total").innerText;
  calculateSplit();
}

function closeCart() {
  document.getElementById("cartDrawer").classList.add("hidden");
}

let selectedCategory = null;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function selectCategory(category) {
  selectedCategory = category;

  document.querySelectorAll(".typeBtn").forEach(btn => {
    btn.classList.remove("bg-emerald-600", "text-white");
    btn.classList.add("bg-gray-200");
  });

  // Safe way to handle event target
  if (window.event && window.event.target) {
    const btn = window.event.target;
    btn.classList.remove("bg-gray-200");
    btn.classList.add("bg-emerald-600", "text-white");
  }
  renderMenu();
}
let teaMenu = [];

async function fetchMenu() {
  logDebug("Fetching menu from API...");
  try {
    const res = await fetch('/api/menu?v=' + Date.now());
    teaMenu = await res.json();
    logDebug(`Fetched ${teaMenu.length} items from server.`);
    renderMenu();
  } catch (err) {
    logDebug(`FETCH ERROR: ${err.message}`);
    console.error("Failed to fetch menu", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  logDebug("Page Loaded - Initializing Scripts...");

  try {
    const savedLoc = localStorage.getItem('userLocation');
    const locEl = document.getElementById('currentLoc');
    if (savedLoc && locEl) locEl.innerText = savedLoc;

    fetchMenu();
    loadSavedAddress();
    calculateCatering();

    // Initial breadcrumb/UI sync
    renderMenu();
  } catch (err) {
    logDebug(`INIT ERROR: ${err.message}`);
  }
});

function renderMenu() {
  if (!Array.isArray(teaMenu)) {
    console.error("teaMenu is not an array:", teaMenu);
    return;
  }

  const beverageGrid = document.getElementById("beverageGrid");
  const breakfastGrid = document.getElementById("breakfastGrid");
  const lunchGrid = document.getElementById("lunchGrid");
  const dinnerGrid = document.getElementById("dinnerGrid");
  const fastFoodGrid = document.getElementById("fastFoodGrid");
  const dietGrid = document.getElementById("dietGrid");

  const beverageSection = document.getElementById("beverageSection");
  const breakfastSection = document.getElementById("breakfastSection");
  const lunchSection = document.getElementById("lunchSection");
  const dinnerSection = document.getElementById("dinnerSection");
  const fastFoodSection = document.getElementById("fastFoodSection");
  const dietSection = document.getElementById("dietSection");

  // Safely clear
  [beverageGrid, breakfastGrid, lunchGrid, dinnerGrid, fastFoodGrid, dietGrid].forEach(el => {
    if (el) el.innerHTML = "";
  });

  const searchInput = document.getElementById("searchTea");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const healthyToggle = document.getElementById("healthyModeToggle");
  const isHealthyMode = healthyToggle ? healthyToggle.checked : false;

  logDebug(`Rendering menu: ${teaMenu.length} items fetched.`);
  logDebug(`Mode: Healthy=${isHealthyMode}, Category=${selectedCategory}`);

  // Filter by category, search AND active status
  const filtered = teaMenu.filter(t => {
    // case-insensitive matching for category
    const matchesCategory = !selectedCategory || (t.category && t.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !search || (t.name && t.name.toLowerCase().includes(search));
    const matchesHealthy = !isHealthyMode || t.category === 'Healthy' || (t.calories && t.calories < 300);
    const isActive = t.active !== false;

    return isActive && matchesCategory && matchesSearch && matchesHealthy;
  });

  logDebug(`Filtered items: ${filtered.length}. Rendering...`);

  // Hide all sections initially
  [beverageSection, breakfastSection, lunchSection, dinnerSection, fastFoodSection, dietSection].forEach(s => {
    if (s) s.classList.add('hidden');
  });

  logDebug(`Rendering ${filtered.length} items to grids...`);

  filtered.forEach(t => {
    const isFav = favorites.includes(t.name);
    const cartItem = cart[t.name] || { qty: 0 };

    // Determine Grid
    let targetGrid = null;
    let targetSection = null;
    const cat = (t.category || "").toLowerCase();

    if (["tea", "coffee", "milk special", "popular", "cold", "premium", "beverage"].includes(cat)) {
      targetGrid = beverageGrid;
      targetSection = beverageSection;
    }
    else if (cat === "breakfast") {
      targetGrid = breakfastGrid;
      targetSection = breakfastSection;
    }
    else if (cat === "lunch") {
      targetGrid = lunchGrid;
      targetSection = lunchSection;
    }
    else if (cat === "dinner") {
      targetGrid = dinnerGrid;
      targetSection = dinnerSection;
    }
    else if (cat === "diet" || cat === "healthy") {
      targetGrid = dietGrid;
      targetSection = dietSection;
    }
    else {
      targetGrid = fastFoodGrid;
      targetSection = fastFoodSection;
    }

    if (!targetGrid) {
      logDebug(`WARNING: No grid for item ${t.name} (cat: ${cat})`);
      return;
    }

    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    const card = `
      <div class="glass-card p-4 flex justify-between items-center group mb-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div class="flex-1 pr-4 relative z-10">
          <div class="flex items-center gap-2 mb-1">
             <i class="fa-regular fa-square-caret-up text-[12px] ${t.category === 'Healthy' ? 'text-green-500' : 'text-red-500'}"></i>
             ${t.bestseller ? `<span class="bg-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]"><i class="fa-solid fa-star text-[9px]"></i> Bestseller</span>` : ""}
             ${isHealthyMode && t.calories ? `<span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"><i class="fa-solid fa-fire text-[9px]"></i> ${t.calories} kcal</span>` : ""}
          </div>
          <h3 class="font-bold text-gray-100 text-lg mb-1 group-hover:text-emerald-400 transition-colors">${t.name}</h3>
          <p class="font-bold text-white text-base mb-2">₹${t.price}</p>
          <div class="flex items-center gap-3 text-xs text-gray-400 font-medium bg-white/5 inline-flex px-2 py-1 rounded-lg border border-white/5">
             <span class="flex items-center gap-1 text-emerald-400"><i class="fa-solid fa-star text-[10px]"></i> 4.2</span>
             <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
             <span>${t.category}</span>
          </div>
        </div>

        <div class="relative w-32 h-28 shrink-0">
          <img src="${t.image}" class="w-full h-full object-cover rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition duration-500">
          
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[90%] z-20">
            ${cartItem.qty > 0 ? `
              <div class="bg-gray-900/95 backdrop-blur border border-emerald-500/50 text-emerald-400 font-bold px-1 py-1.5 rounded-xl shadow-xl flex justify-between items-center text-sm w-full">
                <button onclick="updateQty('${t.name}',${t.price},-1)" class="w-8 h-full flex items-center justify-center hover:bg-emerald-500/20 rounded-lg transition text-lg">−</button>
                <span class="text-white text-base">${cartItem.qty}</span>
                <button onclick="updateQty('${t.name}',${t.price},1)" class="w-8 h-full flex items-center justify-center hover:bg-emerald-500/20 rounded-lg transition text-lg">+</button>
              </div>
            ` : `
              <button onclick="updateQty('${t.name}',${t.price},1)" 
                class="w-full bg-slate-900 text-emerald-400 border border-emerald-500/50 font-bold py-2 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-500 hover:shadow-emerald-500/40 transition-all uppercase text-xs tracking-wider transform active:scale-95 backdrop-blur-md">
                ADD
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    targetGrid.innerHTML += card;
  });
}


function toggleFav(name) {
  favorites = favorites.includes(name)
    ? favorites.filter(f => f !== name)
    : [...favorites, name];

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderMenu();
}


const allPackages = [
  // HOSTEL & STUDENT MESS
  {
    type: "Hostel",
    name: "1-Day Mess Trial",
    desc: "Try our homely food for a day",
    price: "₹199 / day",
    features: ["Breakfast", "Lunch", "Dinner", "No Commitment"]
  },
  {
    type: "Hostel",
    name: "Student Monthly Mess",
    desc: "Budget friendly pocket saver",
    price: "₹4,500 / month",
    features: ["3 Meals/Day", "Sun Feast Special", "Unlimited Rice", "Sharing allowed"]
  },
  {
    type: "Hostel",
    name: "Premium Hostel Pack",
    desc: "For those who miss home food",
    price: "₹6,000 / month",
    features: ["Non-Veg 3x/week", "Evening Snacks", "Milk at Night", "Room Delivery"]
  },

  // SENIOR CITIZEN DIET
  {
    type: "Senior",
    name: "Diabetic Friendly",
    desc: "Low oil, low sugar, high fiber",
    price: "₹5,500 / month",
    features: ["Millet Breakfast", "Less Spicy Lunch", "Light Dinner", "Health Drink"]
  },
  {
    type: "Senior",
    name: "Pure Veg Sathvik",
    desc: "No onion, no garlic options",
    price: "₹5,000 / month",
    features: ["Traditional South Indian", "Easily Digestible", "Warm Delivery"]
  },

  // CORPORATE SNACKS
  {
    type: "Corporate",
    name: "Daily Tea & Snacks",
    desc: "Boost office productivity",
    price: "₹2,500 / employee",
    features: ["Morning Tea/Coffee", "Evening Snacks", "Cookies/Biscuits", "On-site Dispenser"]
  },
  {
    type: "Corporate",
    name: "Meeting Munchies",
    desc: "For client meetings & events",
    price: "₹500 / head",
    features: ["Premium Pastries", "Sandwiches", "Assorted Drinks", "Boxed Presentation"]
  },

  // EVENT CATERING
  {
    type: "Event",
    name: "Birthday Bash Combo",
    desc: "Kids special party menu",
    price: "Starts @ ₹250/head",
    features: ["Cake", "French Fries", "Noodles/Pasta", "Fruit Punch", "Decor Support"]
  },
  {
    type: "Event",
    name: "Marriage Feast",
    desc: "Traditional leaf service",
    price: "Starts @ ₹450/head",
    features: ["30+ Items", "Live Counters", "Welcome Drinks", "Betel Nut & Beeda"]
  },
];

function filterPackages(type) {
  // Highlight active tab
  // (Simple implementation: just rendering for now, UI highlighting can be added later)
  renderPackages(type);
}

function renderPackages(filterType = "Hostel") {
  const grid = document.getElementById("packageGrid");
  grid.innerHTML = "";

  const filtered = allPackages.filter(p => p.type === filterType);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center text-gray-400">No packages found</div>`;
    return;
  }

  filtered.forEach(pkg => {
    grid.innerHTML += `
      <div class="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        
        <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 relative z-10">${pkg.type} Plan</span>
        <h3 class="text-xl font-bold mt-1 text-gray-800 dark:text-gray-100 relative z-10">${pkg.name}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 relative z-10">${pkg.desc}</p>
        
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 relative z-10">${pkg.price}</div>
        
        <ul class="space-y-2 mb-6 text-sm text-gray-700 dark:text-gray-300 relative z-10">
          ${pkg.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
        </ul>

        <button onclick="openCorporateForm('${pkg.name} (${pkg.type})')" 
          class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition shadow-lg shadow-emerald-900/20 relative z-10">
          Book Trial / Enquire
        </button>
      </div>
    `;
  });
}

// Initial Render
renderPackages("Hostel");
function openCorporateForm(packageName) {
  // Update the form field
  const pkgInput = document.getElementById("txtSelectedPackage");
  if (pkgInput) {
    pkgInput.value = packageName;
    pkgInput.classList.remove("text-gray-500");
    pkgInput.classList.add("text-emerald-600", "font-bold");
  }

  // Smooth Scroll to Form
  const form = document.getElementById("enquiryForm");
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Focus Name field
  setTimeout(() => {
    document.getElementById("txtEnqName").focus();
  }, 800);
}

//form validation
const spnErrorAddress = document.getElementById("spnErrorAddress")

function processPayment() {
  const name = document.getElementById('txtName').value;
  const mobile = document.getElementById('txtMobile').value;
  const address = document.getElementById('txtAddress').value;

  if (!name || !mobile || !address) {
    alert("Please enter delivery address details");
    return;
  }

  // Save Address for future
  localStorage.setItem("userAddress", JSON.stringify({ name, mobile, address }));

  const orderDetails = {
    username: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).username : 'Guest',
    name, mobile, address,
    city: localStorage.getItem('userLocation') || 'Chennai',
    items: cart,
    total: document.getElementById("total").innerText
  };

  localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
  window.location.href = "payment.html";
}
const namePattern = /^[A-Za-z]+$/;
const mobilePattern = /^[0-9]{10}$/;
var isvalid = true

const btnEnquire = document.getElementById("btnEnquire")
const txtEnqName = document.getElementById("txtEnqName")
const txtEnqMobile = document.getElementById("txtEnqMobile")
const spnEnqErrorName = document.getElementById("spnEnqErrorName")
const spnEnqErrorMobile = document.getElementById("spnEnqErrorMobile")
const txtEnqEmail = document.getElementById("txtEnqEmail")
const txtEnqComapny = document.getElementById("txtEnqComapny")
const spnEnqErrorEmail = document.getElementById("spnEnqErrorEmail")
const spnEnqErrorComapny = document.getElementById("spnEnqErrorComapny")
const mobilePattern1 = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let isvalidEnq = true
btnEnquire.addEventListener("click", function (event) {
  //event.preventDefault();
  isvalidEnq = true
  if (txtEnqName.value == "") {
    spnEnqErrorName.innerHTML = "Please enter the name"
    isvalidEnq = false
  }
  else {
    spnEnqErrorName.innerHTML = ""
  }
  if (txtEnqMobile.value == "") {
    spnEnqErrorMobile.innerHTML = "Please enter the mobile number"
    isvalidEnq = false
  }
  else {
    if (!mobilePattern1.test(txtEnqMobile.value)) {
      spnEnqErrorMobile.innerHTML = "Enter a valid 10-digit mobile number";
      isvalidEnq = false;
    }
    else {
      spnEnqErrorMobile.innerHTML = "";
    }

  }
  if (txtEnqEmail.value == "") {
    spnEnqErrorEmail.innerHTML = "Please enter the email"
    isvalidEnq = false
  }
  else {
    if (!emailRegex.test(txtEnqEmail.value)) {
      spnEnqErrorEmail.innerHTML = "Please enter valid email";
      isvalidEnq = false;
    }
    else {
      spnEnqErrorEmail.innerHTML = "";
    }

  }

  if (txtEnqComapny.value == "") {
    spnEnqErrorComapny.innerHTML = "Please enter the company name"
    isvalidEnq = false
  }
  else {
    spnEnqErrorComapny.innerHTML = ""
  }


  if (isvalidEnq) {
    const enquiryDetails = {
      name: txtEnqName.value,
      mobile: txtEnqMobile.value,
      email: txtEnqEmail.value,
      company: txtEnqComapny.value
    };

    fetch('/api/enquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryDetails)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Show Acknowledgement Modal
          showAckModal(data.enquiryId, enquiryDetails);

          // Optional: Clear form
          txtEnqName.value = "";
          txtEnqMobile.value = "";
          txtEnqEmail.value = "";
          txtEnqComapny.value = "";
        } else {
          alert(data.message);
        }
      })
      .catch(err => console.error(err));
  }

})

// Acknowledgement Modal Logic
function showAckModal(id, details) {
  const modal = document.getElementById('ackModal');

  // Populate Data
  document.getElementById('ackRefId').innerText = id;
  document.getElementById('ackDate').innerText = "Date: " + new Date().toLocaleString();

  document.getElementById('ackName').innerText = details.name;
  document.getElementById('ackMobile').innerText = details.mobile;
  document.getElementById('ackEmail').innerText = details.email;
  document.getElementById('ackCompany').innerText = details.company;

  const pkg = document.getElementById("txtSelectedPackage").value;
  document.getElementById('ackPackage').innerText = pkg;

  // Show
  modal.classList.remove('hidden');
}

function closeAckModal() {
  document.getElementById('ackModal').classList.add('hidden');
  // window.location.reload(); // Optional: reload after closing if needed
}

/* ADDRESS MANAGEMENT LOGIC */
function loadSavedAddress() {
  const saved = localStorage.getItem("userAddress");
  const formView = document.getElementById("addressFormView");
  const savedView = document.getElementById("savedAddressView");
  const changeBtn = document.getElementById("changeAddressBtn");

  if (saved) {
    const addr = JSON.parse(saved);

    // Populate Views
    document.getElementById("savedName").innerText = addr.name;
    document.getElementById("savedMobile").innerText = addr.mobile;
    document.getElementById("savedAddressText").innerText = addr.address;

    // Populate Hidden Inputs (for payment processing)
    document.getElementById('txtName').value = addr.name;
    document.getElementById('txtMobile').value = addr.mobile;
    document.getElementById('txtAddress').value = addr.address;

    // Switch UI
    savedView.classList.remove("hidden");
    formView.classList.add("hidden");
    changeBtn.classList.remove("hidden");
  } else {
    toggleAddressEdit();
  }
}

function toggleAddressEdit() {
  document.getElementById("savedAddressView").classList.add("hidden");
  document.getElementById("addressFormView").classList.remove("hidden");
  document.getElementById("changeAddressBtn").classList.add("hidden");
}

function detectLocation() {
  if (navigator.geolocation) {
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, use Reverse Geocoding API here.
        // For now, we simulate a detected address based on current city
        const city = localStorage.getItem('userLocation') || "Chennai";
        const detectedAddress = `[GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}] \nNear ${city} Center, Main Road, ${city}`;

        document.getElementById('txtAddress').value = detectedAddress;

        btn.innerHTML = '<i class="fa-solid fa-check"></i> Found!'; // Success state
        btn.classList.add('bg-emerald-900/50', 'text-emerald-300');

        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove('bg-emerald-900/50', 'text-emerald-300');
        }, 2000);
      },
      (error) => {
        alert("Location access denied. Please enter address manually.");
        btn.innerHTML = originalContent;
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

/* NEW FEATURES LOGIC */

function toggleHealthyMode() {
  const isHealthy = document.getElementById("healthyModeToggle").checked;
  if (isHealthy) {
    showToast("Healthy Mode ON: Filtering junk food & showing calories", "success");
  }
  renderMenu();
}

function calculateSplit() {
  const total = parseFloat(document.getElementById("total").innerText) || 0;
  const friends = parseInt(document.getElementById("numFriends").value) || 1;
  const split = friends > 0 ? (total / friends).toFixed(2) : total;
  document.getElementById("splitAmount").innerText = split;
}

function calculateCatering() {
  const guests = parseInt(document.getElementById("numGuests").value) || 50;
  const perPlate = parseInt(document.getElementById("cateringType").value) || 250;

  const total = guests * perPlate;

  document.getElementById("cateringEstimate").innerText = total.toLocaleString();
  document.getElementById("perPlateCost").innerText = perPlate;
}


