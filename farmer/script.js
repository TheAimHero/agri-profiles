// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    initializeLiveUpdates();
    initializeAnimations();
});

// Initialize the land distribution map
function initializeMap() {
    // Create map centered on Gujarat, India
    const map = L.map('landMap').setView([22.2587, 71.1924], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define land parcels with different colors
    const landParcels = [
        {
            name: 'Agricultural Land - Wheat',
            coordinates: [
                [22.2587, 71.1924],
                [22.2587, 71.2024],
                [22.2487, 71.2024],
                [22.2487, 71.1924]
            ],
            color: '#4CAF50',
            area: '15 acres',
            crop: 'Wheat'
        },
        {
            name: 'Agricultural Land - Cotton',
            coordinates: [
                [22.2687, 71.1824],
                [22.2687, 71.1924],
                [22.2587, 71.1924],
                [22.2587, 71.1824]
            ],
            color: '#8BC34A',
            area: '12 acres',
            crop: 'Cotton'
        },
        {
            name: 'Agricultural Land - Sugarcane',
            coordinates: [
                [22.2487, 71.1824],
                [22.2487, 71.1924],
                [22.2387, 71.1924],
                [22.2387, 71.1824]
            ],
            color: '#CDDC39',
            area: '8.5 acres',
            crop: 'Sugarcane'
        },
        {
            name: 'Orchard',
            coordinates: [
                [22.2787, 71.1924],
                [22.2787, 71.2024],
                [22.2687, 71.2024],
                [22.2687, 71.1924]
            ],
            color: '#8BC34A',
            area: '5 acres',
            crop: 'Mango, Guava'
        },
        {
            name: 'Pasture',
            coordinates: [
                [22.2387, 71.2024],
                [22.2387, 71.2124],
                [22.2287, 71.2124],
                [22.2287, 71.2024]
            ],
            color: '#CDDC39',
            area: '3 acres',
            crop: 'Grass for livestock'
        },
        {
            name: 'Residential',
            coordinates: [
                [22.2587, 71.2124],
                [22.2587, 71.2224],
                [22.2487, 71.2224],
                [22.2487, 71.2124]
            ],
            color: '#FF9800',
            area: '2 acres',
            crop: 'House & Farm buildings'
        }
    ];

    // Add land parcels to map
    landParcels.forEach(parcel => {
        const polygon = L.polygon(parcel.coordinates, {
            color: parcel.color,
            weight: 2,
            fillColor: parcel.color,
            fillOpacity: 0.6
        }).addTo(map);

        // Add popup with land information
        polygon.bindPopup(`
            <div style="text-align: center;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${parcel.name}</h4>
                <p style="margin: 5px 0;"><strong>Area:</strong> ${parcel.area}</p>
                <p style="margin: 5px 0;"><strong>Crop/Use:</strong> ${parcel.crop}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #7f8c8d;">
                    Click for more details
                </p>
            </div>
        `);

        // Add hover effect
        polygon.on('mouseover', function () {
            this.setStyle({ fillOpacity: 0.8, weight: 3 });
        });
        polygon.on('mouseout', function () {
            this.setStyle({ fillOpacity: 0.6, weight: 2 });
        });
    });

    // Add markers for important locations
    const locations = [
        {
            name: 'Farm House',
            coordinates: [22.2537, 71.2174],
            icon: '🏠'
        },
        {
            name: 'Warehouse',
            coordinates: [22.2637, 71.1974],
            icon: '🏭'
        },
        {
            name: 'Borewell',
            coordinates: [22.2537, 71.1974],
            icon: '💧'
        },
        {
            name: 'Artificial Lake',
            coordinates: [22.2437, 71.1874],
            icon: '🏊'
        }
    ];

    locations.forEach(location => {
        const marker = L.marker(location.coordinates).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center;">
                <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${location.name}</h4>
                <p style="margin: 0; font-size: 24px;">${location.icon}</p>
            </div>
        `);
    });
}

// Initialize live updates for mandi prices
function initializeLiveUpdates() {
    // Simulate live price updates
    setInterval(() => {
        updateMandiPrices();
    }, 30000); // Update every 30 seconds

    // Update harvest timeline
    updateHarvestTimeline();
}

// Update mandi prices with realistic fluctuations
function updateMandiPrices() {
    const priceCards = document.querySelectorAll('.price-card');

    priceCards.forEach(card => {
        const priceElement = card.querySelector('.price');
        const trendElement = card.querySelector('.trend');
        const currentPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));

        // Generate random price change
        const change = Math.floor(Math.random() * 100) - 50; // -50 to +50
        const newPrice = Math.max(currentPrice + change, 1000); // Minimum price

        // Update price
        priceElement.textContent = `₹${newPrice.toLocaleString()}/quintal`;

        // Update trend
        if (change > 0) {
            trendElement.textContent = `↗ +₹${change}`;
            trendElement.className = 'trend up';
        } else if (change < 0) {
            trendElement.textContent = `↘ -₹${Math.abs(change)}`;
            trendElement.className = 'trend down';
        } else {
            trendElement.textContent = '→ Stable';
            trendElement.className = 'trend stable';
        }
    });
}

// Update harvest timeline
function updateHarvestTimeline() {
    const harvestItems = document.querySelectorAll('.harvest-item');

    harvestItems.forEach((item, index) => {
        const dateElement = item.querySelector('.harvest-date');
        const detailsElement = item.querySelector('.harvest-details p');

        // Calculate days from today
        const daysFromToday = index * 2 + 1;
        const harvestDate = new Date();
        harvestDate.setDate(harvestDate.getDate() + daysFromToday);

        // Update date display
        dateElement.textContent = `Day ${daysFromToday}`;

        // Add progress indicator
        const progress = Math.min((daysFromToday / 5) * 100, 100);
        item.style.background = `linear-gradient(90deg, rgba(76, 175, 80, 0.1) ${progress}%, white ${progress}%)`;
    });
}

// Initialize animations and interactions
function initializeAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add hover effects for cards
    document.querySelectorAll('.machinery-card, .water-card, .livestock-card, .business-card, .vehicle-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects for storage cards
    document.querySelectorAll('.storage-card').forEach(card => {
        card.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Add real-time clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Update any clock elements if they exist
    const clockElements = document.querySelectorAll('.clock');
    clockElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Update clock every second
setInterval(updateClock, 1000);

// Add search functionality
// function initializeSearch() {
//     const searchInput = document.createElement('input');
//     searchInput.type = 'text';
//     searchInput.placeholder = 'Search in dashboard...';
//     searchInput.className = 'search-input';
//     searchInput.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         padding: 10px 15px;
//         border: none;
//         border-radius: 25px;
//         background: rgba(255, 255, 255, 0.9);
//         backdrop-filter: blur(10px);
//         box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
//         z-index: 1000;
//         width: 250px;
//         font-size: 14px;
//     `;

//     document.body.appendChild(searchInput);

//     searchInput.addEventListener('input', function () {
//         const searchTerm = this.value.toLowerCase();
//         const sections = document.querySelectorAll('.section');

//         sections.forEach(section => {
//             const text = section.textContent.toLowerCase();
//             if (text.includes(searchTerm) || searchTerm === '') {
//                 section.style.display = 'block';
//             } else {
//                 section.style.display = 'none';
//             }
//         });
//     });
// }

// Initialize search when page loads
// document.addEventListener('DOMContentLoaded', function () {
//     initializeSearch();
// });

// Add export functionality
function exportDashboard() {
    const dashboardContent = document.querySelector('.container').innerHTML;
    const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Farmer Profile Dashboard - Export</title>
            <link href="styles.css" rel="stylesheet">
        </head>
        <body>
            ${dashboardContent}
        </body>
        </html>
    `], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'farmer-dashboard-export.html';
    a.click();
    URL.revokeObjectURL(url);
}

// Add print functionality
function printDashboard() {
    window.print();
}

// Add these functions to global scope for potential button usage
window.exportDashboard = exportDashboard;
window.printDashboard = printDashboard;

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printDashboard();
    }
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportDashboard();
    }
});

// Add notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 25px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        animation: slideDown 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Example usage of notifications
// showNotification('Dashboard updated successfully!', 'success');
// showNotification('New mandi prices available', 'info');
// showNotification('Connection error', 'error'); 