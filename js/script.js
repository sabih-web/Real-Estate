// EstateVista interactions: search, filters, sorting, saved properties and mobile navigation.
const searchForm = document.querySelector("#property-search");
const locationInput = document.querySelector("#location-search");
const typeFilter = document.querySelector("#type-filter");
const priceFilter = document.querySelector("#price-filter");
const sortFilter = document.querySelector("#sort-filter");
const propertyGrid = document.querySelector("#property-grid");
const resultCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const resetButton = document.querySelector("#reset-search");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const cards = Array.from(document.querySelectorAll(".property-card"));

function updateProperties() {
  const query = locationInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const maxPrice = priceFilter.value === "all" ? Infinity : Number(priceFilter.value);
  let visibleCards = [];

  cards.forEach((card) => {
    const matchesQuery = `${card.dataset.location} ${card.querySelector("h3").textContent} ${card.querySelector(".property-description").textContent}`.toLowerCase().includes(query);
    const matchesType = type === "all" || card.dataset.type === type;
    const matchesPrice = Number(card.dataset.price) <= maxPrice;
    const visible = matchesQuery && matchesType && matchesPrice;
    card.hidden = !visible;
    if (visible) visibleCards.push(card);
  });

  if (sortFilter.value === "low-high") {
    visibleCards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (sortFilter.value === "high-low") {
    visibleCards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  }

  visibleCards.forEach((card) => propertyGrid.appendChild(card));
  resultCount.textContent = `Showing ${visibleCards.length} ${visibleCards.length === 1 ? "property" : "properties"}`;
  emptyState.hidden = visibleCards.length !== 0;
  propertyGrid.hidden = visibleCards.length === 0;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateProperties();
  document.querySelector("#properties").scrollIntoView({ behavior: "smooth", block: "start" });
});

[typeFilter, priceFilter, sortFilter].forEach((control) => {
  control.addEventListener("change", updateProperties);
});
locationInput.addEventListener("input", updateProperties);

resetButton.addEventListener("click", () => {
  locationInput.value = "";
  typeFilter.value = "all";
  priceFilter.value = "all";
  sortFilter.value = "featured";
  updateProperties();
});

document.querySelectorAll(".favorite").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isSaved));
    button.textContent = isSaved ? "♡" : "♥";
    const propertyName = button.closest(".property-card").querySelector("h3").textContent;
    button.setAttribute("aria-label", `${isSaved ? "Save" : "Remove"} ${propertyName}`);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
updateProperties();
