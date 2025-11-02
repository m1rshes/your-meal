const cartIcon = document.querySelector('.cart-icon');
const cartPopup = document.querySelector('.cart-popup');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.querySelector('.checkout-modal');
const form = document.getElementById('checkout-form');
const successMessage = document.querySelector('.success-message');
const cartItemsInput = document.getElementById('cart-items-input');

let cart = [];

cartIcon.addEventListener('click', () => {
  cartPopup.classList.toggle('active');
});

document.querySelectorAll('.add').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.burger, .snack, .hot-dog');
    const title = card.querySelector('h3').textContent;
    const price = parseInt(card.querySelector('h2').textContent);
    const imgSrc = card.querySelector('img').src;

    const existing = cart.find(item => item.title === title);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ title, price, imgSrc, quantity: 1 });
    }

    updateCart();
    alert('Товар добавлен в корзину!');
  });
});

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.imgSrc}" alt="">
      <div class="cart-item-info">
        <div>${item.title}</div>
        <div>${item.price}₽</div>
      </div>
      <div class="quantity">
        <button class="minus">-</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
      </div>
    `;

    div.querySelector('.minus').addEventListener('click', () => {
      item.quantity--;
      if (item.quantity <= 0) cart.splice(index, 1);
      updateCart();
    });

    div.querySelector('.plus').addEventListener('click', () => {
      item.quantity++;
      updateCart();
    });

    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `${total}₽`;
}

checkoutBtn.addEventListener('click', () => {
  checkoutModal.classList.add('active');
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const cartText = cart.map(item =>
    `${item.title} — ${item.price}₽ × ${item.quantity} шт.`
  ).join('\n');

  cartItemsInput.value = cartText;

  const data = new FormData(form);
  const response = await fetch(form.action, {
    method: form.method,
    body: data
  });

  if (response.ok) {
    form.style.display = 'none';
    successMessage.style.display = 'block';
    cart = [];
    updateCart();

    setTimeout(() => {
      checkoutModal.classList.remove('active');
      form.style.display = 'block';
      successMessage.style.display = 'none';
      form.reset();
    }, 3000);
  } else {
    alert('Ошибка при отправке заказа. Попробуйте позже.');
  }
});

checkoutModal.addEventListener('click', e => {
  if (e.target === checkoutModal) checkoutModal.classList.remove('active');
});
