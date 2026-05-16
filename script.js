let cart = [];
let currentProduct = null;

// Элементы модалок
const cartModal = document.getElementById('cartModal');
const productModal = document.getElementById('productModal');
const orderModal = document.getElementById('orderModal');

// Контент модалки товара
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalSpecs = document.getElementById('modalSpecs');

// Обновление UI корзины с группировкой
function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const totalEl = document.getElementById('cartTotal');
    const countEl = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    list.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        totalEl.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        totalEl.style.display = 'block';
        checkoutBtn.style.display = 'block';

        cart.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'cart-item';

            const info = document.createElement('div');
            const title = document.createElement('h4');
            title.textContent = item.name;

            const qtySpan = document.createElement('span');
            qtySpan.className = 'cart-item-qty';
            qtySpan.textContent = ' x' + item.quantity;
            title.appendChild(qtySpan);

            const price = document.createElement('p');
            price.textContent = (item.price * item.quantity).toLocaleString() + ' ₽';

            info.appendChild(title);
            info.appendChild(price);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item-btn';
            removeBtn.textContent = 'Удалить';
            // Безопасное назначение события удаления
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                updateCartUI();
            });

            el.appendChild(info);
            el.appendChild(removeBtn);
            list.appendChild(el);

            total += (item.price * item.quantity);
            totalCount += item.quantity;
        });
    }
    totalEl.textContent = 'Итоговое вложение: ' + total.toLocaleString() + ' ₽';
    countEl.textContent = totalCount;
}

// Функция добавления в корзину
function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
}

// Глобальный слушатель кликов
document.addEventListener('click', (e) => {
    // Добавление в корзину напрямую из сетки
    if (e.target.classList.contains('buy-btn')) {
        const card = e.target.closest('.product-card');
        if (card) {
            addToCart(card.dataset.id, card.dataset.name, parseInt(card.dataset.price));
        }
    }

    // Открытие карточки товара (Описание)
    if (e.target.classList.contains('desc-btn')) {
        const card = e.target.closest('.product-card');
        if (card) {
            currentProduct = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                desc: card.dataset.desc,
                specs: card.dataset.specs
            };

            modalTitle.textContent = currentProduct.name;
            modalPrice.textContent = currentProduct.price.toLocaleString() + ' ₽';
            modalDesc.textContent = currentProduct.desc;
            modalSpecs.textContent = currentProduct.specs;

            productModal.style.display = 'block';
        }
    }
});
// Кнопка добавления из модалки товара
document.getElementById('modalAddToCart').addEventListener('click', () => {
    if (currentProduct) {
        addToCart(currentProduct.id, currentProduct.name, currentProduct.price);
        productModal.style.display = 'none';
    }
});

// Управление фильтрами
const toggleFilterBtn = document.getElementById('toggleFilterBtn');
if (toggleFilterBtn) {
    toggleFilterBtn.addEventListener('click', () => {
        const panel = document.getElementById('filterPanel');
        panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    });
}

const applyFiltersBtn = document.getElementById('applyFilters');
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
        const cat = document.getElementById('catFilter').value;
        const mat = document.getElementById('matFilter').value;

        document.querySelectorAll('.product-card').forEach(card => {
            const cMatch = (cat === 'all' || card.dataset.cat === cat);
            const mMatch = (mat === 'all' || card.dataset.mat === mat);
            card.style.display = (cMatch && mMatch) ? 'block' : 'none';
        });
    });
}

// Навигация и закрытие модалок
document.getElementById('openCartBtn').onclick = () => cartModal.style.display = 'block';

document.querySelectorAll('.close-modal, .close-product-modal, .close-order-modal, .back-to-shop').forEach(btn => {
    btn.onclick = () => {
        cartModal.style.display = 'none';
        productModal.style.display = 'none';
        orderModal.style.display = 'none';
    };
});

document.getElementById('checkoutBtn').onclick = () => {
    cartModal.style.display = 'none';
    orderModal.style.display = 'block';
};

window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};

// Финализация заказа
document.getElementById('orderForm').onsubmit = (e) => {
    e.preventDefault();
    alert('Благодарим за выбор LOFT Premium. Наш эксперт свяжется с вами для подтверждения деталей вашего заказа.');
    cart = [];
    updateCartUI();
    orderModal.style.display = 'none';
    e.target.reset();
};