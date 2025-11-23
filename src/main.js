// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Height of navbar
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Animate sections on scroll
const animateOnScroll = document.querySelectorAll('.room-card, .experience-card, .gallery-item, .about-content, .dining-content');
animateOnScroll.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// Hero Buttons Actions
const explorRoomsBtn = document.querySelector('.btn-primary');
const viewExperiencesBtn = document.querySelector('.btn-secondary');

if (exploreRoomsBtn) {
  exploreRoomsBtn.addEventListener('click', () => {
    document.querySelector('#rooms').scrollIntoView({ behavior: 'smooth' });
  });
}

if (viewExperiencesBtn) {
  viewExperiencesBtn.addEventListener('click', () => {
    document.querySelector('#experiences').scrollIntoView({ behavior: 'smooth' });
  });
}

// Book Now Buttons
document.querySelectorAll('.book-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const roomTitle = e.target.closest('.room-card').querySelector('.room-title').textContent;
    alert(`Booking inquiry for: ${roomTitle}\n\nThis would open a booking modal or redirect to a booking page.`);
  });
});

// Reserve Now Button in Nav
const reserveBtn = document.querySelector('.reserve-btn');
if (reserveBtn) {
  reserveBtn.addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  });
}

// Contact Form Handling
const inquiryForm = document.querySelector('#inquiryForm');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(inquiryForm);
    
    // Show success message
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    
    // Reset form
    inquiryForm.reset();
  });
}

// Gallery Item Click
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const imageText = item.querySelector('.image-placeholder span').textContent;
    alert(`Gallery view: ${imageText}\n\nThis would open a lightbox gallery.`);
  });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add hover effect to room cards
document.querySelectorAll('.room-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Animate numbers (could be used for stats)
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Log page load
console.log('Kafue River Lodge - Website loaded successfully');
console.log('Developed with love for luxury safari experiences 🦁');

// Preload images (optional - if you have actual images)
const preloadImages = () => {
  const images = [
    '/public/images/room1.jpg',
    '/public/images/room2.jpg',
    '/public/images/room3.jpg'
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Call preload on page load
window.addEventListener('load', preloadImages);