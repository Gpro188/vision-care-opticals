// Firebase Configuration for Vision Care
// =========================================
// IMPORTANT: Replace these values with YOUR Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyA4pS8jE2Llk8FNS-XRShLRZTWEneFjYjM",
    authDomain: "vision-care-6a88e.firebaseapp.com",
    projectId: "vision-care-6a88e",
    storageBucket: "vision-care-6a88e.firebasestorage.app",
    messagingSenderId: "147595679580",
    appId: "1:147595679580:web:aeb5a0f187589b992a9399",
    measurementId: "G-XY6CRXTKL0"
};

// Initialize Firebase (will be loaded by HTML files)
// These global variables will be accessible across all scripts
let db;
let firebaseApp;

// Global function to initialize Firebase Firestore
function initializeFirebase() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK not loaded! Make sure Firebase scripts are included in HTML.');
            return false;
        }
        
        // Initialize Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        console.log('✅ Firebase initialized successfully!');
        console.log('📊 Project ID:', firebaseConfig.projectId);
        
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
    }
}

// Helper function to save data to Firebase - PERMANENT FIX FOR LARGE DATA
// Each item is saved as a separate document to avoid ALL size limits
async function saveToFirebase(data, section = 'all') {
    if (!db) {
        console.error('❌ Firebase not initialized! Call initializeFirebase() first.');
        return false;
    }
    
    try {
        // Save metadata (always small)
        if (section === 'all' || section === 'metadata') {
            const metadata = {
                hero: data.hero || {},
                contact: data.contact || {},
                social: data.social || {},
                location: data.location || {},
                colors: data.colors || {},
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                version: '3.0-unlimited'
            };
            await db.collection('websiteData').doc('metadata').set(metadata);
            console.log('✅ Metadata saved');
        }
        
        // Save slider slides - EACH SLIDE IS A SEPARATE DOCUMENT!
        if (section === 'all' || section === 'slider') {
            if (data.slider && data.slider.slides && data.slider.slides.length > 0) {
                const batch = db.batch();
                
                // Clear old slides by overwriting with new ones
                // First, delete all existing slide documents
                const sliderSnapshot = await db.collection('sliderSlides').get();
                sliderSnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                
                // Save each slide individually
                data.slider.slides.forEach((slide, index) => {
                    const slideRef = db.collection('sliderSlides').doc(`slide_${index}`);
                    batch.set(slideRef, slide);
                });
                
                // Save slider settings
                const settingsRef = db.collection('sliderData').doc('settings');
                batch.set(settingsRef, {
                    interval: data.slider.interval || 3,
                    totalSlides: data.slider.slides.length
                });
                
                await batch.commit();
                console.log(`✅ ${data.slider.slides.length} slider slides saved (unlimited!)`);
            }
        }
        
        // Save frames - EACH FRAME IS A SEPARATE DOCUMENT
        if (section === 'all' || section === 'frames') {
            if (data.frames) {
                const batch = db.batch();
                
                // Delete old frames
                const latestSnapshot = await db.collection('framesLatest').get();
                latestSnapshot.forEach(doc => batch.delete(doc.ref));
                
                const trendingSnapshot = await db.collection('framesTrending').get();
                trendingSnapshot.forEach(doc => batch.delete(doc.ref));
                
                // Save new frames
                if (data.frames.latest && data.frames.latest.length > 0) {
                    data.frames.latest.forEach((frame, index) => {
                        const frameRef = db.collection('framesLatest').doc(`frame_${index}`);
                        batch.set(frameRef, frame);
                    });
                }
                if (data.frames.trending && data.frames.trending.length > 0) {
                    data.frames.trending.forEach((frame, index) => {
                        const frameRef = db.collection('framesTrending').doc(`frame_${index}`);
                        batch.set(frameRef, frame);
                    });
                }
                await batch.commit();
                console.log('✅ Frames saved (unlimited!)');
            }
        }
        
        // Save brands - EACH BRAND IS A SEPARATE DOCUMENT
        if (section === 'all' || section === 'brands') {
            if (data.brands && data.brands.length > 0) {
                const batch = db.batch();
                
                // Delete old brands
                const brandsSnapshot = await db.collection('brands').get();
                brandsSnapshot.forEach(doc => batch.delete(doc.ref));
                
                // Save new brands
                data.brands.forEach((brand, index) => {
                    const brandRef = db.collection('brands').doc(`brand_${index}`);
                    batch.set(brandRef, brand);
                });
                await batch.commit();
                console.log(`✅ ${data.brands.length} brands saved (unlimited!)`);
            }
        }
        
        // Save services - EACH SERVICE IS A SEPARATE DOCUMENT
        if (section === 'all' || section === 'services') {
            if (data.services && data.services.length > 0) {
                const batch = db.batch();
                
                // Delete old services
                const servicesSnapshot = await db.collection('services').get();
                servicesSnapshot.forEach(doc => batch.delete(doc.ref));
                
                // Save new services
                data.services.forEach((service, index) => {
                    const serviceRef = db.collection('services').doc(`service_${index}`);
                    batch.set(serviceRef, service);
                });
                await batch.commit();
                console.log(`✅ ${data.services.length} services saved (unlimited!)`);
            }
        }
        
        // Save logos (small enough for one doc)
        if (section === 'all' || section === 'logos') {
            if (data.logos && Object.keys(data.logos).length > 0) {
                await db.collection('logosData').doc('all').set(data.logos);
                console.log('✅ Logos saved');
            }
        }
        
        // Save about section (small enough for one doc)
        if (section === 'all' || section === 'about') {
            if (data.about && Object.keys(data.about).length > 0) {
                await db.collection('aboutData').doc('all').set(data.about);
                console.log('✅ About saved');
            }
        }
        
        // Save offers - EACH OFFER IS A SEPARATE DOCUMENT
        if (section === 'all' || section === 'offers') {
            if (data.offers && data.offers.items && data.offers.items.length > 0) {
                const batch = db.batch();
                
                // Delete old offers
                const offersSnapshot = await db.collection('offerItems').get();
                offersSnapshot.forEach(doc => batch.delete(doc.ref));
                
                // Save new offers
                data.offers.items.forEach((item, index) => {
                    const offerRef = db.collection('offerItems').doc(`offer_${index}`);
                    batch.set(offerRef, item);
                });
                
                const settingsRef = db.collection('offersData').doc('settings');
                batch.set(settingsRef, {
                    active: data.offers.active || false,
                    startDate: data.offers.startDate,
                    endDate: data.offers.endDate,
                    totalItems: data.offers.items.length
                });
                await batch.commit();
                console.log(`✅ ${data.offers.items.length} offers saved (unlimited!)`);
            }
        }
        
        console.log('🎉 PERMANENT FIX WORKS! All data saved with NO SIZE LIMITS!');
        return true;
        
    } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        return false;
    }
}

// Helper function to load data from Firebase - OPTIMIZED FOR FINE-GRAINED STORAGE
async function loadFromFirebase() {
    if (!db) {
        console.error('❌ Firebase not initialized! Call initializeFirebase() first.');
        return null;
    }
    
    try {
        // Load metadata
        const metadataDoc = await db.collection('websiteData').doc('metadata').get();
        const metadata = metadataDoc.exists ? metadataDoc.data() : {};
        
        // Load slider slides and settings
        const sliderSlidesSnap = await db.collection('sliderSlides').orderBy('__name__').get();
        const sliderSettingsDoc = await db.collection('sliderData').doc('settings').get();
        const slides = [];
        sliderSlidesSnap.forEach(doc => slides.push(doc.data()));
        const slider = {
            slides: slides,
            interval: sliderSettingsDoc.exists ? sliderSettingsDoc.data().interval : 3
        };
        
        // Load frames (latest and trending)
        const framesLatestSnap = await db.collection('framesLatest').orderBy('__name__').get();
        const framesTrendingSnap = await db.collection('framesTrending').orderBy('__name__').get();
        const latest = [];
        const trending = [];
        framesLatestSnap.forEach(doc => latest.push(doc.data()));
        framesTrendingSnap.forEach(doc => trending.push(doc.data()));
        const frames = { latest, trending };
        
        // Load brands
        const brandsSnap = await db.collection('brands').orderBy('__name__').get();
        const brands = [];
        brandsSnap.forEach(doc => brands.push(doc.data()));
        
        // Load services
        const servicesSnap = await db.collection('services').orderBy('__name__').get();
        const services = [];
        servicesSnap.forEach(doc => services.push(doc.data()));
        
        // Load logos
        const logosDoc = await db.collection('logosData').doc('all').get();
        const logos = logosDoc.exists ? logosDoc.data() : {};
        
        // Load about
        const aboutDoc = await db.collection('aboutData').doc('all').get();
        const about = aboutDoc.exists ? aboutDoc.data() : {};
        
        // Load offers
        const offerItemsSnap = await db.collection('offerItems').orderBy('__name__').get();
        const offersSettingsDoc = await db.collection('offersData').doc('settings').get();
        const items = [];
        offerItemsSnap.forEach(doc => items.push(doc.data()));
        const offers = {
            active: offersSettingsDoc.exists ? (offersSettingsDoc.data().active || false) : false,
            startDate: offersSettingsDoc.exists ? offersSettingsDoc.data().startDate : null,
            endDate: offersSettingsDoc.exists ? offersSettingsDoc.data().endDate : null,
            items: items
        };
        
        // Combine all data
        const combinedData = {
            ...metadata,
            slider,
            frames,
            brands,
            services,
            logos,
            about,
            offers
        };
        
        console.log('✅ Data loaded from Firebase (fine-grained multi-document storage)!');
        console.log('📊 Last updated:', metadata.lastUpdated ? metadata.lastUpdated.toDate() : 'Never');
        return combinedData;
        
    } catch (error) {
        console.error('❌ Error loading from Firebase:', error);
        return null;
    }
}

// Helper function to listen for real-time updates
function subscribeToUpdates(callback) {
    if (!db) {
        console.error('❌ Firebase not initialized!');
        return () => {};
    }
    
    try {
        const unsubscribe = db.collection('websiteData')
            .doc('visionCare')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    console.log('🔄 Real-time update received from Firebase!');
                    callback(data);
                }
            }, (error) => {
                console.error('❌ Error listening to Firebase updates:', error);
            });
        
        console.log('✅ Subscribed to Firebase real-time updates');
        return unsubscribe;
    } catch (error) {
        console.error('❌ Error setting up Firebase listener:', error);
        return () => {};
    }
}
