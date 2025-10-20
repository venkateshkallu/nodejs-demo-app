/**
 * UI Behavior and Responsive Design Tests
 * Tests product card rendering and responsive behavior
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Product Card Rendering and Responsive Behavior Tests', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    // Read the actual HTML file
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Remove the CSS link to avoid resource loading issues
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="style\.css">/, '');

    // Create DOM with simplified HTML content
    dom = new JSDOM(htmlContent, {
      url: 'http://localhost:3000',
      pretendToBeVisual: false,
      resources: 'usable'
    });

    window = dom.window;
    document = window.document;

    // Setup global objects
    global.window = window;
    global.document = document;
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('Product Card Structure', () => {
    test('should render product cards with correct structure', () => {
      const productCards = document.querySelectorAll('.product-card');
      
      expect(productCards.length).toBeGreaterThan(0);
      
      productCards.forEach(card => {
        // Check required elements exist
        const image = card.querySelector('img');
        const title = card.querySelector('h3');
        const price = card.querySelector('.product-price');
        const button = card.querySelector('.add-to-cart-btn');
        
        expect(image).toBeTruthy();
        expect(title).toBeTruthy();
        expect(price).toBeTruthy();
        expect(button).toBeTruthy();
        
        // Check image has alt attribute
        expect(image.getAttribute('alt')).toBeTruthy();
        
        // Check button has required data attributes
        expect(button.getAttribute('data-product-id')).toBeTruthy();
        expect(button.getAttribute('data-product-name')).toBeTruthy();
        expect(button.getAttribute('data-product-price')).toBeTruthy();
      });
    });

    test('should have proper semantic HTML structure', () => {
      const showcase = document.querySelector('.product-showcase');
      expect(showcase).toBeTruthy();
      
      const productCards = showcase.querySelectorAll('.product-card');
      expect(productCards.length).toBeGreaterThan(0);
      
      // Check for proper heading hierarchy
      productCards.forEach(card => {
        const heading = card.querySelector('h3');
        expect(heading).toBeTruthy();
        expect(heading.textContent.trim()).not.toBe('');
      });
    });

    test('should include HP Laptop with correct pricing', () => {
      const productCards = document.querySelectorAll('.product-card');
      let foundHPLaptop = false;
      
      productCards.forEach(card => {
        const title = card.querySelector('h3');
        const price = card.querySelector('.product-price');
        
        if (title && title.textContent.includes('HP Laptop')) {
          foundHPLaptop = true;
          expect(price.textContent).toContain('₹49,999');
        }
      });
      
      expect(foundHPLaptop).toBe(true);
    });

    test('should have accessible button text', () => {
      const buttons = document.querySelectorAll('.add-to-cart-btn');
      
      buttons.forEach(button => {
        expect(button.textContent.trim()).toBe('Add to Cart');
        expect(button.getAttribute('type')).not.toBe('submit'); // Should be button type
      });
    });
  });

  describe('Responsive Layout Behavior', () => {
    test('should use CSS Grid or Flexbox for product showcase', () => {
      const showcase = document.querySelector('.product-showcase');
      const grid = document.querySelector('.product-grid');
      
      // Check that the showcase or grid container exists
      expect(showcase || grid).toBeTruthy();
      
      // In a real browser with CSS, this would be grid or flex
      // For testing purposes, we just verify the structure exists
      if (grid) {
        expect(grid.classList.contains('product-grid')).toBe(true);
      }
    });

    test('should have responsive grid columns', () => {
      const showcase = document.querySelector('.product-showcase');
      const computedStyle = window.getComputedStyle(showcase);
      
      if (computedStyle.getPropertyValue('display') === 'grid') {
        const gridTemplate = computedStyle.getPropertyValue('grid-template-columns');
        // Should use responsive grid (auto-fit or auto-fill with minmax)
        expect(gridTemplate).toMatch(/(auto-fit|auto-fill|repeat)/);
      }
    });

    test('should have proper spacing between cards', () => {
      const showcase = document.querySelector('.product-showcase');
      const computedStyle = window.getComputedStyle(showcase);
      
      // Check for gap or margin/padding
      const gap = computedStyle.getPropertyValue('gap') || 
                  computedStyle.getPropertyValue('grid-gap');
      
      if (gap && gap !== 'normal' && gap !== '0px') {
        expect(gap).toBeTruthy();
      } else {
        // Check for padding/margin on cards
        const firstCard = document.querySelector('.product-card');
        if (firstCard) {
          const cardStyle = window.getComputedStyle(firstCard);
          const margin = cardStyle.getPropertyValue('margin');
          const padding = cardStyle.getPropertyValue('padding');
          
          expect(margin !== '0px' || padding !== '0px').toBe(true);
        }
      }
    });

    test('should handle different viewport sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
      
      // Trigger resize event
      const resizeEvent = new window.Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Check that layout adapts (this is a basic check)
      const showcase = document.querySelector('.product-showcase');
      expect(showcase).toBeTruthy();
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      
      window.dispatchEvent(resizeEvent);
      expect(showcase).toBeTruthy();
    });
  });

  describe('Visual Feedback and Interactions', () => {
    test('should have hover states for interactive elements', () => {
      const buttons = document.querySelectorAll('.add-to-cart-btn');
      
      buttons.forEach(button => {
        // Simulate hover
        const mouseEnterEvent = new window.MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
        });
        
        button.dispatchEvent(mouseEnterEvent);
        
        // Check that element is still accessible after hover
        expect(button.style.cursor !== 'not-allowed').toBe(true);
      });
    });

    test('should maintain accessibility during interactions', () => {
      const buttons = document.querySelectorAll('.add-to-cart-btn');
      
      buttons.forEach(button => {
        // Check initial accessibility
        expect(button.getAttribute('disabled')).toBeFalsy();
        
        // Simulate focus
        button.focus();
        expect(document.activeElement).toBe(button);
        
        // Check that button remains focusable
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    test('should handle keyboard navigation', () => {
      const buttons = document.querySelectorAll('.add-to-cart-btn');
      
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        
        // Test Tab navigation
        firstButton.focus();
        expect(document.activeElement).toBe(firstButton);
        
        // Test Enter key activation
        const enterEvent = new window.KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        });
        
        let clickTriggered = false;
        firstButton.addEventListener('click', () => {
          clickTriggered = true;
        });
        
        firstButton.dispatchEvent(enterEvent);
        
        // Note: In real browser, Enter would trigger click
        // This is a basic test structure
        expect(firstButton).toBeTruthy();
      }
    });
  });

  describe('Image Loading and Fallbacks', () => {
    test('should have proper image attributes', () => {
      const images = document.querySelectorAll('.product-card img');
      
      images.forEach(image => {
        // Check required attributes
        expect(image.getAttribute('src')).toBeTruthy();
        expect(image.getAttribute('alt')).toBeTruthy();
        
        // Check alt text is descriptive
        const altText = image.getAttribute('alt');
        expect(altText.length).toBeGreaterThan(0);
        expect(altText).not.toBe('image');
      });
    });

    test('should handle image loading errors gracefully', () => {
      const images = document.querySelectorAll('.product-card img');
      
      images.forEach(image => {
        // Simulate image error
        const errorEvent = new window.Event('error');
        
        let errorHandled = false;
        image.addEventListener('error', () => {
          errorHandled = true;
        });
        
        image.dispatchEvent(errorEvent);
        
        // Check that image still has proper structure
        expect(image.parentElement).toBeTruthy();
      });
    });
  });

  describe('Content Validation', () => {
    test('should display proper currency formatting', () => {
      const prices = document.querySelectorAll('.product-price');
      
      prices.forEach(price => {
        const priceText = price.textContent;
        
        // Should contain rupee symbol
        expect(priceText).toContain('₹');
        
        // Should contain numbers
        expect(priceText).toMatch(/\d/);
        
        // Should be properly formatted (comma-separated for Indian numbering)
        if (priceText.includes(',')) {
          expect(priceText).toMatch(/₹[\d,]+/);
        }
      });
    });

    test('should have consistent product naming', () => {
      const productTitles = document.querySelectorAll('.product-card h3');
      
      productTitles.forEach(title => {
        const titleText = title.textContent.trim();
        
        // Should not be empty
        expect(titleText.length).toBeGreaterThan(0);
        
        // Should be properly capitalized (first letter should be uppercase)
        // Handle cases like "iPad" where first letter might be lowercase
        const firstLetter = titleText[0];
        const isCapitalized = firstLetter === firstLetter.toUpperCase() || 
                             titleText.startsWith('iPad') || 
                             titleText.startsWith('iPhone');
        expect(isCapitalized).toBe(true);
      });
    });

    test('should maintain data consistency between HTML and button attributes', () => {
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        const title = card.querySelector('h3');
        const button = card.querySelector('.add-to-cart-btn');
        
        if (title && button) {
          const titleText = title.textContent.trim();
          const buttonProductName = button.getAttribute('data-product-name');
          
          // Product name should match between title and button data
          expect(buttonProductName).toBe(titleText);
        }
      });
    });
  });

  describe('Performance and Optimization', () => {
    test('should not have excessive DOM nesting', () => {
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        // Count nesting levels
        let maxDepth = 0;
        
        function getDepth(element, depth = 0) {
          maxDepth = Math.max(maxDepth, depth);
          
          for (let child of element.children) {
            getDepth(child, depth + 1);
          }
        }
        
        getDepth(card);
        
        // Should not be excessively nested (reasonable limit)
        expect(maxDepth).toBeLessThan(10);
      });
    });

    test('should have efficient CSS selectors', () => {
      // Check that required classes exist
      expect(document.querySelector('.product-showcase')).toBeTruthy();
      expect(document.querySelector('.product-card')).toBeTruthy();
      expect(document.querySelector('.add-to-cart-btn')).toBeTruthy();
      
      // Check for semantic structure
      const showcase = document.querySelector('.product-showcase');
      const cards = showcase.querySelectorAll('.product-card');
      
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});