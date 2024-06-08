document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.getElementById('cartCount');
    const cartItemsSummary = document.getElementById('cartItemsSummary');
    const cartTotal = document.getElementById('cartTotal');
    const notification = document.getElementById('notification');
    const emptyCartButton = document.getElementById('emptyCartButton');
    const discountCodeInput = document.getElementById('discountCodeInput');
    const applyDiscountButton = document.getElementById('applyDiscountButton');
    const checkoutButton = document.getElementById('checkoutButton');

    let cart = [];
    let discount = 0;

    function updateCart() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemsSummary.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsSummary.innerHTML = '<li class="list-group-item">Your cart is empty.</li>';
            cartTotal.textContent = 'Total: $0.00 USD';
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div class="cart-item">
                        <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                            <input type="number" class="item-quantity" value="${item.quantity}" min="1">
                        </div>
                        <div class="cart-item-total">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button class="btn btn-danger btn-sm remove-from-cart">Remove</button>
                    </div>
                `;
                const quantityInput = li.querySelector('.item-quantity');
                const removeButton = li.querySelector('.remove-from-cart');
                quantityInput.addEventListener('change', () => {
                    item.quantity = parseInt(quantityInput.value);
                    updateCart();
                    saveCart();
                    showNotification('Item quantity updated');
                });
                removeButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to remove this item from the cart?')) {
                        cart = cart.filter(cartItem => cartItem !== item);
                        updateCart();
                        saveCart();
                        showUndoNotification(item);
                    }
                });
                cartItemsSummary.appendChild(li);

                total += item.price * item.quantity;
            });
            const salesTax = total * 0.08;
            const totalWithTax = total + salesTax;
            cartTotal.textContent = `Total: $${(totalWithTax * (1 - discount)).toFixed(2)} USD`;
        }
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('discount', discount);
    }

    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        const savedDiscount = localStorage.getItem('discount');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        if (savedDiscount) {
            discount = parseFloat(savedDiscount);
        }
        updateCart();
    }

    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.name === product.name);
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showNotification('Product added to cart');
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function showUndoNotification(item) {
        notification.innerHTML = `Removed ${item.name} from cart. <button id="undoButton" class="btn btn-link">Undo</button>`;
        notification.classList.add('show');
        document.getElementById('undoButton').addEventListener('click', () => {
            cart.push(item);
            updateCart();
            saveCart();
            showNotification('Item restored');
        });
        setTimeout(() => {
            notification.classList.remove('show');
            notification.textContent = '';
        }, 5000);
    }

    function emptyCart() {
        if (confirm('Are you sure you want to empty the cart?')) {
            cart = [];
            updateCart();
            saveCart();
        }
    }

    function applyDiscount() {
        const discountCode = discountCodeInput.value.trim();
        if (discountCode === 'SAVE10') {
            applyCoupon(0.10); // 10% discount
        } else {
            showNotification('Invalid discount code');
        }
    }

    function applyCoupon(discountRate) {
        discount = discountRate;
        updateCart();
        saveCart();
        showNotification('Discount applied successfully');
    }

    emptyCartButton.addEventListener('click', emptyCart);
    applyDiscountButton.addEventListener('click', applyDiscount);

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const product = {
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                imageUrl: productElement.dataset.imageUrl
            };
            addToCart(product);
        });
    });

    loadCart();

    // Ensure cart items are not removed on checkout
    checkoutButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
});
