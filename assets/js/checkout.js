function showCartConfirmation(name, lines, total) {
  const drawerBody = document.getElementById("cart-body");
  const confirmation = document.getElementById("cart-confirmation");
  const message = document.getElementById("confirmation-message");
  const summaryList = document.getElementById("order-summary-items");
  const summaryTotal = document.getElementById("order-summary-total");

  if (message) message.textContent = `Payment successful, thank you ${name}!`;
  if (summaryList) {
    summaryList.innerHTML = lines
      .map(
        (line) => `
          <li class="order-summary__item">
            <span>${line.name} &times; ${line.qty}</span>
            <span>${formatMoney(line.price * line.qty)}</span>
          </li>
        `
      )
      .join("");
  }
  if (summaryTotal) summaryTotal.textContent = formatMoney(total);

  if (drawerBody) drawerBody.hidden = true;
  if (confirmation) confirmation.hidden = false;
}

function resetCartView() {
  const drawerBody = document.getElementById("cart-body");
  const confirmation = document.getElementById("cart-confirmation");
  if (drawerBody) drawerBody.hidden = false;
  if (confirmation) confirmation.hidden = true;
}

function validateCheckoutForm() {
  const nameInput = document.getElementById("checkout-name");
  const nameError = document.getElementById("checkout-name-error");
  const emailInput = document.getElementById("checkout-email");
  const emailError = document.getElementById("checkout-email-error");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (!name) {
    if (nameError) nameError.hidden = false;
    valid = false;
  } else if (nameError) {
    nameError.hidden = true;
  }

  if (!emailPattern.test(email)) {
    if (emailError) emailError.hidden = false;
    valid = false;
  } else if (emailError) {
    emailError.hidden = true;
  }

  if (!valid) {
    (name ? emailInput : nameInput)?.focus();
  }

  return valid ? { name, email } : null;
}

function startPaystackCheckout() {
  if (getCartItemCount() === 0) return;

  const details = validateCheckoutForm();
  if (!details) return;

  const lines = getCartLines();
  const total = getCartTotal();

  if (typeof PaystackPop === "undefined") {
    alert("Paystack could not load. Check your internet connection and try again.");
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: details.email,
    amount: Math.round(total * 100),
    currency: CURRENCY,
    ref: `ems_${Date.now()}`,
    metadata: {
      custom_fields: [{ display_name: "Customer Name", variable_name: "customer_name", value: details.name }],
    },
    callback: function () {
      clearCart();
      showCartConfirmation(details.name, lines, total);
    },
    onClose: function () {},
  });
  handler.openIframe();
}

function initCheckoutEvents() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const continueBtn = document.getElementById("cart-continue-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", startPaystackCheckout);
  if (continueBtn) continueBtn.addEventListener("click", resetCartView);
}
