/* TOGGLE */
const retail = document.getElementById("retailSection")
const corporate = document.getElementById("monthlySection")
const rBtn = document.getElementById("retailBtn")
const cBtn = document.getElementById("packageBtn")

function toggleLocationModal() {
  document.getElementById('locationModal').classList.toggle('hidden');
}

// Debug toggle and error handling now handled by common.js


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

    rBtn.classList.add("active-filter")
    rBtn.classList.remove("inactive-filter")

    cBtn.classList.add("inactive-filter")
    cBtn.classList.remove("active-filter")
  } else {
    corporate.classList.remove("hidden")
    retail.classList.add("hidden")

    cBtn.classList.add("active-filter")
    cBtn.classList.remove("inactive-filter")

    rBtn.classList.add("inactive-filter")
    rBtn.classList.remove("active-filter")

    renderPackages()
  }
}


/* RETAIL LOGIC */
let cart = {};
function updateCart(name, change) {
  // Find item to get its price
  const item = foodMenu.find(i => i.name === name);
  const price = item ? item.price : 0;

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

function selectCategory(category, clickedBtn) {
  selectedCategory = category;

  // Reset all filter buttons to inactive
  document.querySelectorAll(".typeBtn").forEach(btn => {
    btn.classList.remove("active-filter");
    btn.classList.add("inactive-filter");
  });

  // Set clicked button as active
  if (clickedBtn) {
    clickedBtn.classList.remove("inactive-filter");
    clickedBtn.classList.add("active-filter");
  }

  renderMenu();
}
let foodMenu = [];

async function fetchMenu() {
  logDebug("Fetching menu from API...");
  try {
    const res = await fetch('/api/menu?v=' + Date.now());
    foodMenu = await res.json();
    logDebug(`Fetched ${foodMenu.length} items from server.`);
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
  if (!Array.isArray(foodMenu)) {
    console.error("foodMenu is not an array:", foodMenu);
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

  logDebug(`Rendering menu: ${foodMenu.length} items fetched.`);
  logDebug(`Mode: Healthy=${isHealthyMode}, Category=${selectedCategory}`);

  // Filter by category, search AND active status
  const filtered = foodMenu.filter(t => {
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
      <div class="bg-[#111] border border-white/5 p-5 flex justify-between items-center group mb-4 relative overflow-hidden rounded-[2rem] shadow-2xl hover:border-orange-500/30 transition-all">
        
        <div class="flex-1 pr-6 relative z-10">
          <div class="flex items-center gap-2 mb-3">
             <i class="fa-regular fa-square-caret-up text-[12px] ${t.category === 'Healthy' ? 'text-green-500' : 'text-orange-500'}"></i>
             ${t.bestseller ? `<span class="bg-orange-500/10 text-orange-500 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] border border-orange-500/20">Bestseller</span>` : ""}
             ${isHealthyMode && t.calories ? `<span class="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">${t.calories} kcal</span>` : ""}
          </div>
          <h3 class="font-black text-white text-xl mb-1 uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">${t.name}</h3>
          <p class="font-black text-white text-base mb-4">₹${t.price}</p>
          <div class="flex items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.1em] bg-white/5 px-4 py-2 rounded-xl inline-flex border border-white/5">
            <span><i class="fa-regular fa-clock mr-1 text-orange-500"></i> ${t.prep_time || "15 MINS"}</span>
            <span class="text-white/10">|</span>
            <span><i class="fa-solid fa-star text-orange-500 mr-1"></i> ${t.rating || "4.2"}</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-2 relative z-10">
          <div class="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[var(--bg-main)]">
             <img src="${t.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300'}" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100">
             
             <!-- Add Button (StepUp Style) -->
             <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%]">
                ${cartItem.qty > 0 ? `
                  <div class="flex items-center justify-between bg-orange-600 text-white rounded-xl shadow-2xl font-black overflow-hidden border border-orange-400/30">
                    <button onclick="updateCart('${t.name.replace(/'/g, "\\'")}', -1)" class="flex-1 py-2 hover:bg-black/20 transition-colors font-black text-lg">-</button>
                    <span class="px-3 text-sm">${cartItem.qty}</span>
                    <button onclick="updateCart('${t.name.replace(/'/g, "\\'")}', 1)" class="flex-1 py-2 hover:bg-black/20 transition-colors font-black text-lg">+</button>
                  </div>
                ` : `
                  <button onclick="updateCart('${t.name.replace(/'/g, "\\'")}', 1)" 
                    class="w-full bg-white text-black py-2.5 rounded-xl font-black text-[10px] shadow-2xl transition-all uppercase tracking-[0.2em] border-none hover:bg-orange-600 hover:text-white cursor-pointer transform active:scale-95">
                    ADD +
                  </button>
                `}
             </div>
          </div>
          <p class="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-2">Elite Selection</p>
        </div>

        <!-- Wishlist -->
        <button onclick="toggleFavorite('${t.name.replace(/'/g, "\\'")}')" 
          class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/5 text-white hover:border-orange-500/50 hover:scale-110 transition-all z-20">
          <i class="${isFav ? 'fa-solid text-orange-500 shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'fa-regular text-gray-400'} fa-heart"></i>
        </button>
      </div>
    `;

    targetGrid.innerHTML += card;
  });
}


function toggleFavorite(name) {
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
  const buttons = document.querySelectorAll('.pkg-tab-btn');
  buttons.forEach(btn => {
    if (btn.innerText.includes(type)) {
      btn.classList.add('active-filter');
      btn.classList.remove('inactive-filter');
    } else {
      btn.classList.remove('active-filter');
      btn.classList.add('inactive-filter');
    }
  });
  renderPackages(type);
}

function renderPackages(filterType = "Hostel") {
  const grid = document.getElementById("packageGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = allPackages.filter(p => p.type === filterType);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center text-gray-400 font-bold uppercase tracking-widest py-20">No packages found for ${filterType}</div>`;
    return;
  }

  filtered.forEach(pkg => {
    grid.innerHTML += `
      <div class="bg-[#111] border border-white/5 rounded-[3rem] p-12 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-orange-500/20 transition-all duration-700 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-orange-600/5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-125 opacity-40"></div>
        
        <div class="relative z-10">
          <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
             <i class="fa-solid fa-crown text-2xl text-orange-500 group-hover:text-white"></i>
          </div>
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 block">${pkg.type} Elite</span>
          <h3 class="text-3xl font-black text-white mb-3 group-hover:text-orange-500 transition-colors uppercase italic tracking-tighter leading-none">${pkg.name}</h3>
          <p class="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-10 leading-relaxed">${pkg.desc}</p>
          
          <div class="text-3xl font-black text-white mb-10 flex items-baseline gap-2 italic">
            ${pkg.price}
          </div>
          
          <ul class="space-y-5 mb-12 text-[11px] font-black text-gray-400 uppercase tracking-widest">
            ${pkg.features.map(f => `
              <li class="flex items-center gap-4">
                <div class="w-6 h-6 bg-white/5 text-orange-500 rounded-full flex items-center justify-center text-[10px] border border-white/5">
                  <i class="fa-solid fa-check"></i>
                </div>
                ${f}
              </li>
            `).join('')}
          </ul>

          <button onclick="openCorporateForm('${pkg.name} (${pkg.type})')" 
            class="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-orange-600/30 active:scale-[0.98] border-none cursor-pointer">
            Initialize Access <i class="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    `;
  });
}

// Initial Render
renderPackages("Hostel");
function openCorporateForm(packageName) {
  const pkgInput = document.getElementById("txtSelectedPackage");
  if (pkgInput) {
    pkgInput.value = packageName;
    pkgInput.classList.remove("text-gray-500");
    pkgInput.classList.add("text-orange-500", "font-black");
  }

  const form = document.getElementById("enquiryForm");
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const nameInput = document.getElementById("txtEnqName");
      if (nameInput) nameInput.focus();
    }, 800);
  }
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
      company: txtEnqComapny.value,
      package: document.getElementById("txtSelectedPackage") ? document.getElementById("txtSelectedPackage").value : "",
      guests: document.getElementById("numGuests") ? document.getElementById("numGuests").value : 0
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
  document.getElementById('ackGuests').innerText = details.guests || 0;

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


