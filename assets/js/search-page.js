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
var teaShops = [

  /* ================= ANTHIYUR ================= */
  {
    name: "Anand Tea & Coffee Stall",
    location: "Anthiyur",
    teas: ["Strong Tea", "Masala Tea", "Ginger Tea"],
    coffees: ["Filter Coffee", "Milk Coffee"],
    snacks: ["Vada", "Biscuit", "Bun"],
    map: "Anand Tea & Coffee Stall Anthiyur"
  },
  {
    name: "Sri Murugan Tea Kadai",
    location: "Anthiyur",
    teas: ["Strong Tea", "Milk Tea"],
    coffees: ["Filter Coffee"],
    snacks: ["Samosa", "Vada", "Bajji"],
    map: "Sri Murugan Tea Kadai Anthiyur"
  },

  /* ================= ERODE ================= */
  {
    name: "Raja Tea Stall",
    location: "Erode",
    teas: ["Strong Tea", "Masala Tea", "Ginger Tea"],
    coffees: ["Filter Coffee", "Strong Coffee"],
    snacks: ["Samosa", "Vada", "Bajji"],
    map: "Raja Tea Stall Erode"
  },
  {
    name: "Kongu Tea & Coffee",
    location: "Erode",
    teas: ["Masala Tea", "Ginger Tea"],
    coffees: ["Milk Coffee", "Strong Coffee"],
    snacks: ["Vada", "Bajji", "Murukku"],
    map: "Kongu Tea & Coffee Erode"
  },

  /* ================= SALEM ================= */
  {
    name: "Salem Famous Tea Kadai",
    location: "Salem",
    teas: ["Strong Tea", "Masala Tea", "Ginger Tea"],
    coffees: ["Filter Coffee", "Milk Coffee"],
    snacks: ["Samosa", "Vada", "Bajji"],
    map: "Salem Famous Tea Kadai"
  },
  {
    name: "New Bus Stand Tea Shop",
    location: "Salem",
    teas: ["Milk Tea", "Lemon Tea"],
    coffees: ["Strong Coffee"],
    snacks: ["Bun", "Biscuit", "Cutlet"],
    map: "New Bus Stand Tea Shop Salem"
  },

  /* ================= CHENNAI ================= */
  {
    name: "Chennai Chai & Coffeewala",
    location: "Chennai",
    teas: ["Masala Tea", "Kashmiri Kahwa", "Milk Tea"],
    coffees: ["Filter Coffee", "Black Coffee", "Latte"],
    snacks: ["Samosa", "Bread Omelette", "Sandwich"],
    map: "Chennai Chai & Coffeewala"
  },
  {
    name: "Marina Beach Tea Stall",
    location: "Chennai",
    teas: ["Strong Tea", "Lemon Tea"],
    coffees: ["Cold Coffee", "Milk Coffee"],
    snacks: ["Sundal", "Bajji", "Murukku"],
    map: "Marina Beach Tea Stall Chennai"
  },
  {
    name: "T Nagar Chai Point",
    location: "Chennai",
    teas: ["Masala Tea", "Elaichi Tea"],
    coffees: ["Milk Coffee"],
    snacks: ["Cutlet", "Bun"],
    map: "T Nagar Chai Stall Chennai"
  },

  /* ================= MADURAI ================= */
  {
    name: "Madurai Famous Jigarthanda",
    location: "Madurai",
    teas: ["Strong Tea", "Lemon Tea"],
    coffees: ["Filter Coffee"],
    snacks: ["Jigarthanda", "Vada", "Bun"],
    map: "Madurai Famous Jigarthanda"
  },
  {
    name: "Meenakshi Tea Stall",
    location: "Madurai",
    teas: ["Masala Tea", "Ginger Tea"],
    coffees: ["Succu Coffee", "Filter Coffee"],
    snacks: ["Murukku", "Seedai"],
    map: "Meenakshi Tea Stall Madurai"
  },
  {
    name: "Temple City Chai",
    location: "Madurai",
    teas: ["Cardamom Tea", "Milk Tea"],
    coffees: ["Strong Coffee"],
    snacks: ["Halwa", "Samosa"],
    map: "Temple City Chai Madurai"
  },
  {
    name: "Koodal Nagar Tea Point",
    location: "Madurai",
    teas: ["Herbal Tea", "Green Tea"],
    coffees: ["Black Coffee"],
    snacks: ["Puff", "Biscuit"],
    map: "Koodal Nagar Tea Point Madurai"
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

  for (var i = 0; i < teaShops.length; i++) {
    var shop = teaShops[i];

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
        '<span>🍵 Tea</span>' +
        '<span>☕ Coffee</span>' +
        '<span>🥐 Snacks</span>' +
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

  for (var i = 0; i < teaShops.length; i++) {
    var shop = teaShops[i];

    if (shop.name === name) {
      box.innerHTML =
        '<div class="results-header">' +
        '<button class="back-btn" onclick="history.back()">← Back</button>' +
        '</div>' +
        '<div class="shop-card detail-card">' +
        '<h2>' + shop.name + '</h2>' +
        '<p><b>Location:</b> ' + shop.location + '</p>' +
        '<div class="detail-group"><b>Teas:</b> ' + shop.teas.join(", ") + '</div>' +
        '<div class="detail-group"><b>Coffees:</b> ' + shop.coffees.join(", ") + '</div>' +
        '<div class="detail-group"><b>Snacks:</b> ' + shop.snacks.join(", ") + '</div>' +
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