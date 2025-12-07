// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

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
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const animateOnScroll = document.querySelectorAll('.room-card, .experience-card, .gallery-item, .about-content, .dining-content');
animateOnScroll.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// ========================================
// BOOKING SYSTEM
// ========================================

let bookingData = {
  room: '',
  price: 0,
  checkIn: '',
  checkOut: '',
  guests: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  specialRequests: '',
  nights: 0,
  total: 0
};

// Open booking modal
function openBookingModal(room = '', price = 0) {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Pre-select room if provided
  if (room && price) {
    const roomInput = document.querySelector(`input[value="${room}"]`);
    if (roomInput) {
      roomInput.checked = true;
      bookingData.room = room;
      bookingData.price = parseInt(price);
    }
  }

  goToStep(1);
}

// Close booking modal
function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';

  // Reset form
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingSuccess').classList.remove('active');
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('bookingSummary').innerHTML = '';
  document.getElementById('finalSummary').innerHTML = '';

  // Reset steps
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active', 'completed'));
  document.querySelector('.booking-step[data-step="1"]').classList.add('active');
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step1').classList.add('active');

  // Reset data
  bookingData = { room: '', price: 0, checkIn: '', checkOut: '', guests: '', firstName: '', lastName: '', email: '', phone: '', country: '', specialRequests: '', nights: 0, total: 0 };
}

// Navigate steps
function goToStep(step) {
  // Validate before moving forward
  if (step > 1) {
    const selectedRoom = document.querySelector('input[name="selectedRoom"]:checked');
    if (!selectedRoom) {
      alert('Please select a room');
      return;
    }
    bookingData.room = selectedRoom.value;
    bookingData.price = parseInt(selectedRoom.dataset.price);
  }

  if (step > 2) {
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('numGuests').value;

    if (!checkIn || !checkOut || !guests) {
      alert('Please fill in all date fields');
      return;
    }

    bookingData.checkIn = checkIn;
    bookingData.checkOut = checkOut;
    bookingData.guests = guests;
  }

  // Update step indicators
  document.querySelectorAll('.booking-step').forEach(s => {
    const stepNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (stepNum === step) s.classList.add('active');
    if (stepNum < step) s.classList.add('completed');
  });

  // Show correct form step
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');

  // Update summaries
  if (step >= 2) updateSummary();
}

// Update booking summary
function updateSummary() {
  const selectedRoom = document.querySelector('input[name="selectedRoom"]:checked');
  const checkIn = document.getElementById('checkInDate').value;
  const checkOut = document.getElementById('checkOutDate').value;

  if (!selectedRoom) return;

  const room = selectedRoom.value;
  const price = parseInt(selectedRoom.dataset.price);
  let nights = 0;
  let total = 0;

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights < 0) nights = 0;
    total = nights * price;
  }

  bookingData.room = room;
  bookingData.price = price;
  bookingData.nights = nights;
  bookingData.total = total;

  const summaryHTML = `
    <h4>Booking Summary</h4>
    <div class="summary-row"><span>${room}</span><span>ZMW ${price.toLocaleString()}/night</span></div>
    ${nights > 0 ? `<div class="summary-row"><span>${nights} night${nights > 1 ? 's' : ''}</span><span></span></div>` : ''}
    ${total > 0 ? `<div class="summary-row total"><span>Total</span><span>ZMW ${total.toLocaleString()}</span></div>` : ''}
  `;

  document.getElementById('bookingSummary').innerHTML = summaryHTML;
  document.getElementById('finalSummary').innerHTML = summaryHTML;
}

// Handle form submission
function handleBookingSubmit(e) {
  e.preventDefault();

  // Gather guest details
  bookingData.firstName = document.getElementById('guestFirstName').value;
  bookingData.lastName = document.getElementById('guestLastName').value;
  bookingData.email = document.getElementById('guestEmail').value;
  bookingData.phone = document.getElementById('guestPhone').value;
  bookingData.country = document.getElementById('guestCountry').value;
  bookingData.specialRequests = document.getElementById('specialRequests').value;

  // Generate confirmation number
  const confirmationNum = 'MRR-' + Date.now().toString(36).toUpperCase();

  // Format dates for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Show confirmation
  document.getElementById('confirmationDetails').innerHTML = `
    <div class="summary-row"><span>Confirmation #</span><span><strong>${confirmationNum}</strong></span></div>
    <div class="summary-row"><span>Guest</span><span>${bookingData.firstName} ${bookingData.lastName}</span></div>
    <div class="summary-row"><span>Room</span><span>${bookingData.room}</span></div>
    <div class="summary-row"><span>Check-in</span><span>${formatDate(bookingData.checkIn)}</span></div>
    <div class="summary-row"><span>Check-out</span><span>${formatDate(bookingData.checkOut)}</span></div>
    <div class="summary-row"><span>Guests</span><span>${bookingData.guests}</span></div>
    <div class="summary-row total"><span>Total</span><span>ZMW ${bookingData.total.toLocaleString()}</span></div>
  `;

  // Hide form, show success
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').classList.add('active');

  console.log('Booking submitted:', bookingData);
}

// Set minimum dates
function setMinDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const checkIn = document.getElementById('checkInDate');
  const checkOut = document.getElementById('checkOutDate');

  if (checkIn) checkIn.min = formatDate(today);
  if (checkOut) checkOut.min = formatDate(tomorrow);

  checkIn?.addEventListener('change', () => {
    const selectedDate = new Date(checkIn.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    checkOut.min = formatDate(selectedDate);
    if (checkOut.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
      checkOut.value = formatDate(selectedDate);
    }
    updateSummary();
  });

  checkOut?.addEventListener('change', updateSummary);
  document.getElementById('numGuests')?.addEventListener('change', updateSummary);
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
  // Reserve Now button
  const reserveBtn = document.querySelector('.reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => openBookingModal());
  }

  // Book Now buttons on room cards
  document.querySelectorAll('.book-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const room = e.target.dataset.room;
      const price = e.target.dataset.price;
      openBookingModal(room, price);
    });
  });

  // Close button
  const closeBtn = document.querySelector('.booking-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  // Close success button
  const closeSuccessBtn = document.querySelector('.close-success-btn');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeBookingModal);
  }

  // Close on overlay click
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Room selection change
  document.querySelectorAll('input[name="selectedRoom"]').forEach(input => {
    input.addEventListener('change', updateSummary);
  });

  // Form submission
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Set min dates
  setMinDates();
});

// Contact Form Handling
const inquiryForm = document.querySelector('#inquiryForm');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    inquiryForm.reset();
  });
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

console.log('Mutinta River Resort - Website loaded successfully 🦁');
