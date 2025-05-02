document.addEventListener('DOMContentLoaded', function() {
  let lastScroll = 0;

  // Scroll handling
  window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const header = document.querySelector('.header');
      
      if (currentScroll > lastScroll && currentScroll > 100) {
          // Scrolling down
          header.classList.add('nav-hidden');
      } else {
          // Scrolling up
          header.classList.remove('nav-hidden');
      }
      
      lastScroll = currentScroll;
  });
  
  // Force scroll to top on page load (keep only one instance)
  window.scrollTo(0, 0);
  
  // Prevent automatic scroll to hash on page load (keep only one instance)
  if (window.location.hash) {
      setTimeout(function() {
          window.scrollTo(0, 0);
      }, 1);
  }

  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Initialize icons
  lucide.createIcons();

  // Initialize arrow functionality
  const navList = document.querySelector('.main-nav ul');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrow = document.querySelector('.nav-arrow.right');

  // Add initial animation class
  navList.classList.add('scroll-hint');

  function scrollNav(direction) {
      const scrollAmount = 200;
      
      // Remove the initial animation class if it exists
      navList.classList.remove('scroll-hint');
      
      if (direction === 'left') {
          navList.scrollBy({
              left: -scrollAmount,
              behavior: 'smooth'
          });
      } else {
          navList.scrollBy({
              left: scrollAmount,
              behavior: 'smooth'
          });
      }
      
      // Update arrow visibility after scrolling
      setTimeout(updateArrowVisibility, 100);
  }

  function updateArrowVisibility() {
      // Show/hide left arrow
      const isAtStart = navList.scrollLeft <= 0;
      leftArrow.style.display = isAtStart ? 'none' : 'flex';

      // Show/hide right arrow
      const isAtEnd = navList.scrollLeft >= navList.scrollWidth - navList.clientWidth - 5;
      rightArrow.style.display = isAtEnd ? 'none' : 'flex';
  }

  // Add click event listeners to arrows
  leftArrow.addEventListener('click', () => scrollNav('left'));
  rightArrow.addEventListener('click', () => scrollNav('right'));

  // Add scroll event listener
  navList.addEventListener('scroll', updateArrowVisibility);

  // Initial visibility check
  updateArrowVisibility();

  // Initialize sliders
  initializeSlider('image-slider', '.gallery-item');
  initializeSlider('pdf-slider', '.pdf-item');
});

function initializeSlider(sliderId, itemClass) {
    const slider = document.getElementById(sliderId);
    if (!slider) return; // Guard clause if slider doesn't exist
    
    const items = slider.querySelectorAll(itemClass);
    if (items.length === 0) return; // Guard clause if no items
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // Get the container and buttons
    const container = slider.closest('.gallery-container');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        currentIndex = index;
        
        // Normalize index
        if (currentIndex >= items.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = items.length - 1;
        
        // Apply transform
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match this with CSS transition duration
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Add click handlers for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-slide every 5 seconds
    const autoSlideInterval = setInterval(nextSlide, 5000);

    // Pause auto-slide on hover
    container.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Resume auto-slide when mouse leaves
    container.addEventListener('mouseleave', () => {
        clearInterval(autoSlideInterval);
        setInterval(nextSlide, 5000);
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }

    // Show first slide
    showSlide(0);

    // Return control functions
    return {
        next: nextSlide,
        prev: prevSlide,
        goto: showSlide
    };
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image slider
    initializeSlider('image-slider', '.gallery-item');
    
    // Initialize PDF slider
    initializeSlider('pdf-slider', '.pdf-item');
});

// Gallery slider functionality
function initializeSlider(sliderId, itemClass) {
    const slider = document.getElementById(sliderId);
    if (!slider) {
        // If slider doesn't exist, create it dynamically
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            const slides = galleryContainer.querySelectorAll('.gallery-slide');
            if (slides.length > 0) {
                const sliderDiv = document.createElement('div');
                sliderDiv.id = sliderId;
                sliderDiv.className = 'gallery-slider';
                
                // Move all slides into the slider
                slides.forEach(slide => {
                    sliderDiv.appendChild(slide.cloneNode(true));
                });
                
                // Clear and append the new slider
                galleryContainer.innerHTML = '';
                galleryContainer.appendChild(sliderDiv);
            }
        }
    }
    
    // Now get the slider (whether it existed or we just created it)
    const updatedSlider = document.getElementById(sliderId) || document.querySelector('.gallery-container');
    if (!updatedSlider) return;
    
    const items = updatedSlider.querySelectorAll(itemClass);
    if (items.length === 0) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // Get the container and buttons
    const container = updatedSlider.closest('.gallery-container');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        currentIndex = index;
        
        // Normalize index
        if (currentIndex >= items.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = items.length - 1;
        
        // Apply transform
        updatedSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Add click handlers for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-slide every 5 seconds
    const autoSlideInterval = setInterval(nextSlide, 5000);

    // Pause auto-slide on hover
    container.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Resume auto-slide when mouse leaves
    container.addEventListener('mouseleave', () => {
        clearInterval(autoSlideInterval);
        setInterval(nextSlide, 5000);
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    updatedSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    updatedSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }

    // Show first slide
    showSlide(0);

    // Return control functions
    return {
        next: nextSlide,
        prev: prevSlide,
        goto: showSlide
    };
}

// Registration function
function registerNow() {
    window.location.href = 'https://sites.google.com/view/your-registration-page';
}

// Language toggle functionality
let isAmharic = false; // Initialize language state

function updateFeaturesSection(lang) {
    const featureElements = document.querySelectorAll('[data-translate]');
    featureElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            element.textContent = translations[key][lang];
        }
    });
}

function toggleLanguage() {
    isAmharic = !isAmharic;
    const lang = isAmharic ? 'am' : 'en';
    
    // Update all elements with data-translate attribute
    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            element.textContent = translations[key][lang];
        }
    });

    // Update language toggle button text
    const langToggleSpan = document.querySelector('#langToggle span');
    if (langToggleSpan) {
        langToggleSpan.textContent = isAmharic ? 'Switch to English' : 'ወደ አማርኛ';
    }
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update logo text
    const logoText = document.querySelector('.logo span');
    if (logoText) {
        logoText.textContent = translations['logo_text'][lang];
    }
    
    // Update navigation items
    const navItems = document.querySelectorAll('[data-translate]');
    navItems.forEach(item => {
        const key = item.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            item.textContent = translations[key][lang];
        }
    });

    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const buttonText = langToggle.querySelector('span');
        if (buttonText) {
            buttonText.textContent = isAmharic ? 'Switch to English' : 'ወደ አማርኛ';
        }
    }

    // Update all sections
    updateHeroSection(lang);
    updateFeaturesSection(lang);
    updateAboutSection(lang);
    updateGallerySection(lang);
    updateResourcesSection(lang);
    updateTestimonialsSection(lang);
    updateJoinSection(lang);
    updateContactSection(lang);
    updateFooterSection(lang);
});

// Gallery slider functionality
const slider = document.getElementById('gallery-slider');
const slides = slider.getElementsByClassName('gallery-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

// Hide all slides except the first one
function initializeSlider() {
    for (let i = 1; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
}

// Picture Gallery View More functionality
function toggleGallery() {
    const pictureGrid = document.querySelector('.picture-grid');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const btnText = viewMoreBtn.querySelector('span') || viewMoreBtn;
    const btnIcon = viewMoreBtn.querySelector('i');
    
    if (pictureGrid.classList.contains('expanded')) {
        pictureGrid.classList.remove('expanded');
        btnText.textContent = translations['view_more_btn'][isAmharic ? 'am' : 'en'];
        btnIcon.style.transform = 'rotate(0deg)';
    } else {
        pictureGrid.classList.add('expanded');
        btnText.textContent = translations['view_less_btn'][isAmharic ? 'am' : 'en'];
        btnIcon.style.transform = 'rotate(180deg)';
    }
}

// Show specific slide
function showSlide(index) {
    // Hide all slides
    for (let slide of slides) {
        slide.style.display = 'none';
    }
    // Show the selected slide
    slides[index].style.display = 'block';
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Initialize slider
initializeSlider();

// Add event listeners to buttons
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);