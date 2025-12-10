import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import User from './models/User.js';

dotenv.config();

const sampleVehicles = [
  // Cars
  {
    name: 'Honda CR-V 2020',
    type: 'car',
    brand: 'Honda',
    model: 'CR-V',
    year: 2020,
    condition: 'excellent',
    description: 'Spacious SUV perfect for family trips. Air conditioning, GPS navigation, and Bluetooth included. Well maintained and clean.',
    pricePerDay: 45,
    depositAmount: 250,
    currency: 'USD',
    location: {
      address: 'Street 240, Phnom Penh',
      city: 'Phnom Penh',
      district: 'Daun Penh',
      province: 'Phnom Penh',
      country: 'Cambodia',
      coordinates: {
        latitude: 11.5564,
        longitude: 104.9282
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '08:00',
      timeTo: '20:00',
      isAvailableNow: true
    },
    features: ['air-conditioning', 'gps', 'automatic', 'bluetooth', 'usb-charging', 'insurance'],
    images: ['/RideShare/imge/01.png'],
    mainPhoto: '/RideShare/imge/01.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.8,
    reviewCount: 12,
    views: 156,
    totalRentals: 8
  },
  {
    name: 'Toyota Camry 2021',
    type: 'car',
    brand: 'Toyota',
    model: 'Camry',
    year: 2021,
    condition: 'excellent',
    description: 'Comfortable sedan with excellent fuel economy. Perfect for city driving and longer trips. All features included.',
    pricePerDay: 40,
    depositAmount: 200,
    currency: 'USD',
    location: {
      address: 'Russian Market Area, Phnom Penh',
      city: 'Phnom Penh',
      district: 'Toul Tom Poung',
      province: 'Phnom Penh',
      country: 'Cambodia',
      coordinates: {
        latitude: 11.5500,
        longitude: 104.9200
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '07:00',
      timeTo: '22:00',
      isAvailableNow: true
    },
    features: ['air-conditioning', 'gps', 'automatic', 'bluetooth', 'insurance'],
    images: ['/RideShare/imge/02.png'],
    mainPhoto: '/RideShare/imge/02.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 18,
    views: 203,
    totalRentals: 15
  },
  {
    name: 'Hyundai Accent 2019',
    type: 'car',
    brand: 'Hyundai',
    model: 'Accent',
    year: 2019,
    condition: 'good',
    description: 'Reliable compact car, great for city driving. Economical and easy to park. Well maintained.',
    pricePerDay: 30,
    depositAmount: 150,
    currency: 'USD',
    location: {
      address: 'BKK1 Area, Phnom Penh',
      city: 'Phnom Penh',
      district: 'Boeung Keng Kang',
      province: 'Phnom Penh',
      country: 'Cambodia',
      coordinates: {
        latitude: 11.5500,
        longitude: 104.9300
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      timeFrom: '09:00',
      timeTo: '19:00',
      isAvailableNow: true
    },
    features: ['air-conditioning', 'gps', 'automatic', 'bluetooth'],
    images: ['/RideShare/imge/03.png'],
    mainPhoto: '/RideShare/imge/03.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.6,
    reviewCount: 9,
    views: 98,
    totalRentals: 6
  },
  // Motorbikes
  {
    name: 'Honda Click 2022',
    type: 'motorbike',
    brand: 'Honda',
    model: 'Click',
    year: 2022,
    condition: 'excellent',
    description: 'Popular automatic scooter, perfect for city navigation. Fuel efficient and easy to ride. Helmet included.',
    pricePerDay: 10,
    depositAmount: 50,
    currency: 'USD',
    location: {
      address: 'Central Market Area, Phnom Penh',
      city: 'Phnom Penh',
      district: 'Daun Penh',
      province: 'Phnom Penh',
      country: 'Cambodia',
      coordinates: {
        latitude: 11.5620,
        longitude: 104.9160
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '08:00',
      timeTo: '20:00',
      isAvailableNow: true
    },
    features: ['helmet-included', 'automatic-scooter', 'fuel-efficient', 'storage-box', 'phone-holder'],
    images: ['/RideShare/imge/04.png'],
    mainPhoto: '/RideShare/imge/04.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.7,
    reviewCount: 25,
    views: 312,
    totalRentals: 22
  },
  {
    name: 'Yamaha NMAX 2021',
    type: 'motorbike',
    brand: 'Yamaha',
    model: 'NMAX',
    year: 2021,
    condition: 'excellent',
    description: 'Premium automatic scooter with comfortable ride. Perfect for longer trips. Helmet and rain cover included.',
    pricePerDay: 12,
    depositAmount: 60,
    currency: 'USD',
    location: {
      address: 'Siem Reap City Center',
      city: 'Siem Reap',
      district: 'Siem Reap',
      province: 'Siem Reap',
      country: 'Cambodia',
      coordinates: {
        latitude: 13.3671,
        longitude: 103.8448
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '07:00',
      timeTo: '21:00',
      isAvailableNow: true
    },
    features: ['helmet-included', 'automatic-scooter', 'fuel-efficient', 'storage-box', 'rain-cover', 'phone-holder'],
    images: ['/RideShare/imge/05.png'],
    mainPhoto: '/RideShare/imge/05.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 31,
    views: 445,
    totalRentals: 28
  },
  {
    name: 'Honda Wave 2020',
    type: 'motorbike',
    brand: 'Honda',
    model: 'Wave',
    year: 2020,
    condition: 'good',
    description: 'Reliable manual motorbike, great for city and countryside. Economical and durable. Helmet included.',
    pricePerDay: 8,
    depositAmount: 40,
    currency: 'USD',
    location: {
      address: 'Sihanoukville Beach Area',
      city: 'Sihanoukville',
      district: 'Sihanoukville',
      province: 'Preah Sihanouk',
      country: 'Cambodia',
      coordinates: {
        latitude: 10.6093,
        longitude: 103.5296
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '08:00',
      timeTo: '19:00',
      isAvailableNow: true
    },
    features: ['helmet-included', 'fuel-efficient', 'storage-box'],
    images: ['/RideShare/imge/06.png'],
    mainPhoto: '/RideShare/imge/06.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.5,
    reviewCount: 14,
    views: 167,
    totalRentals: 11
  },
  // Bicycles
  {
    name: 'Mountain Bike - Trek',
    type: 'bicycle',
    brand: 'Trek',
    model: 'Mountain Bike',
    year: 2021,
    condition: 'excellent',
    description: 'High-quality mountain bike perfect for exploring. Multi-speed gears, comfortable seat, and lights included.',
    pricePerDay: 5,
    depositAmount: 30,
    currency: 'USD',
    location: {
      address: 'Riverside Area, Phnom Penh',
      city: 'Phnom Penh',
      district: 'Chamkar Mon',
      province: 'Phnom Penh',
      country: 'Cambodia',
      coordinates: {
        latitude: 11.5500,
        longitude: 104.9300
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '06:00',
      timeTo: '20:00',
      isAvailableNow: true
    },
    features: ['helmet-bicycle', 'lock-included', 'lights', 'multi-speed', 'comfortable-seat'],
    images: ['/RideShare/imge/01.png'],
    mainPhoto: '/RideShare/imge/01.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.8,
    reviewCount: 19,
    views: 234,
    totalRentals: 16
  },
  {
    name: 'City Bike - Comfortable',
    type: 'bicycle',
    brand: 'Giant',
    model: 'City Bike',
    year: 2022,
    condition: 'excellent',
    description: 'Comfortable city bike with basket and lights. Perfect for daily commuting and short trips around the city.',
    pricePerDay: 4,
    depositAmount: 25,
    currency: 'USD',
    location: {
      address: 'Battambang City Center',
      city: 'Battambang',
      district: 'Battambang',
      province: 'Battambang',
      country: 'Cambodia',
      coordinates: {
        latitude: 13.0957,
        longitude: 103.2022
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '07:00',
      timeTo: '19:00',
      isAvailableNow: true
    },
    features: ['helmet-bicycle', 'lock-included', 'basket', 'lights', 'comfortable-seat'],
    images: ['/RideShare/imge/02.png'],
    mainPhoto: '/RideShare/imge/02.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.6,
    reviewCount: 12,
    views: 145,
    totalRentals: 9
  },
  {
    name: 'Folding Bike - Portable',
    type: 'bicycle',
    brand: 'Dahon',
    model: 'Folding Bike',
    year: 2023,
    condition: 'excellent',
    description: 'Compact folding bicycle, easy to store and transport. Perfect for apartment living. Lightweight and efficient.',
    pricePerDay: 6,
    depositAmount: 35,
    currency: 'USD',
    location: {
      address: 'Kampot Riverside',
      city: 'Kampot',
      district: 'Kampot',
      province: 'Kampot',
      country: 'Cambodia',
      coordinates: {
        latitude: 10.6104,
        longitude: 104.1815
      }
    },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeFrom: '08:00',
      timeTo: '18:00',
      isAvailableNow: true
    },
    features: ['helmet-bicycle', 'lock-included', 'lights', 'comfortable-seat'],
    images: ['/RideShare/imge/03.png'],
    mainPhoto: '/RideShare/imge/03.png',
    status: 'approved',
    available: true,
    verified: true,
    rating: 4.7,
    reviewCount: 8,
    views: 89,
    totalRentals: 6
  }
];

async function seedVehicles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Get or create a test user as owner
    let owner = await User.findOne({ email: 'owner@rideshare.com' });
    if (!owner) {
      owner = await User.create({
        email: 'owner@rideshare.com',
        password: 'test123',
        firstName: 'Vehicle',
        lastName: 'Owner',
        phone: '+855123456789',
        accountType: 'list',
        emailVerified: true,
        idVerified: true,
        profileComplete: true
      });
      console.log('✅ Created test owner user');
    }

    // Clear existing vehicles (optional - comment out if you want to keep existing)
    // await Vehicle.deleteMany({});
    // console.log('✅ Cleared existing vehicles');

    // Add owner info to vehicles
    const vehiclesWithOwner = sampleVehicles.map(vehicle => ({
      ...vehicle,
      ownerId: owner._id,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      ownerEmail: owner.email,
      ownerPhone: owner.phone,
      contact: {
        name: `${owner.firstName} ${owner.lastName}`,
        phone: owner.phone,
        email: owner.email
      }
    }));

    // Insert vehicles
    const createdVehicles = await Vehicle.insertMany(vehiclesWithOwner);
    console.log(`✅ Created ${createdVehicles.length} vehicles`);

    console.log('\n📋 Created Vehicles:');
    createdVehicles.forEach((v, i) => {
      console.log(`${i + 1}. ${v.name} - ${v.type} - $${v.pricePerDay}/day - ${v.location.city}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding vehicles:', error);
    process.exit(1);
  }
}

seedVehicles();

