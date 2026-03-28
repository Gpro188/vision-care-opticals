// Simple data loader - reads from file OR localStorage
// Automatically loads from data.json if available!

const DATA_SERVER_URL = 'http://localhost:3456/api/data'; // Local server for file read

// Cart array
let shoppingCart = [];

// Check if we're on homepage or frames page
const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Loading website data...');
    
    // Initialize Firebase first
    const firebaseInitialized = initializeFirebase();
    if (firebaseInitialized) {
        console.log('✅ Using Firebase as primary data source');
    } else {
        console.warn('⚠️ Firebase not initialized, will use fallback methods');
    }
    
    // Firefox fix - ensure localStorage is accessible
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ localStorage is accessible');
    } catch (e) {
        console.error('❌ localStorage is blocked in this browser');
        console.log('💡 Firefox users: Make sure "privacy.resistFingerprinting" is set to false');
        alert('⚠️ Browser storage is blocked! Please check your browser privacy settings or try Chrome/Edge.');
        return;
    }
    
    // Show loading message
    console.log('⏳ Fetching latest data...');
    
    // Load all data - Firebase first, then file, then localStorage
    await loadHeroSection();
    await loadSliderBanners();
    await loadBrandsCarousel();
    await loadFrames(isHomePage ? 'latest-home' : 'all'); // Special filter for homepage
    await loadServices();
    await loadAboutSection();
    await loadContactInfo();
    await loadSocialMedia();
    await loadLocationMap();
    await loadLogos(); // Load uploaded logos
    await loadOfferSlider(); // Load offer slider if active
    
    console.log('✅ All data loaded successfully!');
    
    // Load cart from localStorage
    loadCart();
    
    // Subscribe to real-time updates if Firebase is available
    if (firebaseInitialized) {
        subscribeToUpdates((freshData) => {
            console.log('🔄 Data updated from Firebase, refreshing UI...');
            // Optionally refresh the page or update specific elements
            // location.reload(); // Uncomment for auto-refresh on updates
        });
    }
});

async function getAdminData() {
    // PRIORITY 1: Try Firebase first (if initialized)
    if (typeof db !== 'undefined' && db) {
        try {
            const firebaseData = await loadFromFirebase();
            if (firebaseData) {
                console.log('✅ Loaded data from Firebase (cloud database)');
                return firebaseData;
            }
        } catch (error) {
            console.warn('⚠️ Firebase load failed, trying next method');
        }
    }
    
    // PRIORITY 2: ON VERCEL: Load directly from data.json file with cache busting
    try {
        // Use multiple cache-busting methods
        const timestamp = new Date().getTime();
        const random = Math.random();
        const cacheBuster = `?v=${timestamp}&r=${random}`;
        
        console.log('📡 Fetching data.json with cache buster:', cacheBuster);
        
        const response = await fetch('data.json' + cacheBuster, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                console.log('✅ Loaded fresh data from data.json file');
                console.log('📊 Data contains:', Object.keys(data).join(', '));
                return data;
            } else {
                console.warn('⚠️ data.json is empty');
            }
        } else {
            console.error('❌ Failed to load data.json, status:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ Could not load from data.json:', error.message);
    }
    
    // PRIORITY 3: LOCAL ONLY: Try localhost server (for development)
    try {
        const response = await fetch(DATA_SERVER_URL);
        if (response.ok) {
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                console.log('✅ Loaded data from local server');
                return data;
            }
        }
    } catch (error) {
        // Server not available
    }
    
    // PRIORITY 4: LAST RESORT: localStorage fallback
    let data = localStorage.getItem('visionCareAdminData');
    if (!data) {
        data = localStorage.getItem('visionCareData');
    }
    
    if (!data) {
        console.warn('⚠️ No admin data found. Using emergency fallback.');
        // EMERGENCY FALLBACK: Hardcoded WhatsApp number for orders
        return {
            contact: {
                whatsapp: '+919961210556',
                phone: '+919961210556',
                email: 'vcopticalsparambilpeedika@gmail.com',
                address: 'Parambil Peedika',
                hours: 'Mon-Sat: 9:00 AM - 7:30 PM'
            }
        };
    }
    
    try {
        const parsed = JSON.parse(data);
        console.log('✅ Loaded data from localStorage (cached version)');
        return parsed;
    } catch (e) {
        console.error('❌ Error parsing admin data:', e);
        return null;
    }
}

async function loadHeroSection() {
    const data = await getAdminData();
    if (data && data.hero) {
        document.getElementById('heroTitle').textContent = data.hero.title || 'Welcome to Vision Care';
        document.getElementById('heroSubtitle').textContent = data.hero.subtitle || 'Your vision is our priority';
    }
}

// Load Logos from localStorage
async function loadLogos() {
    const data = await getAdminData();
    
    // Load header logo
    const headerLogoEl = document.getElementById('headerLogo');
    if (headerLogoEl && data && data.logos && data.logos.header && data.logos.header.data) {
        headerLogoEl.src = data.logos.header.data;
        console.log('✅ Header logo loaded');
    }
    
    // Load footer logo
    const footerLogoEl = document.getElementById('footerLogo');
    if (footerLogoEl && data && data.logos && data.logos.footer && data.logos.footer.data) {
        footerLogoEl.src = data.logos.footer.data;
        console.log('✅ Footer logo loaded');
    }
}

async function loadSliderBanners() {
    const data = await getAdminData();
    const sliderContainer = document.getElementById('heroSlider');
    
    if (!data || !data.slider || !data.slider.slides || data.slider.slides.length === 0) {
        console.log('ℹ️ No slider banners configured');
        // Create default slide if none exist
        sliderContainer.innerHTML = `
            <div class="slide active" style="background-image: url('https://images.unsplash.com/photo-1570222094114-28a9d88a27e6?w=1920&h=1080&fit=crop')">
            </div>
        `;
        return;
    }
    
    const interval = (data.slider.interval || 3) * 1000;
    let currentSlide = 0;
    const slides = data.slider.slides;
    
    // Create slide elements
    slides.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = 'slide' + (index === 0 ? ' active' : '');
        
        let backgroundStyle = '';
        if (slide.bgImage) {
            backgroundStyle = `background-image: url('${slide.bgImage}')`;
        } else if (slide.bgColor) {
            backgroundStyle = `background: linear-gradient(135deg, ${slide.bgColor} 0%, ${slide.bgColor}99 100%)`;
        } else {
            backgroundStyle = 'background: linear-gradient(135deg, #453982 0%, #2d2555 100%)';
        }
        
        slideEl.style = backgroundStyle;
        sliderContainer.appendChild(slideEl);
    });
    
    // Auto-rotate slides
    if (slides.length > 1) {
        setInterval(() => {
            const slideElements = sliderContainer.querySelectorAll('.slide');
            slideElements[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slideElements[currentSlide].classList.add('active');
        }, interval);
    }
    
    console.log(`✅ Loaded ${slides.length} hero slider banners`);
}

async function loadFrames(filter = 'all') {
    const data = await getAdminData();
    const framesGrid = document.getElementById('framesGrid');
    
    if (!data || !data.frames) {
        console.log('ℹ️ No frames configured');
        return;
    }
    
    let frames = [];
    
    // Special filter for homepage - show only 3 latest
    if (filter === 'latest-home') {
        frames = (data.frames.latest || []).slice(0, 3); // Only first 3
    } else if (filter === 'all') {
        frames = [...(data.frames.latest || []), ...(data.frames.trending || [])];
    } else if (filter === 'latest') {
        frames = data.frames.latest || [];
    } else if (filter === 'trending') {
        frames = data.frames.trending || [];
    }
    
    // Clear grid
    framesGrid.innerHTML = '';
    
    if (frames.length === 0) {
        framesGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No frames in this category yet.</p>';
        return;
    }
    
    frames.forEach((frame, index) => {
        const frameCard = document.createElement('div');
        frameCard.className = `frame-card ${frame.category}`;
        frameCard.dataset.category = frame.category;
        
        // Get image dimensions if available
        const imageSize = frame.imageSize ? `(${frame.imageSize.width}x${frame.imageSize.height})` : '';
        
        frameCard.innerHTML = `
            <img src="${frame.image || 'https://via.placeholder.com/300x200?text=Frame'}" 
                 alt="${frame.name || 'Frame'}" 
                 class="frame-image"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Frame'">
            <div class="frame-info">
                <h3>${frame.name || 'Unknown Frame'}</h3>
                ${frame.category ? `<p class="category-tag">${frame.category === 'latest' ? '✨ Latest' : '🔥 Trending'}</p>` : ''}
                ${imageSize ? `<p class="image-size"><small>${imageSize}</small></p>` : ''}
                ${frame.price ? `<p class="price">₹${frame.price}</p>` : ''}
                <button class="add-to-cart-btn" onclick="addToCart('${frame.category}', ${index}, '${frame.name.replace(/'/g, "\\'")}', ${frame.price || 0}, '${frame.image}')">
                    🛒 Add to Cart
                </button>
                <button class="whatsapp-direct-btn" onclick="orderFrameWhatsApp('${frame.name.replace(/'/g, "\\'")}', ${frame.price || 0}, '${frame.image}')">
                    📱 Order on WhatsApp
                </button>
            </div>
        `;
        framesGrid.appendChild(frameCard);
    });
    
    console.log(`✅ Loaded ${frames.length} frames`);
}

async function loadServices() {
    const data = await getAdminData();
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (!data || !data.services || data.services.length === 0) {
        console.log('ℹ️ No services configured');
        return;
    }
    
    data.services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        // Check if description is long (more than 100 characters)
        const isLongText = service.description && service.description.length > 100;
        const shortDesc = isLongText ? service.description.substring(0, 100) + '...' : (service.description || '');
        
        serviceCard.innerHTML = `
            ${service.image ? `<img src="${service.image}" alt="${service.title}" class="service-image">` : ''}
            <h3>${service.title}</h3>
            <div class="service-text-container">
                <p class="service-description" id="serviceDesc-${index}">
                    ${shortDesc}
                </p>
                ${isLongText ? `<button class="read-more-btn" onclick="toggleReadMore(${index})">Read More</button>` : ''}
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
    });
    
    console.log(`✅ Loaded ${data.services.length} services with read more functionality`);
}

async function loadAboutSection() {
    const data = await getAdminData();
    
    if (!data || !data.about) {
        console.log('ℹ️ No about section configured');
        return;
    }
    
    if (data.about.title) {
        document.getElementById('aboutTitle').textContent = data.about.title;
    }
    
    if (data.about.text1) {
        document.getElementById('aboutText1').textContent = data.about.text1;
    }
    
    if (data.about.text2) {
        document.getElementById('aboutText2').textContent = data.about.text2;
    }
    
    if (data.about.imageUrl) {
        const aboutImage = document.getElementById('aboutImage');
        aboutImage.src = data.about.imageUrl;
        aboutImage.style.display = 'block';
    }
    
    console.log('✅ Loaded About section');
}

async function loadContactInfo() {
    const data = await getAdminData();
    const contactInfo = document.getElementById('contactInfo');
    
    if (!data || !data.contact) {
        contactInfo.innerHTML = `
            <p>📍 123 Main Street, Your City</p>
            <p>📞 +1 234 567 8900</p>
            <p>💬 WhatsApp: +1 234 567 8900</p>
            <p>✉️ info@visioncare.com</p>
            <p>🕐 Mon-Sat: 9:00 AM - 8:00 PM</p>
        `;
        return;
    }
    
    const contact = data.contact;
    let html = '';
    
    if (contact.address) html += `<p>📍 ${contact.address}</p>`;
    if (contact.phone) html += `<p>📞 ${contact.phone}</p>`;
    if (contact.whatsapp) html += `<p>💬 WhatsApp: <a href="https://wa.me/${contact.whatsapp.replace(/\s/g, '')}" target="_blank" style="color: #25d366; text-decoration: none; font-weight: bold;">${contact.whatsapp}</a></p>`;
    if (contact.email) html += `<p>✉️ ${contact.email}</p>`;
    if (contact.hours) html += `<p>🕐 ${contact.hours}</p>`;
    
    contactInfo.innerHTML = html || '<p>Add your contact info in admin panel</p>';
    console.log('✅ Loaded Contact info');
}

async function loadBrandsCarousel() {
    const data = await getAdminData();
    const carousel = document.getElementById('brandsCarousel');
    
    if (!data || !data.brands || data.brands.length === 0) {
        // Default brands if none configured
        const defaultBrands = ['Ray-Ban', 'Oakley', 'Prada', 'Gucci', 'Tom Ford', 'Armani'];
        renderBrands(defaultBrands, carousel);
        return;
    }
    
    renderBrands(data.brands, carousel);
    console.log(`✅ Loaded ${data.brands.length} brands`);
}

function renderBrands(brandList, container) {
    // Duplicate the array for seamless looping
    const allBrands = [...brandList, ...brandList];
    
    let html = '<div class="brand-track">';
    
    allBrands.forEach((brand, index) => {
        const brandName = typeof brand === 'string' ? brand : (brand.name || 'Brand');
        const brandLogo = typeof brand === 'object' && brand.logoUrl ? brand.logoUrl : null;
        
        html += `
            <div class="brand-item">
                ${brandLogo ? `<img src="${brandLogo}" alt="${brandName}">` : `<span>${brandName}</span>`}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

async function loadSocialMedia() {
    const data = await getAdminData();
    const footerSocial = document.getElementById('footerSocial');
    
    // Only load social media in footer (not in contact section)
    if (!data || !data.social || data.social.length === 0) {
        // Default social links for footer only
        const defaultSocial = [
            { platform: 'facebook', icon: '📘', url: '#' },
            { platform: 'instagram', icon: '📷', url: '#' },
            { platform: 'twitter', icon: '🐦', url: '#' },
            { platform: 'whatsapp', icon: '💬', url: '#' }
        ];
        renderSocialLinks(defaultSocial, footerSocial);
        return;
    }
    
    renderSocialLinks(data.social, footerSocial);
    console.log('✅ Loaded Social Media links in footer only');
}

function renderSocialLinks(socialList, container) {
    if (!container) return;
    
    let html = '';
    
    socialList.forEach(item => {
        const platform = item.platform || 'facebook';
        const icon = item.icon || '🔗';
        const url = item.url || '#';
        
        html += `<a href="${url}" class="social-link ${platform}" target="_blank" rel="noopener">${icon}</a>`;
    });
    
    container.innerHTML = html;
}

async function loadLocationMap() {
    const data = await getAdminData();
    const mapContainer = document.getElementById('mapContainer');
    
    if (!data || !data.location) {
        // Default location (you can change this)
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890"
                allowfullscreen="" 
                loading="lazy">
            </iframe>
        `;
        return;
    }
    
    // Custom location from admin
    const location = data.location;
    if (location.embedCode) {
        mapContainer.innerHTML = location.embedCode;
    } else if (location.address) {
        // Generate Google Maps embed URL
        const encodedAddress = encodeURIComponent(location.address);
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${location.lng || -73.98}!3d${location.lat || 40.75}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodedAddress}!3m2!1s0x0%3A0x0!2z${encodedAddress}!5e0!3m2!1sen!2sus!4v1234567890"
                allowfullscreen="" 
                loading="lazy">
            </iframe>
        `;
    }
    
    console.log('✅ Loaded Location Map');
}

// Filter function
function filterFrames(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload frames with filter
    loadFrames(category);
}

// Read More Toggle Function for Services
function toggleReadMore(index) {
    const descElement = document.getElementById(`serviceDesc-${index}`);
    const serviceCard = descElement.closest('.service-card');
    const readMoreBtn = serviceCard.querySelector('.read-more-btn');
    
    if (!descElement || !readMoreBtn) return;
    
    // Get the full description from the data
    const data = getAdminData();
    if (!data || !data.services || !data.services[index]) return;
    
    const fullDescription = data.services[index].description || '';
    const shortDescription = fullDescription.substring(0, 100) + '...';
    
    // Toggle expanded state
    if (serviceCard.classList.contains('text-expanded')) {
        // Collapse
        descElement.textContent = shortDescription;
        readMoreBtn.textContent = 'Read More';
        serviceCard.classList.remove('text-expanded');
    } else {
        // Expand
        descElement.textContent = fullDescription;
        readMoreBtn.textContent = 'Read Less';
        serviceCard.classList.add('text-expanded');
    }
}

// Cart functions
function loadCart() {
    const savedCart = localStorage.getItem('visionCareCart');
    if (savedCart) {
        shoppingCart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('visionCareCart', JSON.stringify(shoppingCart));
    updateCartDisplay();
}

function addToCart(category, index, name, price, image) {
    const item = {
        id: Date.now(),
        category,
        index,
        name,
        price,
        image
    };
    
    shoppingCart.push(item);
    saveCart();
    
    // Show notification
    showNotification(`Added ${name} to cart! ✅`);
}

function removeFromCart(itemId) {
    shoppingCart = shoppingCart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count
    cartCount.textContent = shoppingCart.length;
    
    // Update items list
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Your cart is empty</p>';
    } else {
        let html = '';
        let total = 0;
        
        shoppingCart.forEach(item => {
            total += item.price;
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = total.toFixed(2);
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

function checkoutWhatsApp() {
    if (shoppingCart.length === 0) {
        alert('Your cart is empty! Add some frames first.');
        return;
    }
    
    // Get WhatsApp number - with emergency fallback
    const data = getAdminData();
    const whatsappNumber = (data && data.contact && data.contact.whatsapp) || '+919961210556';
    
    console.log('📱 Sending order to WhatsApp:', whatsappNumber);
    
    // Build message
    let message = '*New Order - Vision Care*\n\n';
    message += 'Customer Details:\n';
    message += '- Name: [Your Name]\n';
    message += '- Phone: [Your Phone]\n\n';
    message += 'Order Items:\n';
    
    let total = 0;
    shoppingCart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ₹${item.price}\n`;
        total += item.price;
    });
    
    message += `\n*Total: ₹${total.toFixed(2)}*`;
    message += '\n\nPlease confirm my order. Thank you!';
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/\s/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    console.log('🔗 Opening WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
}

// Direct WhatsApp order for individual frame
function orderFrameWhatsApp(frameName, framePrice, frameImage) {
    // Get WhatsApp number - with emergency fallback
    const data = getAdminData();
    const whatsappNumber = (data && data.contact && data.contact.whatsapp) || '+919961210556';
    
    console.log('📱 Sending frame inquiry to WhatsApp:', whatsappNumber);
    
    // Build message for single frame
    let message = '*Frame Inquiry - Vision Care*\n\n';
    message += 'I am interested in this frame:\n\n';
    message += `📦 *${frameName}*\n`;
    message += `💰 Price: ₹${framePrice}\n`;
    if (frameImage && frameImage !== 'https://via.placeholder.com/300x200?text=Frame') {
        message += `🖼️ Image: ${frameImage}\n`;
    }
    message += '\nPlease provide more details about this frame. Thank you!';
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/\s/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    console.log('🔗 Opening WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
}

// Book Appointment via WhatsApp
function bookAppointment() {
    // Get WhatsApp number - with emergency fallback
    const data = getAdminData();
    const whatsappNumber = (data && data.contact && data.contact.whatsapp) || '+919961210556';
    
    console.log('📱 Booking appointment via WhatsApp:', whatsappNumber);
    
    // Build appointment booking message
    let message = '*Appointment Request - Vision Care*\n\n';
    message += 'Hi! I would like to book an appointment for:\n\n';
    message += '📅 *Service Needed:* [Please specify - Eye Test/Frame Fitting/Other]\n';
    message += '👤 *My Name:* [Your Name]\n';
    message += '📞 *My Phone:* [Your Phone Number]\n';
    message += '🗓️ *Preferred Date:* [Preferred Date]\n';
    message += '⏰ *Preferred Time:* [Morning/Afternoon/Evening]\n\n';
    message += 'Please confirm the appointment. Thank you!';
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/\s/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    console.log('🔗 Opening WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Offer Slider Functions
async function loadOfferSlider() {
    const data = await getAdminData();
    
    if (!data || !data.offers || !data.offers.active) {
        // No active offers, hide slider
        const offerContainer = document.getElementById('offerSliderContainer');
        if (offerContainer) {
            offerContainer.style.display = 'none';
        }
        return;
    }
    
    // Check if offer is within date range
    const currentDate = new Date();
    const startDate = data.offers.startDate ? new Date(data.offers.startDate) : null;
    const endDate = data.offers.endDate ? new Date(data.offers.endDate) : null;
    
    if (startDate && endDate) {
        if (currentDate < startDate || currentDate > endDate) {
            // Offer period has not started or has ended
            const offerContainer = document.getElementById('offerSliderContainer');
            if (offerContainer) {
                offerContainer.style.display = 'none';
            }
            return;
        }
    }
    
    // Show offer slider and load offers
    const offerContainer = document.getElementById('offerSliderContainer');
    const offerTrack = document.getElementById('offerSliderTrack');
    
    if (offerContainer && offerTrack && data.offers.items && data.offers.items.length > 0) {
        offerContainer.style.display = 'block';
        
        // Create offer slides with images (image only, no text)
        const slidesHTML = data.offers.items.map(offer => {
            return `
                <div class="offer-slide">
                    <img src="${offer.image}" alt="Offer" class="offer-slide-image" onerror="this.parentElement.style.display='none'">
                </div>
            `;
        }).join('');
        
        // Duplicate slides for seamless infinite scroll
        offerTrack.innerHTML = slidesHTML + slidesHTML;
    }
}

function closeOfferSlider() {
    const offerContainer = document.getElementById('offerSliderContainer');
    if (offerContainer) {
        offerContainer.style.display = 'none';
        // Optionally save user preference to not show again
        sessionStorage.setItem('offerSliderClosed', 'true');
    }
}

// Function to check if user closed the slider in this session
function checkOfferSliderPreference() {
    const closed = sessionStorage.getItem('offerSliderClosed');
    if (closed === 'true') {
        const offerContainer = document.getElementById('offerSliderContainer');
        if (offerContainer) {
            offerContainer.style.display = 'none';
        }
    }
}

// Reset offer slider preference on page reload (optional)
// Uncomment if you want slider to show again on each page load
// window.addEventListener('beforeunload', () => {
//     sessionStorage.removeItem('offerSliderClosed');
// });
