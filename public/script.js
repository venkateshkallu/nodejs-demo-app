// Cart state management
let cart = {
    items: [],
    total: 0,
    itemCount: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCartFunctionality();
    updateCartDisplay();
    loadCartFromStorage();
});

// Initialize cart functionality for existing HTML structure
function initializeCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseInt(this.getAttribute('data-product-price'));
            
            addToCart(productId, productName, productPrice, this);
        });
    });
}

// Add item to cart
function addToCart(productId, productName, productPrice, buttonElement) {
    if (!productId || !productName || !productPrice) return;
    
    // Add loading state to button
    buttonElement.classList.add('loading');
    buttonElement.disabled = true;
    buttonElement.textContent = 'Adding...';
    
    // Simulate async operation
    setTimeout(() => {
        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                addedAt: new Date()
            });
        }
        
        updateCartTotals();
        updateCartDisplay();
        saveCartToStorage();
        showAddToCartFeedback(productName);
        
        // Reset button state
        buttonElement.classList.remove('loading');
        buttonElement.disabled = false;
        buttonElement.textContent = 'Add to Cart';
        
        // Add visual feedback to button
        buttonElement.style.background = '#28a745';
        buttonElement.textContent = 'Added!';
        
        setTimeout(() => {
            buttonElement.style.background = '';
            buttonElement.textContent = 'Add to Cart';
        }, 1500);
        
    }, 500); // Simulate network delay
}

// Update cart totals
function updateCartTotals() {
    cart.itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.total = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Update cart display in navigation
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.itemCount;
}

// Show feedback when item is added to cart
function showAddToCartFeedback(productName) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <strong>✓ ${productName}</strong><br>
        <small>Added to cart successfully!</small>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('kiro-cart', JSON.stringify(cart));
    } catch (error) {
        console.warn('Could not save cart to localStorage:', error);
    }
}

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('kiro-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    } catch (error) {
        console.warn('Could not load cart from localStorage:', error);
        // Reset cart if corrupted
        cart = { items: [], total: 0, itemCount: 0 };
    }
}

// Clear cart
function clearCart() {
    cart = { items: [], total: 0, itemCount: 0 };
    updateCartDisplay();
    saveCartToStorage();
}

// Remove item from cart
function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.productId !== productId);
    updateCartTotals();
    updateCartDisplay();
    saveCartToStorage();
}

// Update item quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.items.find(item => item.productId === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartTotals();
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

// Get cart summary for display
function getCartSummary() {
    return {
        items: cart.items,
        itemCount: cart.itemCount,
        total: cart.total,
        formattedTotal: `₹${cart.total.toLocaleString()}`
    };
}

// Add click handler for cart link
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }
});

// Show cart modal (basic implementation)
function showCartModal() {
    const cartSummary = getCartSummary();
    
    if (cartSummary.itemCount === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let cartContent = `Cart Summary:\n\n`;
    cartSummary.items.forEach(item => {
        cartContent += `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}\n`;
    });
    cartContent += `\nTotal: ${cartSummary.formattedTotal}`;
    
    alert(cartContent);
}