// ==============================
// MOBILE MENU
// ==============================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      mainNav.classList.remove('active');
    }
  });
}

// ==============================
// PRODUCT IMAGE GALLERY
// ==============================
// Gallery arrows and dots are now static - no JS functionality

// ==============================
// SUBSCRIPTION EXPAND/COLLAPSE
// ==============================
const subscriptionRadios = document.querySelectorAll('input[name="subscription"]');
const subscriptionBoxes = document.querySelectorAll('.subscription-box');

subscriptionRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    subscriptionBoxes.forEach(box => {
      box.classList.remove('active');
    });

    const parentBox = radio.closest('.subscription-box');
    if (parentBox && radio.checked) {
      parentBox.classList.add('active');
    }
  });
});

// ==============================
// DYNAMIC ADD TO CART LINK
// ==============================
const addToCartBtn = document.getElementById('addToCart');

function updateAddToCartLink() {
  // Get selected subscription type
  const selectedSubscription = document.querySelector('input[name="subscription"]:checked');
  const subscriptionType = selectedSubscription ? selectedSubscription.value : 'single';
  
  let fragrance1 = 'original';
  let fragrance2 = 'original';
  
  if (subscriptionType === 'single') {
    const selectedFragrance = document.querySelector('input[name="fragrance1"]:checked');
    fragrance1 = selectedFragrance ? selectedFragrance.value : 'original';
    
    // Generate cart link: single_original, single_lily, single_rose
    addToCartBtn.href = `https://shop.gtg.com/cart/add?type=single&fragrance=${fragrance1}`;
  } else {
    // Double subscription
    const selectedFragrance1 = document.querySelector('input[name="fragrance1_double"]:checked');
    const selectedFragrance2 = document.querySelector('input[name="fragrance2_double"]:checked');
    
    fragrance1 = selectedFragrance1 ? selectedFragrance1.value : 'original';
    fragrance2 = selectedFragrance2 ? selectedFragrance2.value : 'original';
    
    // Generate cart link: double_original_lily, double_rose_original, etc
    addToCartBtn.href = `https://shop.gtg.com/cart/add?type=double&fragrance1=${fragrance1}&fragrance2=${fragrance2}`;
  }
  
  console.log('Cart Link Updated:', addToCartBtn.href);
}

// Listen to all radio changes
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', updateAddToCartLink);
});

// Initialize on page load
updateAddToCartLink();

// ==============================
// COLLECTION ACCORDION
// ==============================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.closest('.accordion-item');
    const isActive = accordionItem.classList.contains('active');

    // Close all accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.remove('active');

      // Set all icons to plus
      const icon = item.querySelector('.accordion-icon');
      if (icon) {
        icon.src = 'assets/icons/plus.svg';
      }
    });

    // Open clicked item
    if (!isActive) {
      accordionItem.classList.add('active');

      const activeIcon = accordionItem.querySelector('.accordion-icon');
      if (activeIcon) {
        activeIcon.src = 'assets/icons/minus.svg';
      }
    }
  });
});


// ==============================
// ANIMATED COUNTER FOR STATS
// ==============================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Intersection Observer for stats section
const statsSection = document.getElementById('statsSection');
let hasAnimated = false;

if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          animateCounter(stat, target);
        });
      }
    });
  }, {
    threshold: 0.5
  });
  
  observer.observe(statsSection);
}

// ==============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for empty anchors
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==============================
// LAZY LOADING IMAGES
// ==============================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==============================
// HEADER SCROLL EFFECT
// ==============================
let lastScrollY = window.scrollY;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'transparent';
    header.style.boxShadow = 'none';
  }
  
  lastScrollY = window.scrollY;
});

// ==============================
// FORM VALIDATION (Newsletter)
// ==============================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      // Success
      alert('Thank you for subscribing!');
      emailInput.value = '';
    } else {
      alert('Please enter a valid email address.');
    }
  });
}

// ==============================
// CONSOLE LOG FOR DEBUGGING
// ==============================
console.log('GTG Perfumes - JavaScript Loaded Successfully ✓');
console.log('Features Active:');
console.log('- Mobile Menu');
console.log('- Image Gallery');
console.log('- Subscription Toggle');
console.log('- Dynamic Add to Cart');
console.log('- Accordion');
console.log('- Animated Counters');
console.log('- Smooth Scrolling');
console.log('- Lazy Loading');
console.log('- Header Scroll Effect');