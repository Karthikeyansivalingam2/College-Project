/* ===============================
   SEARCH PAGE LOGIC - ARUSUVAI
   =============================== */

var currentQuery = "";

/* ===============================
   UPDATE RESULT TITLE
   =============================== */
function updateResultTitle(text) {
  var title = document.getElementById("resultTitle");
  if (title) title.innerText = text;
}

/* ===============================
   TEA SHOPS / HOTELS DATA
   =============================== */
/* ===============================
   RESTAURANTS DATA
   =============================== */
var restaurants = [

  /* ================= ANTHIYUR ================= */
  {
    name: "Anthiyur Delights",
    location: "Anthiyur",
    cuisines: ["South Indian", "Chinese"],
    popular: ["Chicken Biryani", "Parotta"],
    specials: ["Grill Chicken", "Falooda"],
    map: "Anthiyur Delights Anthiyur"
  },
  {
    name: "Sri Murugan Mess",
    location: "Anthiyur",
    cuisines: ["South Indian"],
    popular: ["Meals", "Fish Curry"],
    specials: ["Mutton Chukka", "Kothu Parotta"],
    map: "Sri Murugan Mess Anthiyur"
  },

  /* ================= ERODE ================= */
  {
    name: "Spice Garden",
    location: "Erode",
    cuisines: ["North Indian", "Tandoori"],
    popular: ["Butter Chicken", "Naan"],
    specials: ["Paneer Tikka", "Lassi"],
    map: "Spice Garden Erode"
  },
  {
    name: "Kongu Kitchen",
    location: "Erode",
    cuisines: ["Chettinad", "Chinese"],
    popular: ["Chicken 65", "Fried Rice"],
    specials: ["Pichi Potta Kozhi", "Elaneer Payasam"],
    map: "Kongu Kitchen Erode"
  },

  /* ================= SALEM ================= */
  {
    name: "Salem Grand",
    location: "Salem",
    cuisines: ["Mutli-Cuisine", "Arabian"],
    popular: ["Shawarma", "Biryani"],
    specials: ["BBQ Chicken", "Mojito"],
    map: "Salem Grand Hotel"
  },
  {
    name: "New Bus Stand Restaurant",
    location: "Salem",
    cuisines: ["South Indian", "Fast Food"],
    popular: ["Idli/Dosa", "Noodles"],
    specials: ["Filter Coffee", "Rose Milk"],
    map: "New Bus Stand Restaurant Salem"
  },

  /* ================= CHENNAI ================= */
  {
    name: "Taste of Chennai",
    location: "Chennai",
    cuisines: ["South Indian", "Chettinad"],
    popular: ["Meals", "Biryani"],
    specials: ["Vanjaram Fry", "Crab Masala"],
    map: "Taste of Chennai"
  },
  {
    name: "Marina Sea Food",
    location: "Chennai",
    cuisines: ["Sea Food"],
    popular: ["Fish Fry", "Prawn Gravy"],
    specials: ["Nethili Fry", "Squid Roast"],
    map: "Marina Sea Food Chennai"
  },
  {
    name: "T Nagar Bistro",
    location: "Chennai",
    cuisines: ["Continental", "Italian"],
    popular: ["Pasta", "Pizza"],
    specials: ["Burgers", "Cold Coffee"],
    map: "T Nagar Bistro Chennai"
  },

  /* ================= MADURAI ================= */
  {
    name: "Madurai Jigarthanda Shop",
    location: "Madurai",
    cuisines: ["Desserts", "Beverages"],
    popular: ["Jigarthanda", "Basundi"],
    specials: ["Ice Cream", "Falooda"],
    map: "Madurai Famous Jigarthanda"
  },
  {
    name: "Meenakshi Bhawan",
    location: "Madurai",
    cuisines: ["South Indian", "Vegetarian"],
    popular: ["Idli", "Pongal"],
    specials: ["Filter Coffee", "Vada"],
    map: "Meenakshi Bhawan Madurai"
  },
  {
    name: "Temple City Restaurant",
    location: "Madurai",
    cuisines: ["Chettinad", "Chinese"],
    popular: ["Mutton Biryani", "Chicken Gravy"],
    specials: ["Pepper Chicken", "Parotta"],
    map: "Temple City Restaurant Madurai"
  },
  {
    name: "Koodal Nagar Food Court",
    location: "Madurai",
    cuisines: ["Multi-Cuisine"],
    popular: ["Fried Rice", "Noodles"],
    specials: ["Grill Chicken", "Juices"],
    map: "Koodal Nagar Food Court Madurai"
  }
];


/* ===============================
   SEARCH TYPE (LOCKED TO PLACE)
   =============================== */
function getSearchType() {
  return "PLACE";
}

/* ===============================
   FILTER RESULTS
   =============================== */
function filterResults(query) {
  query = query.replace(/\+/g, " ").trim().toLowerCase();
  currentQuery = query;

  var box = document.getElementById("results");
  var loader = document.getElementById("loader");

  if (loader) {
    loader.classList.remove("hidden");
    box.innerHTML = "";
    box.appendChild(loader);
  }

  setTimeout(function () {
    if (loader) loader.classList.add("hidden");

    history.pushState(
      { view: "LIST", query: query },
      "",
      window.location.pathname + "?q=" + encodeURIComponent(query)
    );

    updateResultTitle("Popular Spots in " + query.toUpperCase());
    showShopList(query);
  }, 500);
}

/* ===============================
   SHOW SHOP LIST (PLACE ONLY)
   =============================== */
function showShopList(query) {
  var box = document.getElementById("results");
  var homeBtn = document.getElementById("backToHome");

  if (homeBtn) homeBtn.style.display = "block";

  box.innerHTML = "";
  var found = false;

  query = query.trim().toLowerCase();

  for (var i = 0; i < restaurants.length; i++) {
    var shop = restaurants[i];

    if (shop.location.trim().toLowerCase() === query) {
      found = true;

      box.innerHTML +=
        '<div class="shop-card">' +
        '<div class="card-top">' +
        '<h3>' + shop.name.replace(/</g, "&lt;") + '</h3>' +
        '<span class="badge">Open Now</span>' +
        '</div>' +
        '<p class="card-location">📍 ' + shop.location + '</p>' +
        '<div class="card-tags">' +
        '<span>🍽️ Dine-in</span>' +
        '<span>🥡 Takeaway</span>' +
        '<span>🚴 Delivery</span>' +
        '</div>' +
        '<button class="details-btn" onclick="showShopDetails(\'' + shop.name + '\')">' +
        'View Details' +
        '</button>' +
        '</div>';
    }
  }

  if (!found) {
    box.innerHTML =
      '<div class="empty-state">' +
      '<h3>No spots found in ' + query.toUpperCase() + '</h3>' +
      '<button onclick="history.back()">← Go Back</button>' +
      '</div>';
  }
}


/* ===============================
   SHOW SHOP DETAILS
   =============================== */
function showShopDetails(name) {
  var box = document.getElementById("results");
  var homeBtn = document.getElementById("backToHome");

  if (homeBtn) homeBtn.style.display = "none";

  history.pushState(
    { view: "DETAIL", shop: name },
    "",
    window.location.pathname + "?shop=" + encodeURIComponent(name)
  );

  box.innerHTML = "";

  for (var i = 0; i < restaurants.length; i++) {
    var shop = restaurants[i];

    if (shop.name === name) {
      box.innerHTML =
        '<div class="results-header">' +
        '<button class="back-btn" onclick="history.back()">← Back</button>' +
        '</div>' +
        '<div class="shop-card detail-card">' +
        '<h2>' + shop.name + '</h2>' +
        '<p><b>Location:</b> ' + shop.location + '</p>' +
        '<div class="detail-group"><b>Cuisines:</b> ' + shop.cuisines.join(", ") + '</div>' +
        '<div class="detail-group"><b>Popular:</b> ' + shop.popular.join(", ") + '</div>' +
        '<div class="detail-group"><b>Specials:</b> ' + shop.specials.join(", ") + '</div>' +
        '<button class="direction-btn" onclick="openMap(\'' + shop.map + '\')">' +
        'Get Directions' +
        '</button>' +
        '</div>';
    }
  }
}

/* ===============================
   MAP
   =============================== */
function openMap(place) {
  window.open(
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(place),
    "_blank"
  );
}

/* ===============================
   AUTO LOAD FROM URL
   =============================== */
window.onload = function () {
  var q = new URLSearchParams(window.location.search).get("q");
  if (q) filterResults(q);
};

/* ===============================
   BACK BUTTON HANDLING
   =============================== */
window.onpopstate = function (event) {
  if (!event.state) {
    window.location.href = "index.html";
    return;
  }

  if (event.state.view === "LIST") {
    showShopList(event.state.query);
  }

  if (event.state.view === "DETAIL") {
    showShopDetails(event.state.shop);
  }
};

function goHome() {
  window.location.href = "index.html";
}