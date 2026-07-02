const CART_STORAGE_KEY = "ems_cart";

function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQty(id, qty) {
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (!line) return;
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  line.qty = qty;
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  renderCart();
}

function getCartLines() {
  return getCart()
    .map((item) => {
      const product = findProduct(item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.price * line.qty, 0);
}

function getCartItemCount() {
  // Number of distinct products in the cart, not the summed quantity.
  return getCart().length;
}

function formatMoney(amount) {
  return `${CURRENCY} ${amount.toFixed(2)}`;
}

function renderCart() {
  renderCartBadge();
  renderCartDrawer();
}

function renderCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = getCartItemCount();
}

function renderCartDrawer() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const emptyEl = document.getElementById("cart-empty");
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!list) return;

  const lines = getCartLines();
  list.innerHTML = "";

  if (lines.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    if (emptyEl) emptyEl.hidden = true;
    if (checkoutBtn) checkoutBtn.disabled = false;
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <img src="${line.image}" alt="${line.name}" class="cart-item__img" />
        <div class="cart-item__info">
          <p class="cart-item__name">${line.name}</p>
          <p class="cart-item__price">${formatMoney(line.price)}</p>
          <div class="cart-item__qty">
            <button type="button" class="qty-btn" data-action="decrease" data-id="${line.id}">-</button>
            <span>${line.qty}</span>
            <button type="button" class="qty-btn" data-action="increase" data-id="${line.id}">+</button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove" data-id="${line.id}" aria-label="Remove ${line.name}">&times;</button>
      `;
      list.appendChild(li);
    });
  }

  if (totalEl) totalEl.textContent = formatMoney(getCartTotal());
}

function initCartDrawerEvents() {
  const list = document.getElementById("cart-items");
  if (!list) return;

  list.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const current = getCart().find((item) => item.id === id);
    if (!current) return;

    if (action === "increase") updateQty(id, current.qty + 1);
    if (action === "decrease") updateQty(id, current.qty - 1);
    if (action === "remove") removeFromCart(id);
  });
}
