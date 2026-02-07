/* TOGGLE */
const retail = document.getElementById("retailSection")
const corporate = document.getElementById("monthlySection")
const rBtn = document.getElementById("retailBtn")
const cBtn = document.getElementById("packageBtn")

function toggleLocationModal() {
  document.getElementById('locationModal').classList.toggle('hidden');
}

function setLocation(loc) {
  document.getElementById('currentLoc').innerText = loc;
  localStorage.setItem('userLocation', loc);
  toggleLocationModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLoc = localStorage.getItem('userLocation');
  if (savedLoc) document.getElementById('currentLoc').innerText = savedLoc;
  renderMenu();
});
function switchMode(mode) {


  if (mode === "retail") {
    retail.classList.remove("hidden")
    corporate.classList.add("hidden")

    rBtn.classList.add("bg-amber-700", "text-white")
    rBtn.classList.remove("bg-gray-200")

    cBtn.classList.add("bg-gray-200")
    cBtn.classList.remove("bg-amber-700", "text-white")
  } else {
    corporate.classList.remove("hidden")
    retail.classList.add("hidden")

    cBtn.classList.add("bg-amber-700", "text-white")
    cBtn.classList.remove("bg-gray-200")

    rBtn.classList.add("bg-gray-200")
    rBtn.classList.remove("bg-amber-700", "text-white")

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
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartBar = document.getElementById("cartBar");

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

  document.getElementById("total").innerText = total;
  document.getElementById("cartTotal").innerText = total;
  document.getElementById("cartCount").innerText = count;

  // Show / hide cart bar
  if (count > 0) {
    cartBar.classList.remove("hidden");
    // Also re-render menu to update ADD buttons if needed
    renderMenu();
  } else {
    cartBar.classList.add("hidden");
    renderMenu();
  }
}

function openCart() {
  document.getElementById("cartDrawer").classList.remove("hidden");
  document.getElementById("btnTotal").innerText = document.getElementById("total").innerText;
}

function closeCart() {
  document.getElementById("cartDrawer").classList.add("hidden");
}

let selectedCategory = null;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function selectCategory(category) {
  selectedCategory = category;

  document.querySelectorAll(".typeBtn").forEach(btn => {
    btn.classList.remove("bg-amber-700", "text-white");
    btn.classList.add("bg-gray-200");
  });
  event.target.classList.remove("bg-gray-200");
  event.target.classList.add("bg-amber-700", "text-white");
  renderMenu();
}
let teaMenu = [];

async function fetchMenu() {
  try {
    const res = await fetch('/api/menu');
    teaMenu = await res.json();
    renderMenu();
  } catch (err) {
    console.error("Failed to fetch menu", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLoc = localStorage.getItem('userLocation');
  if (savedLoc) document.getElementById('currentLoc').innerText = savedLoc;
  fetchMenu();
});

function renderMenu() {
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

  const search = document.getElementById("searchTea") ? document.getElementById("searchTea").value.toLowerCase() : "";

  // Filter by category, search AND active status
  const filtered = teaMenu.filter(t =>
    t.active !== false &&
    (!selectedCategory || t.category === selectedCategory) &&
    t.name.toLowerCase().includes(search)
  );

  // Hide all sections initially
  [beverageSection, breakfastSection, lunchSection, dinnerSection, fastFoodSection, dietSection].forEach(s => {
    if (s) s.classList.add('hidden');
  });

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
      // Default to Fast Food / Snacks for everything else
      targetGrid = fastFoodGrid;
      targetSection = fastFoodSection;
    }

    if (!targetGrid) return;
    if (targetSection) targetSection.classList.remove('hidden');

    const card = `
      <div class="bg-white p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition group">
        <div class="flex-1 pr-4">
          <div class="flex items-center gap-2 mb-1">
             <i class="fa-regular fa-square-caret-up text-[10px] ${t.category === 'Diet' ? 'text-green-500' : 'text-red-500'}"></i>
             ${t.bestseller ? `<span class="text-[10px] font-bold text-orange-500 uppercase tracking-tighter"><i class="fa-solid fa-star text-[10px]"></i> Bestseller</span>` : ""}
          </div>
          <h3 class="font-bold text-gray-800 text-base md:text-lg mb-0.5">${t.name}</h3>
          <p class="font-bold text-gray-700 text-sm mb-2">₹${t.price}</p>
          <div class="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
             <span class="flex items-center gap-1 text-green-600"><i class="fa-solid fa-star"></i> 4.2</span>
             <span>•</span>
             <span>${t.category}</span>
          </div>
        </div>

        <div class="relative w-28 h-24 md:w-32 md:h-28">
          <img src="${t.image}" class="w-full h-full object-cover rounded-xl shadow-sm group-hover:shadow-md transition">
          
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%]">
            ${cartItem.qty > 0 ? `
              <div class="bg-white border text-green-600 font-bold px-2 py-1.5 rounded-lg shadow-lg flex justify-between items-center text-sm border-gray-200">
                <button onclick="updateQty('${t.name}',${t.price},-1)" class="px-2 hover:bg-gray-100 rounded">−</button>
                <span>${cartItem.qty}</span>
                <button onclick="updateQty('${t.name}',${t.price},1)" class="px-2 hover:bg-gray-100 rounded">+</button>
              </div>
            ` : `
              <button onclick="updateQty('${t.name}',${t.price},1)" 
                class="w-full bg-white border border-gray-200 text-green-600 font-bold py-1.5 rounded-lg shadow-lg hover:bg-gray-50 transition uppercase text-xs tracking-wider">
                Add
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
      <div class="bg-gray-50 border rounded-lg p-6 hover:shadow-lg transition">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-500">${pkg.type} Plan</span>
        <h3 class="text-xl font-bold mt-1 text-gray-800">${pkg.name}</h3>
        <p class="text-sm text-gray-600 mb-4">${pkg.desc}</p>
        
        <div class="text-2xl font-bold text-amber-700 mb-4">${pkg.price}</div>
        
        <ul class="space-y-2 mb-6 text-sm text-gray-700">
          ${pkg.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
        </ul>

        <button onclick="openCorporateForm('${pkg.name} (${pkg.type})')" 
          class="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white rounded font-medium transition">
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
    pkgInput.classList.add("text-amber-700", "font-bold");
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

