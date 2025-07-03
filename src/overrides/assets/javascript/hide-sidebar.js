document.addEventListener("DOMContentLoaded", function () {
  // Check if sidebar is essentially empty
  const nav = document.querySelector("nav.md-nav");
  if (!nav || nav.children.length <= 1) {
    document.body.classList.add("hide-sidebar");
  }
});
