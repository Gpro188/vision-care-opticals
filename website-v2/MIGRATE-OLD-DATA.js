// MIGRATION TOOL - Copy old data to Firebase
// Run this ONCE in your browser console on admin.html

async function migrateOldDataToFirebase() {
    console.log('🔄 Starting data migration...');
    
    // Try to load from localStorage first (old data)
    let oldData = localStorage.getItem('visionCareAdminData');
    if (!oldData) {
        oldData = localStorage.getItem('visionCareData');
    }
    
    if (oldData) {
        try {
            const parsedData = JSON.parse(oldData);
            console.log('✅ Found old data:', Object.keys(parsedData).join(', '));
            
            // Save to Firebase
            if (typeof db !== 'undefined' && db) {
                await saveToFirebase(parsedData);
                console.log('✅ Data migrated to Firebase successfully!');
                console.log('🎉 Refresh the page to see your old data!');
                alert('✅ Migration complete! Refresh the page now.');
            } else {
                console.error('❌ Firebase not initialized');
            }
        } catch (error) {
            console.error('❌ Error parsing old data:', error);
        }
    } else {
        console.log('ℹ️ No old data found - starting fresh');
    }
}

// Run migration
migrateOldDataToFirebase();
