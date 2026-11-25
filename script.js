/* ==========================================================
   Cristina Nails: script.js
   ========================================================== */

// Numărul de WhatsApp, fără + și fără spații
const WHATSAPP_NUMBER = "37362125005";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const form = document.getElementById("bookingForm");
  const formError = document.getElementById("formError");

  // Anul curent în footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Umbră sub header după scroll
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Meniu mobil
  const setMenu = (open) => {
    mainNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Închide meniul" : "Deschide meniul");
  };
  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Formular: deschide WhatsApp cu mesajul completat
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.name.value.trim();
    if (!name) {
      formError.hidden = false;
      form.elements.name.focus();
      return;
    }
    formError.hidden = true;

    const service = form.elements.service.value;
    const shape = form.elements.shape.value;
    const message = form.elements.message.value.trim();

    const lines = [
      "Bună, sunt " + name + ".",
      "Mă interesează: " + service + ".",
      "Forma dorită: " + shape + ".",
    ];
    if (message) lines.push("Model / idei: " + message);

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  // ----- Galerie: filtre -----
  const filterButtons = document.querySelectorAll(".g-filter");
  const galleryItems = Array.from(document.querySelectorAll(".g-item"));

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      galleryItems.forEach((item) => {
        item.hidden = !(filter === "all" || item.dataset.cat === filter);
      });
    });
  });

  // ----- Galerie: lightbox -----
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  let current = 0;
  let lastFocus = null;

  const visibleItems = () => galleryItems.filter((item) => !item.hidden);

  function showItem(index) {
    const items = visibleItems();
    if (!items.length) return;
    current = (index + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = "";
    const title = document.createElement("strong");
    title.textContent = item.querySelector("h3").textContent;
    const desc = document.createElement("span");
    desc.textContent = item.querySelector("p").textContent;
    lbCaption.append(title, desc);
  }

  function openLightbox(item) {
    lastFocus = document.activeElement;
    showItem(visibleItems().indexOf(item));
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  galleryItems.forEach((item) => {
    item.querySelector(".g-open").addEventListener("click", () => openLightbox(item));
  });

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", () => showItem(current - 1));
  document.getElementById("lbNext").addEventListener("click", () => showItem(current + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showItem(current - 1);
    if (e.key === "ArrowRight") showItem(current + 1);
  });
});
