let nav = document.querySelector(".btn-background");
let sideNavbar = document.querySelector(".side-navbar");
let navBtn = document.querySelector(".btn-close");

nav.addEventListener("click", function (e) {
  sideNavbar.style.transform = `translateX(${0}%)`;
  sideNavbar.style.display = "unset";
  navBtn.classList.toggle("nav-anim");

  if (!navBtn.classList.contains("nav-anim")) {
    sideNavbar.style.transform = `translateX(-${100}%)`;
  }
});
