// Simple Admin Panel - Automatic File Save!

let adminData = {};
const DATA_SERVER_URL = 'http://localhost:3456/api/data'; // Local server for file save

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎛️ Admin panel loaded');
    
    // Check server status
    await checkServerStatus();
    
    // Firefox fix - ensure localStorage is accessible
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ localStorage is accessible in admin panel');
    } catch (e) {
        console.error('❌ localStorage is blocked in Firefox');
        alert('⚠️ Firefox has blocked localStorage! Please enable it in settings or use Chrome/Edge.');
        return;
    }
    
    // Load existing data
    await loadExistingData();
    
    // Setup navigation
    setupNavigation();
    
    // Update dashboard counts
    updateDashboard();
});

// Check if data server is running
async function checkServerStatus() {
    const statusIcon = document.getElementById('serverStatusIcon');
    const statusText = document.getElementById('serverStatusText');
    const statusBox = document.getElementById('serverStatus');
    
    try {
        const response = await fetch(DATA_SERVER_URL);
        if (response.ok) {
            statusIcon.textContent = '✅';
            statusText.innerHTML = '<strong>Auto-Save Active!</strong> All changes saved to data.json';
            statusBox.style.background = '#d4edda';
            statusBox.style.border = '1px solid #c3e6cb';
            console.log('✅ Data server is running');
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        statusIcon.textContent = '⚠️';
        statusText.innerHTML = '<strong>Server Not Running!</strong> Start START-SERVER.bat for auto-save';
        statusBox.style.background = '#fff3cd';
        statusBox.style.border = '1px solid #ffc107';
        console.log('⚠️ Data server not available');
        
        // Show startup message
        setTimeout(() => {
            alert('📋 QUICK START:\n\n1. Close this alert\n2. Double-click "START-SERVER.bat" in the vision care folder\n3. Keep the server window open\n4. Refresh this page\n\nYour data will be automatically saved to data.json file!');
        }, 500);
    }
}

async function loadExistingData() {
    // Try to load from file server first (most recent)
    const loadedFromFile = await loadDataFromFile();
    
    if (!loadedFromFile) {
        // Fall back to localStorage
        let stored = localStorage.getItem('visionCareAdminData');
        if (!stored) {
            stored = localStorage.getItem('visionCareData');
        }
        
        if (stored) {
            try {
                adminData = JSON.parse(stored);
                console.log('✅ Loaded existing data from localStorage');
                
                // Populate forms
                populateForms();
                return;
            } catch (e) {
                console.error('❌ Error loading data:', e);
                adminData = {};
            }
        } else {
            console.log('ℹ️ Starting fresh - no existing data');
            adminData = {};
        }
    }
    
    // Populate forms if loaded from file or localStorage
    populateForms();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active to clicked
            link.classList.add('active');
            const target = link.getAttribute('href').substring(1);
            document.getElementById(target).classList.add('active');
        });
    });
}

function populateForms() {
    // Hero Section
    if (adminData.hero) {
        document.getElementById('heroTitle').value = adminData.hero.title || '';
        document.getElementById('heroSubtitle').value = adminData.hero.subtitle || '';
    }
    
    // About Section
    if (adminData.about) {
        document.getElementById('aboutTitle').value = adminData.about.title || '';
        document.getElementById('aboutText1').value = adminData.about.text1 || '';
        document.getElementById('aboutText2').value = adminData.about.text2 || '';
        
        if (adminData.about.imageUrl) {
            const preview = document.getElementById('aboutImagePreview');
            preview.src = adminData.about.imageUrl;
            preview.style.display = 'block';
        }
    }
    
    // Contact Section
    if (adminData.contact) {
        document.getElementById('contactAddress').value = adminData.contact.address || '';
        document.getElementById('contactPhone').value = adminData.contact.phone || '';
        document.getElementById('contactEmail').value = adminData.contact.email || '';
        document.getElementById('contactHours').value = adminData.contact.hours || '';
    }
    
    // Slider Settings
    if (adminData.slider) {
        document.getElementById('sliderInterval').value = adminData.slider.interval || 3;
    }
    
    // Colors
    if (adminData.colors) {
        document.getElementById('primaryColor').value = adminData.colors.primary || '#453982';
        document.getElementById('secondaryColor').value = adminData.colors.secondary || '#2d2555';
    }
    
    // Update lists
    updateSlidesList();
    updateFramesList();
    updateServicesList();
    updateDashboard();
}

async function saveData() {
    console.log('💾 Starting save process...');
    console.log('Current adminData.about:', adminData.about);
    
    // Always save to localStorage
    try {
        localStorage.setItem('visionCareAdminData', JSON.stringify(adminData));
        localStorage.setItem('visionCareData', JSON.stringify(adminData));
        console.log('✅ Data saved to localStorage');
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
    
    // ALSO save to local file automatically via server
    const fileSaved = await saveToFile();
    
    if (fileSaved) {
        console.log('✅ Data saved to file successfully');
        showNotification('Saved successfully! ✅');
        updateDashboard();
        return true;
    } else {
        console.error('❌ Failed to save to file');
        showNotification('⚠️ Saved to browser only (server not running)');
        updateDashboard();
        return false;
    }
}

// Save data to local JSON file via HTTP server
async function saveToFile() {
    try {
        console.log('📡 Sending data to server...');
        console.log('Data being saved:', JSON.stringify(adminData, null, 2).substring(0, 500) + '...');
        
        const response = await fetch(DATA_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('📁 Data saved to file:', result.message);
            
            // Verify the save by reading back
            const verifyResponse = await fetch(DATA_SERVER_URL);
            if (verifyResponse.ok) {
                const savedData = await verifyResponse.json();
                console.log('✅ Verification - Data read back from server');
                console.log('About section in saved data:', savedData.about);
                
                if (!savedData.about || Object.keys(savedData.about).length === 0) {
                    console.error('⚠️ WARNING: About section is empty after save!');
                }
            }
            
            return true;
        } else {
            console.error('❌ Server responded with error:', response.status);
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('❌ Error saving to file:', error);
        console.log('💡 Make sure data-server.js is running!');
        return false;
    }
}

// Load data from file on startup
async function loadDataFromFile() {
    try {
        const response = await fetch(DATA_SERVER_URL);
        if (response.ok) {
            const fileData = await response.json();
            if (fileData && Object.keys(fileData).length > 0) {
                adminData = fileData;
                console.log('✅ Loaded data from file');
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('ℹ️ Data server not available, using localStorage only');
        return false;
    }
}

function showNotification(message) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateDashboard() {
    const sliderCount = adminData.slider?.slides?.length || 0;
    const framesCount = (adminData.frames?.latest?.length || 0) + (adminData.frames?.trending?.length || 0);
    const servicesCount = adminData.services?.length || 0;
    const brandsCount = adminData.brands?.length || 0;
    const offersCount = adminData.offers?.active ? (adminData.offers.items?.length || 0) : 0;
    
    document.getElementById('sliderCount').textContent = `${sliderCount} slides`;
    document.getElementById('framesCount').textContent = `${framesCount} frames`;
    document.getElementById('servicesCount').textContent = `${servicesCount} services`;
    
    // Add brands count if element exists
    const brandsCountEl = document.getElementById('brandsCount');
    if (brandsCountEl) {
        brandsCountEl.textContent = `${brandsCount} brands`;
    }
    
    // Add offers count if element exists
    const offersCountEl = document.getElementById('offersCount');
    if (offersCountEl) {
        offersCountEl.textContent = `${offersCount} offers`;
    }
}

// Hero Section - Save Function
function saveHero() {
    adminData.hero = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value
    };
    
    saveData();
    alert('✅ Hero Section saved successfully!');
}

// Hero Section - Delete Function
function deleteHero() {
    if (confirm('🫠 Are you sure you want to delete the Hero Section data?\n\nThis will remove:\n- Main Title\n- Subtitle\n\nYou can add new data anytime.')) {
        adminData.hero = {};
        saveData();
        
        // Clear form fields
        document.getElementById('heroTitle').value = '';
        document.getElementById('heroSubtitle').value = '';
        
        alert('🗑️ Hero Section deleted successfully!');
    }
}

// Hero Section - Load existing data on page load
function loadHeroData() {
    if (adminData.hero) {
        document.getElementById('heroTitle').value = adminData.hero.title || '';
        document.getElementById('heroSubtitle').value = adminData.hero.subtitle || '';
    }
}

// Call loadHeroData when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeroData);
} else {
    loadHeroData();
}

// ========================================
// LOGO UPLOAD FUNCTIONS
// ========================================

// Upload Header Logo
function uploadHeaderLogo() {
    const fileInput = document.getElementById('headerLogoInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('⚠️ Please select a logo file first!');
        return;
    }
    
    // Validate file type
    if (!file.type.match('image/(png|jpeg)')) {
        alert('⚠️ Please select a PNG or JPG image file!');
        return;
    }
    
    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
        alert('⚠️ File size must be less than 500KB!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create image to get dimensions
        const img = new Image();
        img.onload = function() {
            adminData.logos = adminData.logos || {};
            adminData.logos.header = {
                data: e.target.result,
                width: img.width,
                height: img.height,
                uploadedAt: new Date().toISOString()
            };
            
            saveData();
            showNotification('✅ Header logo uploaded successfully!');
            
            // Show preview
            document.getElementById('headerLogoImg').src = e.target.result;
            document.getElementById('headerLogoPreview').style.display = 'block';
            
            // Clear file input
            fileInput.value = '';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Remove Header Logo
function removeHeaderLogo() {
    if (confirm('🫠 Are you sure you want to remove the header logo?')) {
        if (adminData.logos && adminData.logos.header) {
            delete adminData.logos.header;
            saveData();
            
            document.getElementById('headerLogoPreview').style.display = 'none';
            document.getElementById('headerLogoImg').src = '';
            document.getElementById('headerLogoInput').value = '';
            
            showNotification('🗑️ Header logo removed successfully!');
        }
    }
}

// Upload Footer Logo
function uploadFooterLogo() {
    const fileInput = document.getElementById('footerLogoInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('⚠️ Please select a logo file first!');
        return;
    }
    
    // Validate file type
    if (!file.type.match('image/(png|jpeg)')) {
        alert('⚠️ Please select a PNG or JPG image file!');
        return;
    }
    
    // Validate file size (max 300KB)
    if (file.size > 300 * 1024) {
        alert('⚠️ File size must be less than 300KB!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create image to get dimensions
        const img = new Image();
        img.onload = function() {
            adminData.logos = adminData.logos || {};
            adminData.logos.footer = {
                data: e.target.result,
                width: img.width,
                height: img.height,
                uploadedAt: new Date().toISOString()
            };
            
            saveData();
            showNotification('✅ Footer logo uploaded successfully!');
            
            // Show preview
            document.getElementById('footerLogoImg').src = e.target.result;
            document.getElementById('footerLogoPreview').style.display = 'block';
            
            // Clear file input
            fileInput.value = '';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Remove Footer Logo
function removeFooterLogo() {
    if (confirm('🫠 Are you sure you want to remove the footer logo?')) {
        if (adminData.logos && adminData.logos.footer) {
            delete adminData.logos.footer;
            saveData();
            
            document.getElementById('footerLogoPreview').style.display = 'none';
            document.getElementById('footerLogoImg').src = '';
            document.getElementById('footerLogoInput').value = '';
            
            showNotification('🗑️ Footer logo removed successfully!');
        }
    }
}

// Load Logos on Page Load
function loadLogos() {
    if (adminData.logos) {
        // Load header logo
        if (adminData.logos.header && adminData.logos.header.data) {
            document.getElementById('headerLogoImg').src = adminData.logos.header.data;
            document.getElementById('headerLogoPreview').style.display = 'block';
        }
        
        // Load footer logo
        if (adminData.logos.footer && adminData.logos.footer.data) {
            document.getElementById('footerLogoImg').src = adminData.logos.footer.data;
            document.getElementById('footerLogoPreview').style.display = 'block';
        }
    }
}

// Auto-load logos when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLogos);
} else {
    loadLogos();
}

// About Section
document.getElementById('aboutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    console.log('📝 About form submitted');
    console.log('Title:', document.getElementById('aboutTitle').value);
    console.log('Text1:', document.getElementById('aboutText1').value);
    console.log('Text2:', document.getElementById('aboutText2').value);
    
    if (!adminData.about) adminData.about = {};
    
    adminData.about.title = document.getElementById('aboutTitle').value;
    adminData.about.text1 = document.getElementById('aboutText1').value;
    adminData.about.text2 = document.getElementById('aboutText2').value;
    
    console.log('💾 Saving about data:', adminData.about);
    
    const saved = saveData();
    
    if (saved) {
        alert('✅ About section saved successfully!\n\nTitle: ' + adminData.about.title + '\nText 1: ' + (adminData.about.text1 || 'empty') + '\nText 2: ' + (adminData.about.text2 || 'empty'));
    } else {
        alert('❌ Failed to save about section. Check console for errors.');
    }
});

// About Image
document.getElementById('aboutImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        alert(`About image is too large! Maximum size is 2MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        e.target.value = ''; // Clear input
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            adminData.about.imageUrl = event.target.result;
            adminData.about.imageSize = {
                width: img.width,
                height: img.height
            };
            
            const preview = document.getElementById('aboutImagePreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
            
            saveData();
            showNotification(`About image saved! Size: ${img.width}x${img.height}px ✅`);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Contact Section
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    adminData.contact = {
        address: document.getElementById('contactAddress').value,
        phone: document.getElementById('contactPhone').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        email: document.getElementById('contactEmail').value,
        hours: document.getElementById('contactHours').value
    };
    
    saveData();
});

// Slider Functions
function addSlide() {
    const title = document.getElementById('slideTitle').value;
    const subtitle = document.getElementById('slideSubtitle').value;
    const bgColor = document.getElementById('slideBgColor').value;
    const bgImageInput = document.getElementById('slideBgImage');
    
    if (!title) {
        alert('Please enter at least a title');
        return;
    }
    
    const slide = {
        title,
        subtitle,
        bgColor
    };
    
    // Handle image upload with size validation
    if (bgImageInput.files && bgImageInput.files[0]) {
        const imageFile = bgImageInput.files[0];
        
        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (imageFile.size > maxSize) {
            alert(`Banner image is too large! Maximum size is 2MB. Your file is ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                slide.bgImage = event.target.result;
                slide.imageSize = {
                    width: img.width,
                    height: img.height
                };
                completeAddSlide(slide);
                showNotification(`Banner added! Size: ${img.width}x${img.height}px ✅`);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    } else {
        completeAddSlide(slide);
    }
}

function completeAddSlide(slide) {
    if (!adminData.slider) adminData.slider = { slides: [], interval: 3 };
    if (!adminData.slider.slides) adminData.slider.slides = [];
    
    adminData.slider.slides.push(slide);
    saveData();
    updateSlidesList();
    
    // Clear inputs
    document.getElementById('slideTitle').value = '';
    document.getElementById('slideSubtitle').value = '';
    document.getElementById('slideBgImage').value = '';
}

function updateSlidesList() {
    const container = document.getElementById('slidesList');
    const slides = adminData.slider?.slides || [];
    
    let html = '<h3>Current Banners</h3>';
    
    slides.forEach((slide, index) => {
        html += `
            <div class="item-card">
                <div class="item-info">
                    <h4>${slide.title}</h4>
                    <p>${slide.subtitle || ''}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-edit" onclick="editSlide(${index})" style="background: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteSlide(${index})" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">🗑️ Delete</button>
                </div>
            </div>
        `;
    });
    
    if (slides.length === 0) {
        html += '<p>No banners added yet. Add your first banner above!</p>';
    }
    
    container.innerHTML = html;
}

function deleteSlide(index) {
    if (confirm('Delete this banner?')) {
        adminData.slider.slides.splice(index, 1);
        saveData();
        updateSlidesList();
    }
}

function editSlide(index) {
    const slide = adminData.slider.slides[index];
    
    // Populate form with existing data
    document.getElementById('slideTitle').value = slide.title;
    document.getElementById('slideSubtitle').value = slide.subtitle || '';
    document.getElementById('slideBgColor').value = slide.bgColor || '#453982';
    
    // Store index for update
    window.editingSlideIndex = index;
    
    // Change button text to indicate update mode
    const addBtn = document.querySelector('#slider .btn-add');
    addBtn.textContent = '💾 Update Banner';
    addBtn.onclick = updateSlide;
    
    // Scroll to form
    document.querySelector('#slider .add-new-card').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Editing banner - make changes and click Update ✅');
}

function saveSliderSettings() {
    if (!adminData.slider) adminData.slider = {};
    adminData.slider.interval = parseInt(document.getElementById('sliderInterval').value);
    saveData();
    showNotification('Slider settings saved! ✅');
}

function updateSlide() {
    const index = window.editingSlideIndex;
    if (index === undefined || index === null) {
        alert('Error: No slide selected for editing');
        return;
    }
    
    const title = document.getElementById('slideTitle').value;
    const subtitle = document.getElementById('slideSubtitle').value;
    const bgColor = document.getElementById('slideBgColor').value;
    const bgImageInput = document.getElementById('slideBgImage');
    
    if (!title) {
        alert('Please enter at least a title');
        return;
    }
    
    const slide = {
        title,
        subtitle,
        bgColor,
        // Keep existing image if not uploading new one
        ...(adminData.slider.slides[index].bgImage && { bgImage: adminData.slider.slides[index].bgImage }),
        ...(adminData.slider.slides[index].imageSize && { imageSize: adminData.slider.slides[index].imageSize })
    };
    
    // Handle new image upload if provided
    if (bgImageInput.files && bgImageInput.files[0]) {
        const imageFile = bgImageInput.files[0];
        const maxSize = 2 * 1024 * 1024;
        
        if (imageFile.size > maxSize) {
            alert(`Banner image is too large! Maximum size is 2MB. Your file is ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                slide.bgImage = event.target.result;
                slide.imageSize = { width: img.width, height: img.height };
                completeUpdateSlide(slide, index);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    } else {
        completeUpdateSlide(slide, index);
    }
}

function completeUpdateSlide(slide, index) {
    adminData.slider.slides[index] = slide;
    saveData();
    updateSlidesList();
    
    // Reset form and button
    document.getElementById('slideTitle').value = '';
    document.getElementById('slideSubtitle').value = '';
    document.getElementById('slideBgImage').value = '';
    
    const addBtn = document.querySelector('#slider .btn-add');
    addBtn.textContent = '➕ Add Banner';
    addBtn.onclick = addSlide;
    window.editingSlideIndex = null;
    
    showNotification('Banner updated successfully! ✅');
}

// Frames Functions
document.getElementById('frameForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check if editing existing frame
    if (window.editingFrame) {
        updateFrame(e);
        return;
    }
    
    const name = document.getElementById('frameName').value;
    const price = document.getElementById('framePrice').value;
    const category = document.getElementById('frameCategory').value;
    const imageFile = document.getElementById('frameImage').files[0];
    
    if (!imageFile) {
        alert('Please select an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            const frame = {
                name,
                price: price ? parseFloat(price) : 0,
                category,
                image: event.target.result,
                imageSize: {
                    width: img.width,
                    height: img.height
                }
            };
            
            if (!adminData.frames) adminData.frames = {};
            if (!adminData.frames[category]) adminData.frames[category] = [];
            
            adminData.frames[category].push(frame);
            saveData();
            updateFramesList();
            
            showNotification(`Frame added! Size: ${img.width}x${img.height}px ✅`);
            
            // Clear form
            e.target.reset();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
});

function updateFrame(e) {
    const { category, index } = window.editingFrame;
    
    const name = document.getElementById('frameName').value;
    const price = document.getElementById('framePrice').value;
    const imageFile = document.getElementById('frameImage').files[0];
    
    // Get existing frame to preserve image if not uploading new one
    const existingFrame = adminData.frames[category][index];
    
    const frame = {
        name,
        price: price ? parseFloat(price) : 0,
        category,
        // Keep existing image if not uploading new one
        image: existingFrame.image,
        imageSize: existingFrame.imageSize
    };
    
    // Handle new image upload if provided
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                frame.image = event.target.result;
                frame.imageSize = { width: img.width, height: img.height };
                completeUpdateFrame(frame, category, index, e);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    } else {
        completeUpdateFrame(frame, category, index, e);
    }
}

function completeUpdateFrame(frame, category, index, e) {
    adminData.frames[category][index] = frame;
    saveData();
    updateFramesList();
    
    // Reset form and button
    document.getElementById('frameName').value = '';
    document.getElementById('framePrice').value = '';
    document.getElementById('frameImage').value = '';
    
    const submitBtn = document.querySelector('#frameForm button[type="submit"]');
    submitBtn.textContent = '➕ Add Frame';
    window.editingFrame = null;
    
    showNotification('Frame updated successfully! ✅');
}

function updateFramesList() {
    const container = document.getElementById('framesList');
    const latest = adminData.frames?.latest || [];
    const trending = adminData.frames?.trending || [];
    
    let html = '<h3>Current Frames</h3>';
    
    // Latest frames
    if (latest.length > 0) {
        html += '<h4 style="margin: 15px 0 10px 0; color: #453982;">✨ Latest Arrivals</h4>';
        latest.forEach((frame, index) => {
            html += `
                <div class="item-card">
                    <img src="${frame.image}" class="item-image" alt="${frame.name}">
                    <div class="item-info">
                        <h4>${frame.name}</h4>
                        <p>${frame.price ? '₹' + frame.price : 'No price'}</p>
                        <p><small>Size: ${frame.imageSize?.width || '?'}x${frame.imageSize?.height || '?'}px</small></p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-edit" onclick="editFrame('latest', ${index})" style="background: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteFrame('latest', ${index})" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">🗑️ Delete</button>
                    </div>
                </div>
            `;
        });
    }
    
    // Trending frames
    if (trending.length > 0) {
        html += '<h4 style="margin: 15px 0 10px 0; color: #453982;">🔥 Trending</h4>';
        trending.forEach((frame, index) => {
            html += `
                <div class="item-card">
                    <img src="${frame.image}" class="item-image" alt="${frame.name}">
                    <div class="item-info">
                        <h4>${frame.name}</h4>
                        <p>${frame.price ? '₹' + frame.price : 'No price'}</p>
                        <p><small>Size: ${frame.imageSize?.width || '?'}x${frame.imageSize?.height || '?'}px</small></p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-edit" onclick="editFrame('latest', ${index})" style="background: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteFrame('trending', ${index})" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">🗑️ Delete</button>
                    </div>
                </div>
            `;
        });
    }
    
    if (latest.length === 0 && trending.length === 0) {
        html += '<p>No frames added yet.</p>';
    }
    
    container.innerHTML = html;
}

function deleteFrame(category, index) {
    if (confirm('Delete this frame?')) {
        adminData.frames[category].splice(index, 1);
        saveData();
        updateFramesList();
    }
}

function editFrame(category, index) {
    const frame = adminData.frames[category][index];
    
    // Populate form with existing data
    document.getElementById('frameName').value = frame.name;
    document.getElementById('framePrice').value = frame.price || '';
    document.getElementById('frameCategory').value = category;
    
    // Store info for update
    window.editingFrame = { category, index };
    
    // Change button text
    const submitBtn = document.querySelector('#frameForm button[type="submit"]');
    submitBtn.textContent = '💾 Update Frame';
    
    // Scroll to form
    document.querySelector('#frames').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Editing frame - make changes and click Update ✅');
}

// Services Functions
document.getElementById('serviceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('serviceTitle').value;
    const description = document.getElementById('serviceDescription').value;
    const imageFile = document.getElementById('serviceImage').files[0];
    
    if (!imageFile) {
        alert('Please select a service image');
        return;
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (imageFile.size > maxSize) {
        alert(`Image is too large! Maximum size is 2MB. Your file is ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            const service = {
                title,
                description,
                image: event.target.result,
                imageSize: {
                    width: img.width,
                    height: img.height
                }
            };
            
            if (!adminData.services) adminData.services = [];
            adminData.services.push(service);
            saveData();
            updateServicesList();
            
            showNotification(`Service added! Size: ${img.width}x${img.height}px ✅`);
            
            // Clear form
            e.target.reset();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
});

function updateServicesList() {
    const container = document.getElementById('servicesList');
    const services = adminData.services || [];
    
    let html = '<h3>Current Services</h3>';
    
    services.forEach((service, index) => {
        html += `
            <div class="item-card">
                ${service.image ? `<img src="${service.image}" class="item-image" alt="${service.title}">` : ''}
                <div class="item-info">
                    <h4>${service.title}</h4>
                    <p>${service.description}</p>
                    ${service.imageSize ? `<p><small>📏 Size: ${service.imageSize.width}x${service.imageSize.height}px</small></p>` : ''}
                </div>
                <button class="btn-delete" onclick="deleteService(${index})">Delete</button>
            </div>
        `;
    });
    
    if (services.length === 0) {
        html += '<p>No services added yet.</p>';
    }
    
    container.innerHTML = html;
}

function deleteService(index) {
    if (confirm('Delete this service?')) {
        adminData.services.splice(index, 1);
        saveData();
        updateServicesList();
    }
}

// Colors
function saveColors() {
    adminData.colors = {
        primary: document.getElementById('primaryColor').value,
        secondary: document.getElementById('secondaryColor').value
    };
    saveData();
}

// View Website
function viewWebsite() {
    window.open('index.html', '_blank');
}

// Export Data
function exportData() {
    const dataStr = JSON.stringify(adminData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vision-care-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported! 📥');
}

// Import Data Function
function importData() {
    // Trigger file input click
    const fileInput = document.getElementById('importFileInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleImportFile(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
        alert('⚠️ Please select a valid .json backup file!');
        return;
    }
    
    // Confirm import
    const confirmed = confirm('⚠️ WARNING: This will replace ALL current data with the imported backup!\n\nMake sure you have exported your current data first!\n\nDo you want to continue?');
    
    if (!confirmed) {
        // Reset file input
        event.target.value = '';
        return;
    }
    
    // Read and import file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData || typeof importedData !== 'object') {
                throw new Error('Invalid data structure');
            }
            
            // Save to localStorage
            adminData = importedData;
            localStorage.setItem('visionCareAdminData', JSON.stringify(adminData));
            localStorage.setItem('visionCareData', JSON.stringify(adminData));
            
            // Reload page to populate forms
            showNotification('✅ Data imported successfully! Reloading...');
            
            setTimeout(() => {
                location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Import error:', error);
            alert('❌ Error importing data! The file may be corrupted.\n\nError: ' + error.message);
        }
    };
    
    reader.onerror = function() {
        alert('❌ Error reading file!');
    };
    
    reader.readAsText(file);
}

// Brands Functions
function addBrand() {
    const brandName = document.getElementById('brandName').value;
    const brandLogoInput = document.getElementById('brandLogo');
    
    if (!brandName) {
        alert('Please enter a brand name');
        return;
    }
    
    const brand = {
        name: brandName,
        logoUrl: ''
    };
    
    // Handle logo upload with size validation
    if (brandLogoInput.files && brandLogoInput.files[0]) {
        const logoFile = brandLogoInput.files[0];
        
        // Validate file size (max 500KB for logos)
        const maxSize = 500 * 1024; // 500KB in bytes
        if (logoFile.size > maxSize) {
            alert(`Brand logo is too large! Maximum size is 500KB. Your file is ${(logoFile.size / 1024).toFixed(2)}KB`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                brand.logoUrl = event.target.result;
                brand.logoSize = {
                    width: img.width,
                    height: img.height
                };
                completeAddBrand(brand);
                showNotification(`Brand added! Logo: ${img.width}x${img.height}px ✅`);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(logoFile);
    } else {
        completeAddBrand(brand);
    }
}

function completeAddBrand(brand) {
    if (!adminData.brands) adminData.brands = [];
    adminData.brands.push(brand);
    saveData();
    updateBrandsList();
    
    // Clear inputs
    document.getElementById('brandName').value = '';
    document.getElementById('brandLogo').value = '';
}

function updateBrandsList() {
    const container = document.getElementById('brandsList');
    const brands = adminData.brands || [];
    
    let html = '<h3>Current Brands</h3>';
    
    brands.forEach((brand, index) => {
        html += `
            <div class="item-card">
                ${brand.logoUrl ? `<img src="${brand.logoUrl}" class="item-image" alt="${brand.name}">` : ''}
                <div class="item-info">
                    <h4>${brand.name}</h4>
                    ${brand.logoUrl ? `<p>Has logo image</p>${brand.logoSize ? `<p><small>📏 Size: ${brand.logoSize.width}x${brand.logoSize.height}px</small></p>` : ''}` : '<p>No logo</p>'}
                </div>
                <button class="btn-delete" onclick="deleteBrand(${index})">Delete</button>
            </div>
        `;
    });
    
    if (brands.length === 0) {
        html += '<p>No brands added yet.</p>';
    }
    
    container.innerHTML = html;
}

function deleteBrand(index) {
    if (confirm('Delete this brand?')) {
        adminData.brands.splice(index, 1);
        saveData();
        updateBrandsList();
    }
}

// Social Media Functions
function updateSocialIcon() {
    const platform = document.getElementById('socialPlatform').value;
    const iconInput = document.getElementById('socialIcon');
    
    // Auto-update icon based on platform
    const platformIcons = {
        facebook: '📘',
        instagram: '📷',
        twitter: '🐦',
        whatsapp: '💬',
        youtube: '▶️',
        linkedin: '💼'
    };
    
    iconInput.value = platformIcons[platform] || '🔗';
}

function addSocial() {
    const platform = document.getElementById('socialPlatform').value;
    const icon = document.getElementById('socialIcon').value;
    const url = document.getElementById('socialUrl').value;
    
    if (!url) {
        alert('Please enter a profile URL');
        return;
    }
    
    const social = {
        platform,
        icon,
        url
    };
    
    if (!adminData.social) adminData.social = [];
    adminData.social.push(social);
    saveData();
    updateSocialList();
    
    // Clear form
    document.getElementById('socialUrl').value = '';
}

function updateSocialList() {
    const container = document.getElementById('socialList');
    const social = adminData.social || [];
    
    let html = '<h3>Current Social Links</h3>';
    
    social.forEach((item, index) => {
        // Update icon based on platform automatically
        const platformIcons = {
            facebook: '📘',
            instagram: '📷',
            twitter: '🐦',
            whatsapp: '💬',
            youtube: '▶️',
            linkedin: '💼'
        };
        
        const defaultIcon = platformIcons[item.platform] || '🔗';
        const displayIcon = item.icon || defaultIcon;
        
        html += `
            <div class="item-card">
                <div class="item-info">
                    <h4>${displayIcon} ${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}</h4>
                    <p>${item.url}</p>
                </div>
                <button class="btn-delete" onclick="deleteSocial(${index})">Delete</button>
            </div>
        `;
    });
    
    if (social.length === 0) {
        html += '<p>No social links added yet.</p>';
    }
    
    container.innerHTML = html;
}

function deleteSocial(index) {
    if (confirm('Delete this social link?')) {
        adminData.social.splice(index, 1);
        saveData();
        updateSocialList();
    }
}

// Location Functions
document.getElementById('locationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const address = document.getElementById('locationAddress').value;
    const lat = document.getElementById('locationLat').value;
    const lng = document.getElementById('locationLng').value;
    const embedCode = document.getElementById('locationEmbed').value;
    
    adminData.location = {};
    
    if (embedCode) {
        adminData.location.embedCode = embedCode;
    } else {
        adminData.location.address = address;
        if (lat) adminData.location.lat = parseFloat(lat);
        if (lng) adminData.location.lng = parseFloat(lng);
    }
    
    saveData();
    showNotification('Location saved! ✅');
});

// ==================== OFFERS SLIDER FUNCTIONS ====================

// Load offers data into form
function loadOffersData() {
    if (!adminData.offers) return;
    
    document.getElementById('offersActive').checked = adminData.offers.active || false;
    document.getElementById('offerStartDate').value = adminData.offers.startDate || '';
    document.getElementById('offerEndDate').value = adminData.offers.endDate || '';
    
    // Clear existing items
    const container = document.getElementById('offerItemsContainer');
    container.innerHTML = '';
    
    // Load offer items
    if (adminData.offers.items && adminData.offers.items.length > 0) {
        adminData.offers.items.forEach((item, index) => {
            addOfferItem(item.image || '');
        });
        console.log(`✅ Loaded ${adminData.offers.items.length} offer ads`);
    }
}

// Add a new offer item
function addOfferItem(image = '') {
    const container = document.getElementById('offerItemsContainer');
    const index = container.children.length;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'offer-item';
    itemDiv.style.cssText = 'background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #FF9800;';
    
    itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0;">📸 Offer Ad #${index + 1}</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;">❌ Remove</button>
        </div>
        
        <div class="form-group">
            <label>Upload Offer Ad Image (600×200px):</label>
            <input type="file" class="offer-image-upload" accept="image/*" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; cursor: pointer;">
            <p style="font-size: 12px; color: #666; margin-top: 5px;">Create your ad in Canva/Photoshop with text like "EID SALE 50% OFF" already in the image</p>
            ${image ? `<input type="hidden" class="offer-image-path" value="${image}">` : ''}
        </div>
        
        ${image ? `<div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; text-align: center;">
            <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Current Ad (Click Upload to change):</p>
            <img src="${image}" alt="Offer Preview" style="height: 100px; width: auto; max-width: 300px; border-radius: 10px; object-fit: cover; border: 2px solid #FF9800;">
        </div>` : '<div id="preview-' + index + '" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; text-align: center; display: none;"></div>'}
    `;
    
    container.appendChild(itemDiv);
    
    // Add image upload listener
    const uploadInput = itemDiv.querySelector('.offer-image-upload');
    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                alert('⚠️ Please select an image file (JPG, PNG, or WebP)');
                return;
            }
            
            if (file.size > 500 * 1024) { // 500KB limit
                alert('⚠️ Image file is too large! Please keep it under 500KB');
                return;
            }
            
            // Read and preview the file
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result;
                
                // Store the base64 string in a hidden input
                let hiddenInput = itemDiv.querySelector('.offer-image-path');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.className = 'offer-image-path';
                    itemDiv.querySelector('.form-group').appendChild(hiddenInput);
                }
                hiddenInput.value = base64String;
                
                // Show preview
                const previewDiv = itemDiv.querySelector('[id^="preview-"]') || createPreviewDiv(itemDiv);
                previewDiv.style.display = 'block';
                previewDiv.innerHTML = `
                    <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Preview (will be saved):</p>
                    <img src="${base64String}" alt="Preview" style="height: 100px; width: auto; max-width: 300px; border-radius: 10px; object-fit: cover; border: 2px solid #FF9800;">
                    <p style="font-size: 11px; color: #2196F3; margin-top: 8px;">✅ Beautiful offer ad ready to save!</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Helper function to create preview div if it doesn't exist
function createPreviewDiv(itemDiv) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'preview-' + (itemDiv.parentElement.children.length - 1);
    previewDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; text-align: center; display: none;';
    itemDiv.querySelector('.form-group').parentElement.appendChild(previewDiv);
    return previewDiv;
}

// Save all offers
function saveOffers() {
    const isActive = document.getElementById('offersActive').checked;
    const startDate = document.getElementById('offerStartDate').value;
    const endDate = document.getElementById('offerEndDate').value;
    
    // Collect all offer items (image only now)
    const offerItems = [];
    const offerItemElements = document.querySelectorAll('.offer-item');
    
    offerItemElements.forEach(item => {
        // Get image from hidden input (uploaded base64) or existing path
        let image = '';
        const imagePathInput = item.querySelector('.offer-image-path');
        if (imagePathInput) {
            image = imagePathInput.value.trim();
        }
        
        if (image) { // Only add if there's an image
            offerItems.push({ image });
        }
    });
    
    if (offerItems.length === 0) {
        alert('⚠️ Please add at least one offer ad image!');
        return;
    }
    
    // Save to adminData
    adminData.offers = {
        active: isActive,
        startDate: startDate,
        endDate: endDate,
        items: offerItems
    };
    
    // Save to localStorage
    saveData();
    
    showNotification(`🎉 ${offerItems.length} beautiful offer ads saved successfully!`);
    
    // Update dashboard
    updateDashboard();
}

// Clear all offers
function clearOffers() {
    if (confirm('Are you sure you want to clear all offers? This cannot be undone.')) {
        adminData.offers = null;
        delete adminData.offers;
        
        saveData();
        
        // Reload the offers section
        document.getElementById('offersActive').checked = false;
        document.getElementById('offerStartDate').value = '';
        document.getElementById('offerEndDate').value = '';
        document.getElementById('offerItemsContainer').innerHTML = '';
        
        showNotification('🗑️ All offers cleared!');
        updateDashboard();
    }
}

// Add to populateForms function
const originalPopulateForms = window.populateForms;
window.populateForms = function() {
    if (originalPopulateForms) originalPopulateForms();
    loadOffersData();
};
