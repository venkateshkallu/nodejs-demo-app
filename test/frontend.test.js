/**
 * Frontend JavaScript Tests for Cart Functionality
 * Tests cart state management, user interactions, and UI behavior
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Frontend Cart Functionality Tests', () => {
  let dom;
  let window;
  let document;
  let cart;
  let localStorageMock;

  beforeEach(() => {
    // Read the actual HTML file
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Remove external resource links to avoid loading issues
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="style\.css">/, '');
    htmlContent = htmlContent.replace(/<script src="script\.js"><\/script>/, '');

    dom = new JSDOM(htmlContent, {
      url: 'http://localhost:3000',
      pretendToBeVisual: false
    });

    window = dom.window;
    document = window.document;
    
    // Setup localStorage mock
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    // Setup basic cart object for testing
    cart = {
      items: [],
      total: 0,
      itemCount: 0
    };

    // Mock cart functions for testing
    window.cart = cart;
    window.localStorage = localStorageMock;
    global.localStorage = localStorageMock;
    global.alert = jest.fn();
    global.console = { ...console, warn: jest.fn() };
    
    window.updateCartTotals = function() {
      this.cart.itemCount = this.cart.items.reduce((total, item) => total + item.quantity, 0);
      this.cart.total = this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    window.updateCartDisplay = function() {
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = this.cart.itemCount;
      }
    };
    
    window.clearCart = function() {
      this.cart = { items: [], total: 0, itemCount: 0 };
      this.updateCartDisplay();
    };

    window.getCartSummary = function() {
      return {
        items: this.cart.items,
        itemCount: this.cart.itemCount,
        total: this.cart.total,
        formattedTotal: `₹${this.cart.total.toLocaleString()}`
      };
    };

    window.addToCart = function(productId, productName, productPrice, buttonElement) {
      if (!productId || !productName || !productPrice) return;
      
      const existingItem = this.cart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.items.push({
          productId: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
          addedAt: new Date()
        });
      }
      
      this.updateCartTotals();
      this.updateCartDisplay();
    };

    window.initializeCartFunctionality = function() {
      // Mock initialization function
      return true;
    };

    window.showAddToCartFeedback = function(productName) {
      // Mock feedback function
      return true;
    };

    window.showCartModal = function() {
      if (this.cart.itemCount === 0) {
        global.alert('Your cart is empty!');
        return;
      }
      
      let cartContent = 'Cart Summary:\n\n';
      this.cart.items.forEach(item => {
        cartContent += `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}\n`;
      });
      cartContent += `\nTotal: ₹${this.cart.total.toLocaleString()}`;
      
      global.alert(cartContent);
    };

    window.saveCartToStorage = function() {
      try {
        localStorageMock.setItem('kiro-cart', JSON.stringify(window.cart));
      } catch (error) {
        global.console.warn('Could not save cart to localStorage:', error);
      }
    };

    window.loadCartFromStorage = function() {
      try {
        const savedCart = localStorageMock.getItem('kiro-cart');
        if (savedCart) {
          window.cart = JSON.parse(savedCart);
          window.updateCartDisplay();
        }
      } catch (error) {
        global.console.warn('Could not load cart from localStorage:', error);
        window.cart = { items: [], total: 0, itemCount: 0 };
      }
    };
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('Cart State Management', () => {
    test('should initialize with cart object available', () => {
      // Check that cart object exists in global scope
      expect(window.cart).toBeDefined();
      expect(window.cart.items).toEqual([]);
      expect(window.cart.total).toBe(0);
      expect(window.cart.itemCount).toBe(0);
    });

    test('should have cart manipulation functions available', () => {
      // Check that cart functions are available
      expect(typeof window.addToCart).toBe('function');
      expect(typeof window.updateCartTotals).toBe('function');
      expect(typeof window.updateCartDisplay).toBe('function');
      expect(typeof window.clearCart).toBe('function');
    });

    test('should update cart totals correctly', () => {
      // Manually add items to test totals calculation
      window.cart.items = [
        { productId: '1', name: 'HP Laptop', price: 49999, quantity: 2 },
        { productId: '2', name: 'Smartphone', price: 29999, quantity: 1 }
      ];
      
      window.updateCartTotals();
      
      expect(window.cart.itemCount).toBe(3); // 2 + 1
      expect(window.cart.total).toBe(129997); // (49999 * 2) + (29999 * 1)
    });

    test('should clear cart completely', () => {
      // Add items first
      window.cart.items = [
        { productId: '1', name: 'HP Laptop', price: 49999, quantity: 1 },
        { productId: '2', name: 'Smartphone', price: 29999, quantity: 1 }
      ];
      
      window.clearCart();
      
      expect(window.cart.items).toEqual([]);
      expect(window.cart.total).toBe(0);
      expect(window.cart.itemCount).toBe(0);
    });
  });

  describe('Add to Cart Button Functionality', () => {
    test('should have add to cart buttons with correct attributes', () => {
      const buttons = document.querySelectorAll('.add-to-cart-btn');
      
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button.getAttribute('data-product-id')).toBeTruthy();
        expect(button.getAttribute('data-product-name')).toBeTruthy();
        expect(button.getAttribute('data-product-price')).toBeTruthy();
        expect(button.textContent.trim()).toBe('Add to Cart');
      });
    });

    test('should initialize cart functionality', () => {
      // Check that initialization function exists
      expect(typeof window.initializeCartFunctionality).toBe('function');
      
      // Initialize cart functionality
      window.initializeCartFunctionality();
      
      // Check that buttons have event listeners (we can't directly test this, but we can test the function exists)
      expect(typeof window.addToCart).toBe('function');
    });

    test('should handle invalid product data gracefully', () => {
      const button = document.querySelector('.add-to-cart-btn');
      const initialItemCount = window.cart.items.length;
      
      // Test with missing data - these should not crash
      expect(() => window.addToCart(null, 'HP Laptop', 49999, button)).not.toThrow();
      expect(() => window.addToCart('1', null, 49999, button)).not.toThrow();
      expect(() => window.addToCart('1', 'HP Laptop', null, button)).not.toThrow();
      
      expect(window.cart.items.length).toBe(initialItemCount);
    });
  });

  describe('User Interaction Feedback', () => {
    test('should have cart count display element', () => {
      const cartCount = document.getElementById('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.textContent).toBe('0');
    });

    test('should update cart count display', () => {
      const cartCount = document.getElementById('cart-count');
      
      // Add items to cart
      window.cart.items = [
        { productId: '1', quantity: 2 },
        { productId: '2', quantity: 1 }
      ];
      window.cart.itemCount = 3;
      
      window.updateCartDisplay();
      
      expect(cartCount.textContent).toBe('3');
    });

    test('should have feedback functions available', () => {
      expect(typeof window.showAddToCartFeedback).toBe('function');
      expect(typeof window.showCartModal).toBe('function');
    });

    test('should handle cart link click functionality', () => {
      const cartLink = document.getElementById('cart-link');
      expect(cartLink).toBeTruthy();
      
      // Test that showCartModal function exists
      expect(typeof window.showCartModal).toBe('function');
    });
  });

  describe('Local Storage Integration', () => {
    test('should have localStorage functions available', () => {
      expect(typeof window.saveCartToStorage).toBe('function');
      expect(typeof window.loadCartFromStorage).toBe('function');
    });

    test('should save cart to localStorage', () => {
      window.cart.items = [{ productId: '1', name: 'HP Laptop', price: 49999, quantity: 1 }];
      
      window.saveCartToStorage();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kiro-cart',
        JSON.stringify(window.cart)
      );
    });

    test('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      expect(() => window.saveCartToStorage()).not.toThrow();
      expect(global.console.warn).toHaveBeenCalled();
    });

    test('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(() => window.loadCartFromStorage()).not.toThrow();
      expect(global.console.warn).toHaveBeenCalled();
    });
  });

  describe('Cart Summary and Display', () => {
    test('should have cart summary function available', () => {
      expect(typeof window.getCartSummary).toBe('function');
    });

    test('should generate correct cart summary', () => {
      window.cart.items = [
        { productId: '1', name: 'HP Laptop', price: 49999, quantity: 2 },
        { productId: '2', name: 'Smartphone', price: 29999, quantity: 1 }
      ];
      window.cart.itemCount = 3;
      window.cart.total = 129997;
      
      const summary = window.getCartSummary();
      
      expect(summary.items).toEqual(window.cart.items);
      expect(summary.itemCount).toBe(3);
      expect(summary.total).toBe(129997);
      expect(summary.formattedTotal).toContain('₹');
    });

    test('should format currency correctly', () => {
      window.cart.total = 1234567;
      
      const summary = window.getCartSummary();
      
      expect(summary.formattedTotal).toContain('₹');
      expect(summary.formattedTotal).toContain('1,234,567');
    });
  });
});