// === ТОВАРЫ ===
const products = [
  { id: 1, name: 'Альпийский воздух', price: 1500, desc: 'Свежесть гор, 1 литр' },
  { id: 2, name: 'Морской воздух', price: 1200, desc: 'Солёный бриз, 1 литр' },
  { id: 3, name: 'Лесной воздух', price: 1000, desc: 'Хвойный аромат, 1 литр' },
  { id: 4, name: 'Городской воздух', price: 500, desc: 'Ощущение мегаполиса, 0.5 л' },
];

// === КОРЗИНА ===
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function renderProducts() {
  const box = document.getElementById('products');
  box.innerHTML = products.map(p => `
    <div class="product">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${p.price} ₽</div>
      <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  renderCart();
  document.getElementById('cart').classList.add('open');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const box = document.getElementById('cartItems');
  if (cart.length === 0) {
    box.innerHTML = '<p>Корзина пуста</p>';
    document.getElementById('cartTotal').textContent = '0';
    return;
  }
  box.innerHTML = cart.map(i => `
    <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <span>${i.name} × ${i.qty}</span>
      <span>
        ${i.price * i.qty} ₽
        <button onclick="removeFromCart(${i.id})" style="margin-left:8px;border:none;background:none;cursor:pointer;color:#c53030;">✕</button>
      </span>
    </div>
  `).join('');
  document.getElementById('cartTotal').textContent = cart.reduce((s, i) => s + i.price * i.qty, 0);
}

// открытие/закрытие корзины
document.getElementById('cartBtn').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('cart').classList.add('open');
});
document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cart').classList.remove('open');
});

// === ФОРМА ЗАЯВКИ ===
// ВАЖНО: сюда вставим URL из Google Apps Script (Шаг 5)
const SCRIPT_URL = 'https://sheetdb.io/api/v1/el2iqm2pwp0nr';

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  const data = {
    name: form.name.value,
    phone: form.phone.value,
    comment: form.comment.value,
    products: cart.map(i => `${i.name} x${i.qty}`).join(', '),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
  };
  status.textContent = 'Отправляем...';
 try {
  await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: [data] }) // SheetDB требует именно такой формат
  });
  status.textContent = '✅ Заявка отправлена! Мы свяжемся с вами.';
  form.reset();
  cart = [];
  saveCart();
  renderCart();
} catch (err) {
  status.textContent = '❌ Ошибка. Попробуйте ещё раз.';
  console.error(err);
}
});

// «Оформить заказ» = прокрутить к форме
document.getElementById('checkoutBtn').addEventListener('click', () => {
  document.getElementById('cart').classList.remove('open');
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});

// === ИНИЦИАЛИЗАЦИЯ ===
renderProducts();
renderCart();
saveCart();