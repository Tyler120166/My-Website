document.addEventListener('DOMContentLoaded', () => {
    // Variables and Element Selectors
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const searchBar = document.getElementById('searchBar');
    const checkoutButton = document.getElementById('checkoutButton');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const closeAuthModal = authModal.querySelector('.close');
    const adminForm = document.getElementById('adminForm');
    const adminProducts = document.getElementById('adminProducts');
    const notification = document.getElementById('notification');
    const cartCount = document.getElementById('cartCount');
    const cartItemsSummary = document.getElementById('cartItemsSummary');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCartButton = document.getElementById('emptyCartButton');
    const discountCodeInput = document.getElementById('discountCodeInput');
    const applyDiscountButton = document.getElementById('applyDiscountButton');

    // Fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Render products on the page
    function renderProducts(products) {
        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.dataset.price = product.price;
            productElement.dataset.name = product.name;
            productElement.dataset.imageUrl = product.imageUrl;
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <p>${product.description}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(productElement);
        });
        attachProductEventListeners();
    }

    // Attach event listeners to product elements
    function attachProductEventListeners() {
        const productElements = document.querySelectorAll('.product');
        productElements.forEach(product => {
            const button = product.querySelector('.add-to-cart');
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const name = product.dataset.name;
                const price = parseFloat(product.dataset.price);
                const description = product.querySelector('p').textContent;
                const imageUrl = product.dataset.imageUrl;
                addToCart({ name, price, description, imageUrl });
                showNotification('Product added to cart');
            });
        });
    }

    // Filter products by price range
    priceRange.addEventListener('input', () => {
        const maxPrice = priceRange.value;
        priceValue.textContent = `Max Price: $${maxPrice}`;
        const productElements = document.querySelectorAll('.product');
        productElements.forEach(product => {
            const productPrice = parseInt(product.dataset.price);
            product.style.display = (productPrice > maxPrice) ? 'none' : 'block';
        });
    });

    // Search products
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const productElements = document.querySelectorAll('.product');
        productElements.forEach(product => {
            const productName = product.dataset.name.toLowerCase();
            product.style.display = (productName.includes(query)) ? 'block' : 'none';
        });
    });

    // Add product to cart
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Update cart UI
    function updateCartUI() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;

        cartItemsSummary.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-info">
                    <span>${item.name}</span>
                    <span>$${item.price}</span>
                </div>
                <button class="remove-from-cart">Remove</button>
            `;
            cartItemsSummary.appendChild(li);
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)} USD`;
        attachRemoveFromCartEventListeners();
    }

    // Attach event listeners to remove buttons in the cart
    function attachRemoveFromCartEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemElement = event.target.closest('.cart-item');
                const itemName = itemElement.querySelector('.cart-item-info span').textContent;
                removeFromCart(itemName);
            });
        });
    }

    // Remove product from cart
    function removeFromCart(itemName) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.name !== itemName);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification('Product removed from cart');
    }

    // Empty the cart
    emptyCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        updateCartUI();
        showNotification('Cart emptied');
    });

    // Apply discount
    applyDiscountButton.addEventListener('click', () => {
        const discountCode = discountCodeInput.value.trim();
        if (discountCode === 'DISCOUNT10') {
            applyDiscount(0.10);
        } else {
            showNotification('Invalid discount code');
        }
    });

    // Apply discount to cart total
    function applyDiscount(discountRate) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        total = total - (total * discountRate);
        cartTotal.textContent = `Total after discount: $${total.toFixed(2)} USD`;
        showNotification('Discount applied');
    }

    // Show notification for user feedback
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Checkout functionality
    checkoutButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        // Implement checkout process here
        alert('Proceed to checkout with your items.');
        localStorage.removeItem('cart');
        updateCartUI();
    });

    // Redirect to login page
    loginButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Redirect to register page
    registerButton.addEventListener('click', () => {
        window.location.href = 'create.html';
    });

    // Close authentication modal
    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Handle authentication form submission
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = 'index.html';
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        authModal.style.display = 'none';
    });

    // Handle admin form submission
    adminForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const price = event.target.price.value;
        const description = event.target.description.value;
        const imageUrl = event.target.imageUrl.value;

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, price, description, imageUrl })
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
                fetchAdminProducts();
                showNotification('Product added successfully');
            } else {
                alert('Error adding product: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Fetch admin products
    async function fetchAdminProducts() {
        try {
            const response = await fetch('/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            renderAdminProducts(data.products);
        } catch (error) {
            console.error('Fetch admin products error:', error);
        }
    }

    // Render admin products
    function renderAdminProducts(products) {
        adminProducts.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('admin-product');
            productElement.innerHTML = `
                <h4>${product.name}</h4>
                <p>Price: $${product.price}</p>
                <p>${product.description}</p>
                <p><img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100px;"></p>
                <button class="update-product" data-id="${product._id}">Update</button>
                <button class="delete-product" data-id="${product._id}">Delete</button>
            `;
            adminProducts.appendChild(productElement);
        });
        attachAdminProductEventListeners();
    }

    // Attach event listeners to admin product elements
    function attachAdminProductEventListeners() {
        const updateButtons = document.querySelectorAll('.update-product');
        const deleteButtons = document.querySelectorAll('.delete-product');

        updateButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                const name = prompt('Enter new name');
                const price = prompt('Enter new price');
                const description = prompt('Enter new description');
                const imageUrl = prompt('Enter new image URL');

                try {
                    const response = await fetch(`/api/admin/update/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ name, price, description, imageUrl })
                    });
                    const data = await response.json();
                    if (data.success) {
                        fetchAdminProducts();
                        showNotification('Product updated successfully');
                    } else {
                        alert('Error updating product: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                if (confirm('Are you sure you want to delete this product?')) {
                    try {
                        const response = await fetch(`/api/admin/delete/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        const data = await response.json();
                        if (data.success) {
                            fetchAdminProducts();
                            showNotification('Product deleted successfully');
                        } else {
                            alert('Error deleting product: ' + data.message);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            });
        });
    }

    // Load cart from localStorage
    window.cart = {
        addToCart: function (product) {
            addToCart(product);
        },
        loadCart: function () {
            updateCartUI();
        }
    };

    // Fetch initial products and admin products
    fetchProducts();
    fetchAdminProducts();

    // Additional login and register form handling for login.html and create.html
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) handleFormSubmit(loginForm, '/login');
    if (registerForm) handleFormSubmit(registerForm, '/register');

    // Prefill username if "Remember Me" was checked
    const rememberedUsername = localStorage.getItem('remember');
    if (rememberedUsername) {
        const usernameInput = document.querySelector('#loginForm input[type="text"]');
        if (usernameInput) usernameInput.value = rememberedUsername;
    }

    // Display the registered username
    const registeredUsername = localStorage.getItem('registeredUsername');
    if (registeredUsername) {
        showFeedback(`Welcome back, ${registeredUsername}! Please log in.`, 'info');
        localStorage.removeItem('registeredUsername'); // Clear after displaying
    }

    // Enhance feedback with different types (info, warning)
    document.querySelectorAll('form').forEach(form => {
        form.insertAdjacentHTML('beforeend', '<span class="error-message"></span>');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.disabled = false;
            }, 3000);
        });
    });

    // Add error styles for invalid input fields
    const style = document.createElement('style');
    style.innerHTML = `
        .input-error {
            border-color: red;
        }
        .error-message {
            color: red;
            font-size: 12px;
            margin-top: -15px;
            margin-bottom: 10px;
            display: block;
        }
        #loader {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid #3498db;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #feedback {
            display: none;
            padding: 10px;
            margin-top: 20px;
            border-radius: 5px;
        }
        .success {
            background-color: #4CAF50;
            color: white;
        }
        .error {
            background-color: #f44336;
            color: white;
        }
        .info {
            background-color: #2196F3;
            color: white;
        }
        .warning {
            background-color: #ff9800;
            color: white;
        }
        .input-error ~ .error-message {
            display: block;
        }
        #passwordStrength {
            margin-top: -15px;
            font-size: 12px;
            color: #666;
        }
        input:focus, button:focus {
            outline: 2px solid #0056b3;
            outline-offset: 2px;
        }
        .password-toggle {
            cursor: pointer;
            margin-left: 10px;
            color: #007bff;
        }
        .password-toggle:hover {
            color: #0056b3;
        }
        .hidden {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .active-form {
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Add loader and feedback elements
    const loader = document.createElement('div');
    loader.id = 'loader';
    document.body.appendChild(loader);

    const feedback = document.createElement('div');
    feedback.id = 'feedback';
    document.body.appendChild(feedback);

    // Add password strength indicator
    document.getElementById('register-password').insertAdjacentHTML('afterend', '<div id="passwordStrength"></div>');

    // Show/hide password toggle
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.nextElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = 'Hide';
        } else {
            input.type = 'password';
            toggle.textContent = 'Show';
        }
    }

    // Password encryption before form submission
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        const passwordInput = document.getElementById('register-password');
        passwordInput.value = encryptPassword(passwordInput.value);
    });
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        const passwordInput = document.getElementById('login-password');
        passwordInput.value = encryptPassword(passwordInput.value);
    });

    // Auto-focus first input field
    document.querySelectorAll('form').forEach(form => {
        form.querySelector('input').focus();
    });

    // Scroll to top on form toggle
    function toggleFormWithScroll(e) {
        toggleForm(e);
        window.scrollTo(0, 0);
    }

    document.querySelectorAll('.form-toggle a').forEach(link => {
        link.addEventListener('click', toggleFormWithScroll);
    });

    // Enhancements

    // 1. Sanitize inputs before submission
    function sanitizeInput(value) {
        const temp = document.createElement('div');
        temp.textContent = value;
        return temp.innerHTML;
    }

    // 2. Check for input sanitization on form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = sanitizeInput(input.value);
            });
        });
    });

    // 3. Session timeout handling
    let sessionTimeout;
    function resetSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
            alert('Session expired. Please log in again.');
            window.location.reload();
        }, 30 * 60 * 1000); // 30 minutes
    }

    document.addEventListener('mousemove', resetSessionTimeout);
    document.addEventListener('keypress', resetSessionTimeout);

    // 4. Detailed error messages
    function showError(input, message) {
        input.classList.add('input-error');
        const errorSpan = input.nextElementSibling;
        errorSpan.textContent = message;
        errorSpan.classList.add('error-message');
    }

    // 5. Remove detailed error messages on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function () {
            if (input.classList.contains('input-error')) {
                input.classList.remove('input-error');
                const errorSpan = input.nextElementSibling;
                errorSpan.textContent = '';
                errorSpan.classList.remove('error-message');
            }
        });
    });

    // 6. Enhance feedback with different types (info, warning)
    function showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = type;
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    // 7. Implement "Forgot Password" functionality (simulation)
    document.querySelector('#forgot-password-link').addEventListener('click', function (e) {
        e.preventDefault();
        const email = prompt('Please enter your email to reset password:');
        if (email && validateEmail(email)) {
            // Simulate sending reset password link
            showFeedback('A reset password link has been sent to your email.', 'info');
        } else {
            showFeedback('Please enter a valid email address.', 'error');
        }
    });

    // 8. Confirmation before leaving page with unsaved changes
    let formChanged = false;
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => formChanged = true);
    });
    window.addEventListener('beforeunload', (e) => {
        if (formChanged) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // 9. Enhanced accessibility with focus indicators
    style.innerHTML += `
        input:focus, button:focus {
            outline: 2px solid #0056b3;
            outline-offset: 2px;
        }
    `;

    // 10. Display user's input while typing with real-time feedback
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function () {
            const feedbackSpan = document.getElementById(input.name + '-feedback');
            if (feedbackSpan) {
                feedbackSpan.textContent = input.value;
            }
        });
    });

    // Add real-time feedback spans
    document.getElementById('loginForm').insertAdjacentHTML('beforeend', '<span id="username-feedback"></span>');
    document.getElementById('loginForm').insertAdjacentHTML('beforeend', '<span id="email-feedback"></span>');

    // 11. Animation for form transitions
    style.innerHTML += `
        .hidden {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .active-form {
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        }
    `;

    // Apply animation classes
    document.getElementById('loginForm').classList.add('active-form');
    document.getElementById('registerForm').classList.add('hidden');

    // 12. Prevent multiple form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.disabled = false;
            }, 3000);
        });
    });

    // 13. Add Two-Factor Authentication (2FA)
    function requestTwoFactorAuth(email) {
        // Simulate 2FA request
        const code = prompt('Enter the 2FA code sent to your email:');
        return code === '123456'; // Example 2FA code
    }

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.querySelector('#loginForm input[type="email"]');
        const passwordInput = document.querySelector('#loginForm input[type="password"]');
        if (validateForm(this) && requestTwoFactorAuth(emailInput.value)) {
            this.submit(); // Proceed with form submission if 2FA is successful
        } else {
            showFeedback('Invalid 2FA code. Please try again.', 'error');
        }
    });

    // 14. Rate Limiting
    let loginAttempts = 0;
    const maxLoginAttempts = 10; // Hardcoded limit

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (loginAttempts >= maxLoginAttempts) {
            showFeedback('Too many login attempts. Please try again later.', 'error');
            return;
        }
        if (validateForm(this)) {
            loginAttempts++;
            this.submit();
        }
    });

    // 15. Implement CSRF Protection
    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const csrfToken = getCsrfToken();
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        });
    });

    // Log errors for administrative review
    function logError(error) {
        fetch('/log-error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.toString() })
        });
    }

    // Manage user session
    function manageSession(token) {
        localStorage.setItem('authToken', token);
        // Further session management logic can be implemented here
    }
});

// Event listeners for navigation buttons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginButton').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('registerButton').addEventListener('click', () => {
        window.location.href = 'create.html';
    });
});

// Fetch and filter products
document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const filterInput = document.getElementById('filter-price');
  
    filterInput.addEventListener('input', filterProducts);
  
    async function fetchProducts() {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    }
  
    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item card';
            productItem.innerHTML = `
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary">Add to Cart</button>
                </div>
            `;
            productContainer.appendChild(productItem);
        });
    }
  
    function filterProducts() {
        const maxPrice = filterInput.value;
        fetch(`/api/products?max_price=${maxPrice}`)
            .then(response => response.json())
            .then(products => displayProducts(products));
    }
  
    fetchProducts();
});

// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.btn-primary');
    cartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const productId = event.target.dataset.productId;
        fetch('/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        })
        .then(response => response.json())
        .then(cart => updateCartUI(cart));
    }

    function updateCartUI(cart) {
        const cartTotal = document.getElementById('cart-total');
        cartTotal.textContent = `Total: $${cart.totalPrice} USD`;
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = cart.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('');
    }
});

// Toggle login and registration forms
function toggleForm(e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    clearFormErrors(loginForm);
    clearFormErrors(registerForm);

    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

function clearFormErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('input-error');
        const errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.textContent = '';
        }
    });
}

// Form validation function
function validateForm(form) {
    let valid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        const errorSpan = input.nextElementSibling;
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('input-error');
            errorSpan.textContent = 'This field is required';
        } else {
            input.classList.remove('input-error');
            errorSpan.textContent = '';
        }
    });
    
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !validateEmail(emailInput.value)) {
        valid = false;
        emailInput.classList.add('input-error');
        emailInput.nextElementSibling.textContent = 'Please enter a valid email address';
    }

    const passwordInput = form.querySelector('input[type="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
    if (passwordInput) {
        const strength = getPasswordStrength(passwordInput.value);
        const strengthSpan = document.getElementById('passwordStrength');
        strengthSpan.textContent = `Password strength: ${strength}`;
        
        if (confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
            valid = false;
            confirmPasswordInput.classList.add('input-error');
            confirmPasswordInput.nextElementSibling.textContent = 'Passwords do not match';
        } else if (confirmPasswordInput) {
            confirmPasswordInput.classList.remove('input-error');
            confirmPasswordInput.nextElementSibling.textContent = '';
        }
    }

    return valid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function getPasswordStrength(password) {
    let strength = 'Weak';
    if (password.length >= 8) strength = 'Medium';
    if (password.length >= 12) strength = 'Strong';
    if (password.length >= 16 && /[\W_]/.test(password)) strength = 'Very Strong';
    return strength;
}

// Handle form submission with validation and local storage
function handleFormSubmit(form, url) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm(form)) {
            return;
        }

        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        // Simulate server response
        setTimeout(() => {
            loader.style.display = 'none';
            if (url === '/register') {
                // Save the user data in localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('registeredUsername', formData.get('username'));
                window.location.href = 'login.html';  // Redirect to login page after successful registration
            } else {
                const storedUserData = JSON.parse(localStorage.getItem('userData'));
                if (storedUserData && storedUserData.username === userData.username && storedUserData.password === userData.password) {
                    showFeedback(`Welcome, ${storedUserData.username}!`, 'success');
                    alert(`Welcome, ${storedUserData.username}!`);
                    if (form.remember && form.remember.checked) {
                        localStorage.setItem('remember', storedUserData.username);
                    }
                    manageSession(generateJWTToken(storedUserData)); // Handle user session with JWT
                } else {
                    showFeedback('Invalid username or password.', 'error');
                }
            }
        }, 1000);
    });
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = type;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 5000);
}

// Add dynamic password strength feedback
document.getElementById('register-password').addEventListener('input', function() {
    const strength = getPasswordStrength(this.value);
    const strengthSpan = document.getElementById('passwordStrength');
    strengthSpan.textContent = `Password strength: ${strength}`;
});

// Client-side encryption (example using CryptoJS)
function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, 'secret key 123').toString();
}

// Generate JWT token for session management
function generateJWTToken(userData) {
    // Simulate JWT generation
    return btoa(JSON.stringify(userData));
}

// Initialize form event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) handleFormSubmit(loginForm, '/login');
    if (registerForm) handleFormSubmit(registerForm, '/register');
    
    // Prefill username if "Remember Me" was checked
    const rememberedUsername = localStorage.getItem('remember');
    if (rememberedUsername) {
        const usernameInput = document.querySelector('#loginForm input[type="text"]');
        if (usernameInput) usernameInput.value = rememberedUsername;
    }
    
    // Display the registered username
    const registeredUsername = localStorage.getItem('registeredUsername');
    if (registeredUsername) {
        showFeedback(`Welcome back, ${registeredUsername}! Please log in.`, 'info');
        localStorage.removeItem('registeredUsername'); // Clear after displaying
    }
    
    // Enhance feedback with different types (info, warning)
    document.querySelectorAll('form').forEach(form => {
        form.insertAdjacentHTML('beforeend', '<span class="error-message"></span>');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.disabled = false;
            }, 3000);
        });
    });
});

// Add error styles for invalid input fields
const style = document.createElement('style');
style.innerHTML = `
    .input-error {
        border-color: red;
    }
    .error-message {
        color: red;
        font-size: 12px;
        margin-top: -15px;
        margin-bottom: 10px;
        display: block;
    }
    #loader {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    #feedback {
        display: none;
        padding: 10px;
        margin-top: 20px;
        border-radius: 5px;
    }
    .success {
        background-color: #4CAF50;
        color: white;
    }
    .error {
        background-color: #f44336;
        color: white;
    }
    .info {
        background-color: #2196F3;
        color: white;
    }
    .warning {
        background-color: #ff9800;
        color: white;
    }
    .input-error ~ .error-message {
        display: block;
    }
    #passwordStrength {
        margin-top: -15px;
        font-size: 12px;
        color: #666;
    }
    input:focus, button:focus {
        outline: 2px solid #0056b3;
        outline-offset: 2px;
    }
    .password-toggle {
        cursor: pointer;
        margin-left: 10px;
        color: #007bff;
    }
    .password-toggle:hover {
        color: #0056b3;
    }
    .hidden {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    .active-form {
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Add loader and feedback elements
const loader = document.createElement('div');
loader.id = 'loader';
document.body.appendChild(loader);

const feedback = document.createElement('div');
feedback.id = 'feedback';
document.body.appendChild(feedback);

// Add password strength indicator
document.getElementById('register-password').insertAdjacentHTML('afterend', '<div id="passwordStrength"></div>');

// Show/hide password toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = 'Hide';
    } else {
        input.type = 'password';
        toggle.textContent = 'Show';
    }
}

// Password encryption before form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    const passwordInput = document.getElementById('register-password');
    passwordInput.value = encryptPassword(passwordInput.value);
});
document.getElementById('loginForm').addEventListener('submit', function(e) {
    const passwordInput = document.getElementById('login-password');
    passwordInput.value = encryptPassword(passwordInput.value);
});

// Auto-focus first input field
document.querySelectorAll('form').forEach(form => {
    form.querySelector('input').focus();
});

// Scroll to top on form toggle
function toggleFormWithScroll(e) {
    toggleForm(e);
    window.scrollTo(0, 0);
}

document.querySelectorAll('.form-toggle a').forEach(link => {
    link.addEventListener('click', toggleFormWithScroll);
});

// Enhancements

// 1. Sanitize inputs before submission
function sanitizeInput(value) {
    const temp = document.createElement('div');
    temp.textContent = value;
    return temp.innerHTML;
}

// 2. Check for input sanitization on form submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = sanitizeInput(input.value);
        });
    });
});

// 3. Session timeout handling
let sessionTimeout;
function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        alert('Session expired. Please log in again.');
        window.location.reload();
    }, 30 * 60 * 1000); // 30 minutes
}

document.addEventListener('mousemove', resetSessionTimeout);
document.addEventListener('keypress', resetSessionTimeout);

// 4. Detailed error messages
function showError(input, message) {
    input.classList.add('input-error');
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = message;
    errorSpan.classList.add('error-message');
}

// 5. Remove detailed error messages on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        if (input.classList.contains('input-error')) {
            input.classList.remove('input-error');
            const errorSpan = input.nextElementSibling;
            errorSpan.textContent = '';
            errorSpan.classList.remove('error-message');
        }
    });
});

// 6. Enhance feedback with different types (info, warning)
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = type;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 5000);
}

// 7. Implement "Forgot Password" functionality (simulation)
document.querySelector('#forgot-password-link').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Please enter your email to reset password:');
    if (email && validateEmail(email)) {
        // Simulate sending reset password link
        showFeedback('A reset password link has been sent to your email.', 'info');
    } else {
        showFeedback('Please enter a valid email address.', 'error');
    }
});

// 8. Confirmation before leaving page with unsaved changes
let formChanged = false;
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => formChanged = true);
});
window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// 9. Enhanced accessibility with focus indicators
style.innerHTML += `
    input:focus, button:focus {
        outline: 2px solid #0056b3;
        outline-offset: 2px;
    }
`;

// 10. Display user's input while typing with real-time feedback
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        const feedbackSpan = document.getElementById(input.name + '-feedback');
        if (feedbackSpan) {
            feedbackSpan.textContent = input.value;
        }
    });
});

// Add real-time feedback spans
document.getElementById('loginForm').insertAdjacentHTML('beforeend', '<span id="username-feedback"></span>');
document.getElementById('loginForm').insertAdjacentHTML('beforeend', '<span id="email-feedback"></span>');

// 11. Animation for form transitions
style.innerHTML += `
    .hidden {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    .active-form {
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }
`;

// Apply animation classes
document.getElementById('loginForm').classList.add('active-form');
document.getElementById('registerForm').classList.add('hidden');

// 12. Prevent multiple form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        setTimeout(() => {
            submitButton.disabled = false;
        }, 3000);
    });
});

// 13. Add Two-Factor Authentication (2FA)
function requestTwoFactorAuth(email) {
    // Simulate 2FA request
    const code = prompt('Enter the 2FA code sent to your email:');
    return code === '123456'; // Example 2FA code
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = document.querySelector('#loginForm input[type="email"]');
    const passwordInput = document.querySelector('#loginForm input[type="password"]');
    if (validateForm(this) && requestTwoFactorAuth(emailInput.value)) {
        this.submit(); // Proceed with form submission if 2FA is successful
    } else {
        showFeedback('Invalid 2FA code. Please try again.', 'error');
    }
});

// 14. Rate Limiting
let loginAttempts = 0;
const maxLoginAttempts = 10; // Hardcoded limit

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (loginAttempts >= maxLoginAttempts) {
        showFeedback('Too many login attempts. Please try again later.', 'error');
        return;
    }
    if (validateForm(this)) {
        loginAttempts++;
        this.submit();
    }
});

// 15. Implement CSRF Protection
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const csrfToken = getCsrfToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
    });
});

// Log errors for administrative review
function logError(error) {
    fetch('/log-error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: error.toString() })
    });
}

// Manage user session
function manageSession(token) {
    localStorage.setItem('authToken', token);
    // Further session management logic can be implemented here
}
