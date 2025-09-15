// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Here you would typically send the form data to a server
    console.log('Form submitted:', formObject);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .product-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial check for elements in view
window.addEventListener('load', animateOnScroll);
// Check for elements in view on scroll
window.addEventListener('scroll', animateOnScroll);

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextImage() {
        let nextIndex = (currentIndex + 1) % images.length;
        showImage(nextIndex);
    }

    function startCarousel() {
        interval = setInterval(nextImage, 5000); // Change image every 5 seconds
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    // Initialize carousel
    showImage(0);
    startCarousel();

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            showImage(index);
            startCarousel();
        });
    });

    // Pause carousel on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
});

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-info h3');
    const lightboxDesc = lightbox.querySelector('.lightbox-info p');
    const closeLightbox = lightbox.querySelector('.close-lightbox');

    // Add click event to all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h4').textContent;
            const desc = card.querySelector('p').textContent;

            // Update lightbox content
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;

            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}); 