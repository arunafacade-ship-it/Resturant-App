const menuItems = [
  {
    id: 1,
    name: 'Herb-Crusted Salmon',
    description: 'Pan-seared salmon with lemon beurre blanc, served with garlic asparagus.',
    price: 18.95,
    category: 'Mains',
    calories: 620,
    rating: 4.9,
    badge: 'Chef’s Pick',
    icon: '🐟',
    image: 'assets/images/herb-crusted-salmon.svg'
  },
  {
    id: 2,
    name: 'Roasted Beet Salad',
    description: 'Baby arugula, whipped goat cheese, candied pecans and citrus vinaigrette.',
    price: 11.5,
    category: 'Starters',
    calories: 280,
    rating: 4.7,
    icon: '🥗',
    image: 'assets/images/roasted-beet-salad.svg'
  },
  {
    id: 3,
    name: 'Truffle Mushroom Soup',
    description: 'Creamy wild mushroom soup with parmesan crisp and truffle oil.',
    price: 9.75,
    category: 'Starters',
    calories: 310,
    rating: 4.8,
    icon: '🍄',
    image: 'assets/images/truffle-mushroom-soup.svg'
  },
  {
    id: 4,
    name: 'Wood-Fired Pizza',
    description: 'Rustic crust topped with mozzarella, cherry tomatoes, basil and chili honey.',
    price: 14.5,
    category: 'Mains',
    calories: 930,
    rating: 4.9,
    badge: 'Popular',
    icon: '🍕',
    image: 'assets/images/wood-fired-pizza.svg'
  },
  {
    id: 5,
    name: 'Salted Caramel Crème Brûlée',
    description: 'Velvety vanilla custard with a crisp caramelized sugar topping.',
    price: 7.25,
    category: 'Desserts',
    calories: 410,
    rating: 4.8,
    icon: '🍮',
    image: 'assets/images/salted-caramel-creme-brulee.svg'
  },
  {
    id: 6,
    name: 'Sparkling Lemonade',
    description: 'Fresh citrus with mint and a touch of sweetness.',
    price: 4.95,
    category: 'Drinks',
    calories: 140,
    rating: 4.6,
    icon: '🍋',
    image: 'assets/images/sparkling-lemonade.svg'
  },
  {
    id: 7,
    name: 'Shrimp Ceviche',
    description: 'Citrus-marinated shrimp with avocado, tomato and crisp plantain chips.',
    price: 12.25,
    category: 'Starters',
    calories: 260,
    rating: 4.9,
    icon: '🍤',
    image: 'assets/images/shrimp-ceviche.svg'
  },
  {
    id: 8,
    name: 'Berry Cheesecake',
    description: 'Creamy cheesecake with a graham crust and berry compote.',
    price: 7.95,
    category: 'Desserts',
    calories: 520,
    rating: 4.7,
    icon: '🍰',
    image: 'assets/images/berry-cheesecake.svg'
  },
  {
    id: 9,
    name: 'Matcha Latte',
    description: 'Silky steamed milk with premium matcha powder and a hint of honey.',
    price: 5.25,
    category: 'Drinks',
    calories: 180,
    rating: 4.8,
    icon: '🍵',
    image: 'assets/images/matcha-latte.svg'
  }
];

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
const menuGrid = document.getElementById('menuGrid');
const filterContainer = document.getElementById('categoryFilters');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutButton = document.getElementById('checkoutButton');
const notesInput = document.getElementById('orderNotes');

const cart = new Map();
const TAX_RATE = 0.08;
let activeCategory = 'All';

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function getRatingStars(rating) {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

function renderFilters() {
  filterContainer.innerHTML = '';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-pill' + (category === activeCategory ? ' active' : '');
    button.textContent = category;
    button.type = 'button';
    button.addEventListener('click', () => {
      activeCategory = category;
      renderFilters();
      renderMenu();
    });
    filterContainer.appendChild(button);
  });
}

function renderMenu() {
  menuGrid.innerHTML = '';
  const itemsToShow = menuItems.filter(item => activeCategory === 'All' || item.category === activeCategory);

  itemsToShow.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card__image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="menu-card__content">
        <div class="menu-card__header">
          <div>
            <h3>${item.name}</h3>
            <div class="menu-card__tags">
              <span class="badge-light">${item.category}</span>
              ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
            </div>
          </div>
          <div class="menu-card__rating">${getRatingStars(item.rating)}</div>
        </div>
        <p class="menu-card__description">${item.description}</p>
        <div class="menu-card__details">
          <span>${item.calories} cal</span>
          <span>${item.rating.toFixed(1)} / 5.0</span>
        </div>
        <div class="menu-card__footer">
          <div class="price">${formatCurrency(item.price)}</div>
          <button type="button" data-id="${item.id}">Add to Order</button>
        </div>
      </div>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => addToCart(item.id));
    menuGrid.appendChild(card);
  });

  if (itemsToShow.length === 0) {
    menuGrid.innerHTML = '<p class="empty-state">No dishes found for this category.</p>';
  }
}

function addToCart(itemId) {
  const item = menuItems.find(menu => menu.id === itemId);
  if (!item) return;

  const existing = cart.get(itemId) || { ...item, quantity: 0 };
  existing.quantity += 1;
  cart.set(itemId, existing);
  updateCart();
}

function changeQuantity(itemId, delta) {
  const existing = cart.get(itemId);
  if (!existing) return;

  existing.quantity += delta;
  if (existing.quantity < 1) {
    cart.delete(itemId);
  } else {
    cart.set(itemId, existing);
  }
  updateCart();
}

function removeFromCart(itemId) {
  cart.delete(itemId);
  updateCart();
}

function updateCart() {
  cartItemsEl.innerHTML = '';
  let subtotal = 0;

  if (cart.size === 0) {
    cartItemsEl.innerHTML = '<p class="empty-state">Your cart is empty. Add a dish from the menu to begin.</p>';
    checkoutButton.disabled = true;
    updateTotals(0);
    return;
  }

  cart.forEach(item => {
    subtotal += item.price * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="item-meta">
        <span>${item.name} ×${item.quantity}</span>
        <small>${formatCurrency(item.price)} each</small>
      </div>
      <div class="cart-row-actions">
        <div class="quantity-control">
          <button type="button" data-action="decrease" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" type="button" data-id="${item.id}">Remove</button>
      </div>
    `;

    row.querySelector('[data-action="decrease"]').addEventListener('click', () => changeQuantity(item.id, -1));
    row.querySelector('[data-action="increase"]').addEventListener('click', () => changeQuantity(item.id, 1));
    row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));

    cartItemsEl.appendChild(row);
  });

  checkoutButton.disabled = false;
  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);
}

checkoutButton.addEventListener('click', () => {
  if (cart.size === 0) return;

  const orderType = document.querySelector('input[name="orderType"]:checked').value;
  const notes = notesInput.value.trim();
  const noteMessage = notes ? `\n\nSpecial requests:\n${notes}` : '';

  alert(`Thank you for your ${orderType} order!\n\nWe will prepare your meal shortly.${noteMessage}`);
  cart.clear();
  notesInput.value = '';
  updateCart();
});

renderFilters();
renderMenu();
