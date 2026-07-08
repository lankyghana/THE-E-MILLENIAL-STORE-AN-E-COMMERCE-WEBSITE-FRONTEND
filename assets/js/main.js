function renderProductGrid() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(
    (product) => `
      <li class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-card__img" />
        <h3 class="product-card__name">${product.name.toUpperCase()}</h3>
        <p class="product-card__price">${formatMoney(product.price)}</p>
        <button type="button" class="btn btn--primary" data-action="add-to-cart" data-id="${product.id}">
          ADD TO CART
        </button>
      </li>
    `
  ).join("");
}

function openCartDrawer() {
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("cart-overlay")?.classList.add("open");
}

function closeCartDrawer() {
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("open");
}

function initShopGridEvents() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;
  grid.addEventListener("click", (event) => {
    const btn = event.target.closest('button[data-action="add-to-cart"]');
    if (!btn) return;
    addToCart(btn.dataset.id);
    openCartDrawer();
  });
}

function initDrawerToggleEvents() {
  document.getElementById("cart-toggle")?.addEventListener("click", openCartDrawer);
  document.getElementById("cart-close")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCartDrawer);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductGrid();
  initShopGridEvents();
  initDrawerToggleEvents();
  initCartDrawerEvents();
  initCheckoutEvents();
  renderCart();
});
