// Dummy Data Generator for Testing
// Run this in browser console or include temporarily

function addDummyData() {
    console.log('🎉 Adding dummy data to all sections...');
    
    // Hero Section
    const heroData = {
        title: 'Welcome to Vision Care',
        subtitle: 'Your Vision, Our Priority - Discover Premium Eyewear'
    };
    
    // Slider Banners
    const sliderData = {
        slides: [
            {
                title: 'Summer Collection 2025',
                subtitle: 'Up to 50% Off on Selected Frames',
                bgColor: '#453982'
            },
            {
                title: 'Premium Designer Brands',
                subtitle: 'Ray-Ban, Prada, Gucci & More',
                bgColor: '#2d2555'
            },
            {
                title: 'Free Eye Test',
                subtitle: 'Book Your Appointment Today',
                bgColor: '#6b5b95'
            }
        ],
        interval: 3,
        effect: 'zoom'
    };
    
    // Brands
    const brandsData = [
        { name: 'Ray-Ban', logoUrl: '' },
        { name: 'Oakley', logoUrl: '' },
        { name: 'Prada', logoUrl: '' },
        { name: 'Gucci', logoUrl: '' },
        { name: 'Tom Ford', logoUrl: '' },
        { name: 'Armani', logoUrl: '' },
        { name: 'Versace', logoUrl: '' },
        { name: 'Burberry', logoUrl: '' }
    ];
    
    // Frames - Latest Arrivals
    const latestFrames = [
        {
            name: 'Ray-Ban Aviator Classic',
            price: 154,
            category: 'latest',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        },
        {
            name: 'Oakley Holbrook',
            price: 126,
            category: 'latest',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        },
        {
            name: 'Prada Square Frame',
            price: 189,
            category: 'latest',
            image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        },
        {
            name: 'Gucci Round Frame',
            price: 245,
            category: 'latest',
            image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        }
    ];
    
    // Frames - Trending
    const trendingFrames = [
        {
            name: 'Tom Ford Cat-Eye',
            price: 295,
            category: 'trending',
            image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        },
        {
            name: 'Armani Rectangle',
            price: 178,
            category: 'trending',
            image: 'https://images.unsplash.com/photo-1508296695146-25dd4d4f59e6?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        },
        {
            name: 'Versace Wayfarer',
            price: 165,
            category: 'trending',
            image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300&h=200&fit=crop',
            imageSize: { width: 300, height: 200 }
        }
    ];
    
    // Services
    const servicesData = [
        {
            title: 'Comprehensive Eye Exam',
            description: 'Complete vision testing with modern equipment. Duration: 30 minutes.',
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop'
        },
        {
            title: 'Contact Lens Fitting',
            description: 'Professional fitting and consultation for contact lenses.',
            image: 'https://images.unsplash.com/photo-1589307990800-eb73698f6299?w=400&h=300&fit=crop'
        },
        {
            title: 'Designer Frame Adjustment',
            description: 'Free adjustments for frames purchased from us.',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop'
        },
        {
            title: 'Premium Sunglass Tinting',
            description: 'UV protection tinting for your prescription glasses.',
            image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=300&fit=crop'
        },
        {
            title: 'Blue Light Protection',
            description: 'Anti-blue light coating for digital device users.',
            image: 'https://images.unsplash.com/photo-1570222094114-28a9d88a27e6?w=400&h=300&fit=crop'
        }
    ];
    
    // About Section
    const aboutData = {
        title: 'About Vision Care',
        text1: 'At Vision Care, we\'re passionate about helping you see the world more clearly. With over 15 years of experience in optometry and eyewear, our team of certified professionals is dedicated to providing personalized vision solutions.',
        text2: 'We believe that everyone deserves to look and see their best. That\'s why we offer comprehensive eye exams, premium designer frames, and expert fitting services. Our state-of-the-art facility ensures you receive the highest quality care in a comfortable environment.',
        imageUrl: ''
    };
    
    // Contact Information
    const contactData = {
        address: '123 Main Street, Downtown Plaza, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        whatsapp: '+15551234567',
        email: 'info@visioncare.com',
        hours: 'Mon-Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM'
    };
    
    // Social Media Links
    const socialData = [
        { platform: 'facebook', icon: '📘', url: 'https://facebook.com/visioncare' },
        { platform: 'instagram', icon: '📷', url: 'https://instagram.com/visioncare' },
        { platform: 'twitter', icon: '🐦', url: 'https://twitter.com/visioncare' },
        { platform: 'whatsapp', icon: '💬', url: 'https://wa.me/15551234567' }
    ];
    
    // Location
    const locationData = {
        address: '123 Main Street, New York, NY 10001',
        lat: 40.7580,
        lng: -73.9855,
        embedCode: ''
    };
    
    // Colors
    const colorsData = {
        primary: '#453982',
        secondary: '#2d2555'
    };
    
    // Combine all data
    const completeData = {
        hero: heroData,
        slider: sliderData,
        brands: brandsData,
        frames: {
            latest: latestFrames,
            trending: trendingFrames
        },
        services: servicesData,
        about: aboutData,
        contact: contactData,
        social: socialData,
        location: locationData,
        colors: colorsData
    };
    
    // Save to localStorage
    localStorage.setItem('visionCareAdminData', JSON.stringify(completeData));
    localStorage.setItem('visionCareData', JSON.stringify(completeData));
    
    console.log('✅ Dummy data added successfully!');
    console.log('📊 Summary:');
    console.log(`   - Hero section: ${heroData.title}`);
    console.log(`   - Slider banners: ${sliderData.slides.length} slides`);
    console.log(`   - Brands: ${brandsData.length} brands`);
    console.log(`   - Latest frames: ${latestFrames.length} frames`);
    console.log(`   - Trending frames: ${trendingFrames.length} frames`);
    console.log(`   - Services: ${servicesData.length} services`);
    console.log(`   - Social links: ${socialData.length} links`);
    console.log('');
    console.log('🎉 Refresh admin panel to see all data!');
    console.log('🌐 Open index.html to see the website with dummy data!');
    
    return completeData;
}

// Auto-run if included as script
if (typeof window !== 'undefined') {
    console.log('🚀 Dummy data generator loaded!');
    console.log('Run addDummyData() in console to populate test data.');
}
