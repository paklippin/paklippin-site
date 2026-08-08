const products = [
    { id: 1, name: 'Wireless Headphones', price: 4999, oldPrice: 7999, rating: 4.8, icon: 'fa-headphones', category: 'Electronics' },
    { id: 2, name: 'Smartphone 5G', price: 45999, oldPrice: 59999, rating: 4.9, icon: 'fa-mobile-alt', category: 'Electronics' },
    { id: 3, name: 'Casual Shirt', price: 1299, oldPrice: 2499, rating: 4.3, icon: 'fa-tshirt', category: 'Fashion' },
    { id: 4, name: 'Smart Watch', price: 8999, oldPrice: 14999, rating: 4.6, icon: 'fa-clock', category: 'Electronics' },
    { id: 5, name: 'LED Desk Lamp', price: 1599, oldPrice: 2999, rating: 4.2, icon: 'fa-lightbulb', category: 'Home' },
    { id: 6, name: 'Running Shoes', price: 3999, oldPrice: 6999, rating: 4.7, icon: 'fa-shoe-prints', category: 'Sports' },
];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image"><i class="fas ${p.icon}"></i></div>
            <h4>${p.name}</h4>
            <div><span class="price">₨${p.price.toLocaleString()}</span> <span class="old-price">₨${p.oldPrice.toLocaleString()}</span></div>
            <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = document.getElementById('cartCount');
    if (count) count.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    const grid = document.getElementById('productGrid');
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image"><i class="fas ${p.icon}"></i></div>
            <h4>${p.name}</h4>
            <div><span class="price">₨${p.price.toLocaleString()}</span> <span class="old-price">₨${p.oldPrice.toLocaleString()}</span></div>
            <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
    `).join('');
}

function filterCategory(category) {
    const filtered = products.filter(p => p.category === category);
    const grid = document.getElementById('productGrid');
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image"><i class="fas ${p.icon}"></i></div>
            <h4>${p.name}</h4>
            <div><span class="price">₨${p.price.toLocaleString()}</span> <span class="old-price">₨${p.oldPrice.toLocaleString()}</span></div>
            <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
    `).join('');
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

function showAllProducts() {
    renderProducts();
}

function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}


