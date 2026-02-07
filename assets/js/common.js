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


