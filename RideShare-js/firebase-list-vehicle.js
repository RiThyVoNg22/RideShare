// firebase-list-vehicle.js - Save vehicle listings to Firebase

let listVehicleUser = null;

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(user => {
        listVehicleUser = user;
        console.log('List vehicle auth:', user ? 'Logged in as ' + user.email : 'Not logged in');
        setupListVehicleForm();
    });
});

function setupListVehicleForm() {
    const form = document.getElementById('listVehicleForm');
    if (form) {
        form.addEventListener('submit', handleVehicleListing);
    }
}

async function handleVehicleListing(e) {
    e.preventDefault();
    
    if (!listVehicleUser) {
        alert('Please log in to list a vehicle');
        window.location.href = 'auth.html';
        return;
    }

    try {
        const formData = new FormData(e.target);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        const features = [];
        formData.getAll('features[]').forEach(feature => {
            features.push(feature);
        });

        const availableDays = formData.getAll('availableDays[]');

        const photoFiles = document.getElementById('vehiclePhotos').files;
        const photoUrls = await uploadVehiclePhotos(photoFiles, listVehicleUser.uid);

        const vehicleData = {
            name: formData.get('vehicleTitle'),
            type: formData.get('vehicleType'),
            brand: formData.get('vehicleBrand'),
            model: formData.get('vehicleModel'),
            year: formData.get('vehicleYear'),
            condition: formData.get('vehicleCondition'),
            description: formData.get('vehicleDescription'),
            image: photoUrls[0] || '',
            images: photoUrls,
            pricePerDay: parseFloat(formData.get('dailyPrice')),
            deposit: parseFloat(formData.get('depositAmount')),
            location: formData.get('vehicleCity'),
            district: formData.get('vehicleDistrict'),
            pickupLocation: formData.get('pickupLocation'),
            availableDays: availableDays,
            availableFrom: formData.get('availableFrom'),
            availableTo: formData.get('availableTo'),
            available: true,
            features: features,
            ownerId: listVehicleUser.uid,
            owner: formData.get('ownerName'),
            ownerName: formData.get('ownerName'),
            ownerEmail: formData.get('contactEmail'),
            ownerPhone: formData.get('contactNumber'),
            // CHANGED: Auto-approve vehicles for testing
            // Later you can add admin approval system
            status: 'approved', // Changed from 'pending' to 'approved'
            rating: 0,
            reviewCount: 0,
            reviews: [],
            views: 0,
            totalRentals: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log('Saving vehicle to Firebase:', vehicleData);

        const vehicleRef = await firebase.firestore()
            .collection('vehicles')
            .add(vehicleData);

        console.log('✓ Vehicle listed! ID:', vehicleRef.id);

        // Also save reference in user's subcollection
        await firebase.firestore()
            .collection('users')
            .doc(listVehicleUser.uid)
            .collection('vehicles')
            .doc(vehicleRef.id)
            .set({
                vehicleId: vehicleRef.id,
                vehicleName: vehicleData.name,
                vehicleType: vehicleData.type,
                pricePerDay: vehicleData.pricePerDay,
                image: vehicleData.image,
                status: 'approved',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        submitBtn.style.background = '#28a745';
        
        // Show success message with link to vehicle
        const successMessage = `Vehicle listed successfully!\n\nID: ${vehicleRef.id}\nStatus: Approved ✓\n\nYour vehicle is now live on the rent page!`;
        alert(successMessage);
        
        // Redirect to rent page after 2 seconds to see the new listing
        setTimeout(() => {
            if (confirm('Would you like to view your listing on the rent page?')) {
                window.location.href = 'rent.html';
            } else {
                // Reset form
                e.target.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                
                const photoPreview = document.getElementById('photoPreview');
                if (photoPreview) photoPreview.innerHTML = '';
            }
        }, 1000);

    } catch (error) {
        console.error('Error listing vehicle:', error);
        alert('Failed to list vehicle: ' + error.message);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> List My Vehicle';
        }
    }
}

async function uploadVehiclePhotos(files, userId) {
    const photoUrls = [];
    
    if (!files || files.length === 0) {
        console.log('No photos to upload, using placeholder');
        return ['/RideShare/imge/placeholder.png'];
    }

    console.log(`Uploading ${files.length} photos...`);

    for (let i = 0; i < files.length; i++) {
        try {
            const file = files[i];
            const fileName = `vehicles/${userId}/${Date.now()}_${i}_${file.name}`;
            
            const storageRef = firebase.storage().ref(fileName);
            const snapshot = await storageRef.put(file);
            
            const downloadURL = await snapshot.ref.getDownloadURL();
            photoUrls.push(downloadURL);
            
            console.log(`✓ Photo ${i + 1} uploaded:`, downloadURL);
            
        } catch (error) {
            console.error(`Error uploading photo ${i + 1}:`, error);
        }
    }

    return photoUrls.length > 0 ? photoUrls : ['/RideShare/imge/placeholder.png'];
}

console.log('✓ List Vehicle Firebase system loaded');