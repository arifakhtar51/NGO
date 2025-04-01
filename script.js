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
const html = document.documentElement;

// Check for saved language preference
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    html.setAttribute('data-language', savedLanguage);
    updateLanguageIcon(savedLanguage);
}

languageToggle.addEventListener('click', () => {
    const currentLanguage = html.getAttribute('data-language');
    const newLanguage = currentLanguage === 'hi' ? 'en' : 'hi';
    
    html.setAttribute('data-language', newLanguage);
    localStorage.setItem('language', newLanguage);
    updateLanguageIcon(newLanguage);
    
    // Update form placeholders
    updateFormPlaceholders(newLanguage);
});

function updateLanguageIcon(language) {
    const icon = languageToggle.querySelector('i');
    icon.className = language === 'hi' ? 'fas fa-globe-asia' : 'fas fa-language';
}

function updateFormPlaceholders(language) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-placeholder-${language}`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
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

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };

    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        // Always show both arrows for circular navigation
        prevButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden');
    };

    // Click events for next and previous buttons
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0]; // If last slide, go to first
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling || dots[0]; // If last dot, go to first
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });

    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // If first slide, go to last
        const currentDot = dotsNav.querySelector('.active');
        const prevDot = currentDot.previousElementSibling || dots[dots.length - 1]; // If first dot, go to last
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });

    // Click events for the nav indicators
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.active');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });

    // Auto-advance carousel
    let carouselInterval = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0]; // If last slide, go to first
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling || dots[0]; // If last dot, go to first
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    }, 5000);

    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    track.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling || slides[0]; // If last slide, go to first
            const currentDot = dotsNav.querySelector('.active');
            const nextDot = currentDot.nextElementSibling || dots[0]; // If last dot, go to first
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        }, 5000);
    });

    // Initialize first slide
    slides[0].classList.add('current-slide');
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