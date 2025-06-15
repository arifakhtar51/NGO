// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme);
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);
});

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Language Toggle
const languageToggle = document.getElementById('languageToggle');

// Check for saved language preference
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    body.classList.add(savedLanguage);
    updateLanguageIcon(savedLanguage);
}

languageToggle.addEventListener('click', () => {
    body.classList.toggle('hindi');
    
    // Update placeholders
    document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]').forEach(element => {
        if (body.classList.contains('hindi')) {
            element.placeholder = element.dataset.placeholderHi;
        } else {
            element.placeholder = element.dataset.placeholderEn;
        }
    });
    
    // Force a reflow to ensure transitions work properly
    void body.offsetWidth;
});

function updateLanguageIcon(language) {
    const icon = languageToggle.querySelector('i');
    icon.className = language === 'hi' ? 'fas fa-globe-asia' : 'fas fa-language';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based navbar background
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'var(--nav-bg)';
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;

    const moveToSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(prevIndex);
    };

    // Click events for next and previous buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Click events for the nav indicators
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const targetIndex = dots.findIndex(dot => dot === targetDot);
        if (targetIndex !== -1) {
            moveToSlide(targetIndex);
        }
    });

    // Auto-advance carousel
    let carouselInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    track.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });

    // Initialize first slide
    moveToSlide(0);
});

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Load and display events on the main page
function loadMainPageEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventsGrid = document.getElementById('mainEventsGrid');
    
    if (!eventsGrid) return; // Only proceed if we're on the main page
    
    eventsGrid.innerHTML = '';
    
    if (events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-events">
                <p class="en">No upcoming events at the moment. Please check back later!</p>
                <p class="hi">अभी कोई आगामी कार्यक्रम नहीं है। कृपया बाद में पुनः जांच करें!</p>
            </div>
        `;
        return;
    }

    events.forEach(event => {
        const eventCard = createMainEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

function createMainEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-image">
        <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p class="event-description">${event.description}</p>
        </div>
    `;
    return card;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadMainPageEvents();
});

// Past Events Carousel
const pastEventsCarousel = document.querySelector('.events-carousel');
if (pastEventsCarousel) {
    const track = pastEventsCarousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = pastEventsCarousel.querySelector('.carousel-button.next');
    const prevButton = pastEventsCarousel.querySelector('.carousel-button.prev');
    const dotsNav = pastEventsCarousel.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    // Set initial position
    slides[0].classList.add('current-slide');
    slides[1]?.classList.add('next-slide');
    slides[slides.length - 1]?.classList.add('prev-slide');

    // Function to update slide classes
    const updateSlideClasses = (currentIndex) => {
        slides.forEach((slide, index) => {
            slide.classList.remove('current-slide', 'next-slide', 'prev-slide');
        });

        slides[currentIndex].classList.add('current-slide');
        
        const nextIndex = (currentIndex + 1) % slides.length;
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        
        slides[nextIndex].classList.add('next-slide');
        slides[prevIndex].classList.add('prev-slide');
    };

    // Function to move slides
    const moveToSlide = (targetIndex) => {
        updateSlideClasses(targetIndex);
        
        // Update dots
        const currentDot = dotsNav.querySelector('.active');
        currentDot.classList.remove('active');
        dots[targetIndex].classList.add('active');
    };

    // When I click next button, move slides to the right
    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const currentIndex = slides.indexOf(currentSlide);
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    });

    // When I click prev button, move slides to the left
    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const currentIndex = slides.indexOf(currentSlide);
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(prevIndex);
    });

    // When I click the nav indicators, move to that slide
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const targetIndex = parseInt(targetDot.dataset.index);
        moveToSlide(targetIndex);
    });

    // Auto advance slides
    let autoAdvanceInterval = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide');
        const currentIndex = slides.indexOf(currentSlide);
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    }, 5000);

    // Pause auto advance on hover
    pastEventsCarousel.addEventListener('mouseenter', () => {
        clearInterval(autoAdvanceInterval);
    });

    pastEventsCarousel.addEventListener('mouseleave', () => {
        autoAdvanceInterval = setInterval(() => {
            const currentSlide = track.querySelector('.current-slide');
            const currentIndex = slides.indexOf(currentSlide);
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        }, 5000);
    });
} 