import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehiclesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { normalizeImageUrls } from '../utils/imageUtils';
import Modal from '../components/Modal';
import { MapPin, Heart, CheckCircle } from 'lucide-react';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  location: any;
  pricePerDay: number;
  depositAmount: number;
  available: boolean;
  images?: string[];
  mainPhoto?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  description?: string;
  ownerId?: any;
  ownerName?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [booking, setBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(today.toISOString().split('T')[0]);
    setReturnDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      const response = await vehiclesAPI.getById(id!);
      if (response.success) {
        setVehicle(response.vehicle);
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    return location?.city || location?.district || 'Location';
  };

  const calculateTotal = () => {
    if (!vehicle || !pickupDate || !returnDate) return { days: 0, subtotal: 0, serviceFee: 0, commission: 0, total: 0 };
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const subtotal = vehicle.pricePerDay * days;
    const commissionRate = 0.10; // 10% commission (matches backend default)
    const commission = subtotal * commissionRate;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    return { days, subtotal, serviceFee, commission, total };
  };

  const handleBookNow = async () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (!pickupDate || !returnDate) {
      showToast('Please select pickup and return dates', 'warning');
      return;
    }

    try {
      setBooking(true);
      // First create the booking
      const response = await bookingsAPI.create({
        vehicleId: vehicle!._id,
        pickupDate,
        returnDate,
      });

      if (response.success) {
        const bookingId = response.booking._id;
        setBookingId(bookingId);
        
        // Try to create Stripe checkout session
        try {
          const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payments/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ bookingId }),
          });

          const paymentData = await paymentResponse.json();

          if (paymentData.success && paymentData.url) {
            // Redirect to Stripe checkout if payment is configured
            window.location.href = paymentData.url;
            return;
          } else if (paymentResponse.status === 503) {
            // Payment not configured - allow booking without payment
            console.log('Payment not configured, creating booking without payment');
            setBookingId(bookingId);
            setShowBookingModal(true);
            showToast('Booking created successfully! Payment can be completed later.', 'success');
            setBooking(false);
            return;
          } else {
            throw new Error(paymentData.message || 'Failed to create payment session');
          }
        } catch (paymentError: any) {
          // If payment fails (e.g., not configured), still allow booking
          if (paymentError.message && paymentError.message.includes('not configured')) {
            console.log('Payment not configured, allowing booking without payment');
            setBookingId(bookingId);
            setShowBookingModal(true);
            showToast('Booking created successfully! Payment can be completed later.', 'success');
            setBooking(false);
            return;
          }
          
          // For other errors, show warning but still create booking
          console.error('Payment error:', paymentError);
          setBookingId(bookingId);
          setShowBookingModal(true);
          showToast('Booking created! Payment processing is not available yet.', 'warning');
          setBooking(false);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Booking failed. Please try again.', 'error');
      setBooking(false);
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    navigate('/');
  };

  const generateStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star text-yellow-400"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt text-yellow-400"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="far fa-star text-yellow-400"></i>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Vehicle Not Found</h2>
          <Link to="/rent" className="btn btn-primary">
            Browse Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const { days, subtotal, serviceFee, commission, total } = calculateTotal();
  const images = vehicle.images 
    ? normalizeImageUrls(vehicle.images) 
    : (vehicle.mainPhoto ? [normalizeImageUrl(vehicle.mainPhoto)] : ['/RideShare/imge/placeholder.png']);

  return (
    <>
      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={handleCloseBookingModal}
        title="Booking Confirmed!"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your booking has been confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Booking ID: <span className="font-mono font-semibold text-primary-blue">{bookingId}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive a confirmation email shortly. The vehicle owner will contact you to arrange pickup details.
          </p>
          <button
            onClick={handleCloseBookingModal}
            className="btn btn-primary w-full"
          >
            Continue Browsing
          </button>
        </div>
      </Modal>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/rent" className="hover:text-primary-orange">Rent</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{vehicle.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="card p-4 mb-6">
              <img
                src={images[selectedImage]}
                alt={vehicle.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/RideShare/imge/placeholder.png';
                }}
              />
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`border-2 rounded-lg overflow-hidden ${
                        selectedImage === idx ? 'border-primary-orange' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.name} ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="card p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 capitalize">{vehicle.type}</span>
                    <div className="flex items-center gap-2">
                      {generateStars(vehicle.rating || 0)}
                      <span className="text-sm text-gray-600">
                        {(vehicle.rating || 0).toFixed(1)} ({vehicle.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{vehicle.location?.district || ''}, {formatLocation(vehicle.location)}</span>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vehicle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <i className="fas fa-check text-primary-orange"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vehicle.description && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-orange mb-2">
                  ${vehicle.pricePerDay}/day
                </div>
                <div className="text-gray-600">Deposit: ${vehicle.depositAmount || 0}</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      if (returnDate && e.target.value > returnDate) {
                        const newReturn = new Date(e.target.value);
                        newReturn.setDate(newReturn.getDate() + 1);
                        setReturnDate(newReturn.toISOString().split('T')[0]);
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">${vehicle.pricePerDay} x {days} days</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Fee (5%)</span>
                  <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2 italic">
                  * Platform commission (10%) included in rental price
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total</span>
                  <span className="text-primary-orange">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!vehicle.available || booking}
                className={`btn btn-primary w-full ${!vehicle.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {booking ? 'Processing...' : vehicle.available ? 'Book Now' : 'Currently Rented'}
              </button>

              {vehicle.ownerName && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Owner</h4>
                  <p className="text-gray-600">{vehicle.ownerName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
