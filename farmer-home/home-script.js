// Initialize the home page when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    initializeCarousel();
    initializeTabs();
    initializeLiveUpdates();
    initializeCurrentTime();
    initializeInteractiveElements();
    initializeWeatherUpdates();
});

// Carousel functionality
function initializeCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const articleCards = document.querySelectorAll('.article-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const cardWidth = 280 + 15; // card width + gap
    
    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        carouselContainer.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update article cards
        articleCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next button
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % articleCards.length;
        updateCarousel();
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + articleCards.length) % articleCards.length;
        updateCarousel();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-advance carousel every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % articleCards.length;
        updateCarousel();
    }, 5000);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentIndex = (currentIndex + 1) % articleCards.length;
            } else {
                // Swipe right - previous
                currentIndex = (currentIndex - 1 + articleCards.length) % articleCards.length;
            }
            updateCarousel();
        }
    }
}

// Tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabName}-tab`);
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Live updates simulation
function initializeLiveUpdates() {
    // Simulate live price updates
    setInterval(() => {
        updateMandiPrices();
    }, 30000); // Update every 30 seconds
    
    // Simulate new offers/requirements
    setInterval(() => {
        addNewOffer();
    }, 60000); // Add new offer every minute
}

function updateMandiPrices() {
    const priceElements = document.querySelectorAll('.price');
    const trendElements = document.querySelectorAll('.trend');
    
    priceElements.forEach((priceEl, index) => {
        const currentPrice = parseInt(priceEl.textContent.replace(/[^\d]/g, ''));
        const change = Math.floor(Math.random() * 100) - 50; // Random change between -50 and +50
        const newPrice = Math.max(currentPrice + change, 100); // Ensure minimum price
        
        priceEl.textContent = `₹${newPrice.toLocaleString()}/quintal`;
        
        // Update trend indicator
        const trendEl = trendElements[index];
        if (trendEl) {
            if (change > 0) {
                trendEl.textContent = `↗ +₹${change}`;
                trendEl.className = 'trend up';
            } else if (change < 0) {
                trendEl.textContent = `↘ -₹${Math.abs(change)}`;
                trendEl.className = 'trend down';
            } else {
                trendEl.textContent = '→ Stable';
                trendEl.className = 'trend stable';
            }
        }
    });
}

function addNewOffer() {
    const offersContainer = document.getElementById('offers-tab');
    const newOffer = createRandomOffer();
    
    // Add new offer at the top
    offersContainer.insertBefore(newOffer, offersContainer.firstChild);
    
    // Remove oldest offer if more than 5 offers
    const offers = offersContainer.querySelectorAll('.offer-card');
    if (offers.length > 5) {
        offers[offers.length - 1].remove();
    }
    
    // Show notification
    showNotification('New offer available nearby!');
}

function createRandomOffer() {
    const offerTypes = ['SELLING', 'RENTING', 'BUYING', 'HIRING'];
    const products = ['Wheat', 'Cotton', 'Sugarcane', 'Vegetables', 'Tractor', 'Seeds'];
    const names = ['Ramesh Patel', 'Kishan Singh', 'Lakshmi Devi', 'Mohan Kumar', 'Rajesh Sharma'];
    
    const offerDiv = document.createElement('div');
    offerDiv.className = 'offer-card fade-in';
    offerDiv.innerHTML = `
        <div class="offer-header">
            <div class="offer-type">${offerTypes[Math.floor(Math.random() * offerTypes.length)]}</div>
            <span class="distance">${(Math.random() * 5).toFixed(1)}km away</span>
        </div>
        <h3>${products[Math.floor(Math.random() * products.length)]} - Available</h3>
        <p class="offer-details">Fresh product available for immediate pickup. Contact for details.</p>
        <div class="offer-meta">
            <span class="price">₹${Math.floor(Math.random() * 2000 + 500)}</span>
            <span class="seller">${names[Math.floor(Math.random() * names.length)]}</span>
            <span class="time">Just now</span>
        </div>
        <div class="offer-actions">
            <button class="contact-btn">Contact</button>
            <button class="save-btn"><i class="fas fa-bookmark"></i></button>
        </div>
    `;
    
    return offerDiv;
}

// Current time display
function initializeCurrentTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Interactive elements
function initializeInteractiveElements() {
    // Contact buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('contact-btn')) {
            showNotification('Connecting you to the seller...');
            setTimeout(() => {
                showNotification('Call connected!');
            }, 2000);
        }
        
        if (e.target.classList.contains('save-btn') || e.target.closest('.save-btn')) {
            const btn = e.target.closest('.save-btn');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'rgba(76, 175, 80, 0.3)';
            showNotification('Saved to favorites!');
        }
        
        if (e.target.classList.contains('attend-btn')) {
            e.target.textContent = 'Attending';
            e.target.style.background = '#27ae60';
            showNotification('You\'re attending the meeting!');
        }
        
        if (e.target.classList.contains('register-btn')) {
            e.target.textContent = 'Registered';
            e.target.style.background = '#27ae60';
            showNotification('Successfully registered for training!');
        }
    });
    
    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.querySelector('h3').textContent;
            showNotification(`Opening ${action}...`);
        });
    });
    
    // Article cards
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            showNotification(`Opening article: ${title}`);
        });
    });
}

// Weather updates
function initializeWeatherUpdates() {
    function updateWeather() {
        const temperature = document.querySelector('.temperature');
        const weatherIcon = document.querySelector('.weather-icon i');
        
        if (temperature && weatherIcon) {
            // Simulate weather changes
            const currentTemp = parseInt(temperature.textContent);
            const change = Math.floor(Math.random() * 6) - 3; // -3 to +3 degrees
            const newTemp = Math.max(20, Math.min(40, currentTemp + change));
            
            temperature.textContent = `${newTemp}°C`;
            
            // Update weather icon based on temperature
            if (newTemp < 25) {
                weatherIcon.className = 'fas fa-cloud';
            } else if (newTemp > 35) {
                weatherIcon.className = 'fas fa-sun';
            } else {
                weatherIcon.className = 'fas fa-cloud-sun';
            }
        }
    }
    
    // Update weather every 5 minutes
    setInterval(updateWeather, 300000);
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Pull to refresh functionality
let startY = 0;
let currentY = 0;
let pullDistance = 0;
const pullThreshold = 100;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', (e) => {
    if (window.scrollY === 0) {
        currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
            e.preventDefault();
            document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, pullThreshold)}px)`;
        }
    }
});

document.addEventListener('touchend', () => {
    if (pullDistance > pullThreshold) {
        // Trigger refresh
        showNotification('Refreshing...');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    // Reset
    document.body.style.transform = '';
    pullDistance = 0;
});

// Offline/Online status
window.addEventListener('online', () => {
    showNotification('Connection restored!');
});

window.addEventListener('offline', () => {
    showNotification('You\'re offline. Some features may not work.');
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance optimization - lazy loading images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        document.querySelector('.prev-btn').click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.next-btn').click();
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    document.querySelectorAll('.carousel-btn').forEach((btn, index) => {
        btn.setAttribute('aria-label', index === 0 ? 'Previous article' : 'Next article');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.setAttribute('aria-label', `Switch to ${btn.textContent} tab`);
    });
    
    // Add focus indicators
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #4CAF50';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
        });
    });
});
