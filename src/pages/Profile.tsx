import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { bookingsAPI, vehiclesAPI, chatAPI, usersAPI, authAPI, uploadAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import { 
  User, Calendar, MessageSquare, Car, Settings, 
  LogOut, Edit, Trash2, Eye, Bell, Lock,
  CheckCircle, XCircle, Clock, Shield,
  MapPin, Star, Check, X, Power, Camera, Upload
} from 'lucide-react';
import ChatModal from '../components/ChatModal';

interface Booking {
  _id: string;
  vehicleName: string;
  vehicleId: string | { _id: string; [key: string]: any };
  pickupDate: string;
  returnDate: string;
  rentalDays: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  ownerName?: string;
  ownerId?: string;
}

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  location: any;
  images?: string[];
  mainPhoto?: string;
  status: string;
  available: boolean;
  rating?: number;
  reviewCount?: number;
}

interface Chat {
  _id: string;
  vehicleName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  participants: string[];
  unreadCount?: number;
}

const Profile: React.FC = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'messages' | 'vehicles' | 'settings'>('info');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalVehicles: 0,
    memberDays: 0,
  });
  
  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Profile picture state
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    loadProfileData();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'vehicles') {
      loadVehicles();
    } else if (activeTab === 'messages') {
      loadMessages();
    }
  }, [activeTab]);

  const loadProfileData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Calculate member days (default to 0 if createdAt not available)
      const daysSince = 0; // Will be calculated from user data if available
      
      // Load stats
      const bookingsRes = await bookingsAPI.getMyBookings();
      const vehiclesRes = await vehiclesAPI.getMyVehicles();
      
      setStats({
        totalBookings: bookingsRes.bookings?.length || bookingsRes.count || 0,
        totalVehicles: vehiclesRes.vehicles?.length || vehiclesRes.count || 0,
        memberDays: daysSince,
      });
      
      if (activeTab === 'bookings') {
        setBookings(bookingsRes.bookings || []);
      }
      if (activeTab === 'vehicles') {
        setVehicles(vehiclesRes.vehicles || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      showToast('Failed to load bookings', 'error');
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehiclesAPI.getMyVehicles();
      setVehicles(response.vehicles || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      showToast('Failed to load vehicles', 'error');
    }
  };

  const handleEditVehicle = (vehicleId: string) => {
    navigate(`/list-vehicle?edit=${vehicleId}`);
  };

  const handleDeleteVehicle = async (vehicleId: string, vehicleName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${vehicleName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await vehiclesAPI.delete(vehicleId);
      showToast('Vehicle deleted successfully', 'success');
      loadVehicles();
      loadProfileData(); // Refresh stats
    } catch (error: any) {
      showToast(error.message || 'Failed to delete vehicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (vehicleId: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      // Always ensure status is approved when toggling (removes pending badge)
      const updates: any = { 
        available: !currentStatus,
        status: 'approved' // Set to approved so pending badge disappears
      };
      await vehiclesAPI.update(vehicleId, updates);
      showToast(`Vehicle is now ${!currentStatus ? 'available' : 'unavailable'}`, 'success');
      loadVehicles();
    } catch (error: any) {
      showToast(error.message || 'Failed to update availability', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMyChats();
      setChats(response.chats || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      showToast('Failed to load messages', 'error');
    }
  };

  const handleOpenChat = (chat: Chat) => {
    // Ensure chat has required fields
    if (!chat || (!chat._id && !chat.bookingId)) {
      showToast('Invalid chat data', 'error');
      return;
    }
    setSelectedChat(chat);
    setIsChatModalOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setSelectedChat(null);
    // Refresh chats to update unread counts
    loadMessages();
  };

  const handleMessageSent = () => {
    // Refresh chats to show updated last message
    loadMessages();
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  // Initialize profile form data when editing starts
  useEffect(() => {
    if (isEditingProfile && currentUser) {
      setProfileFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
      });
    }
  }, [isEditingProfile, currentUser]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile(profileFormData);
      showToast('Profile updated successfully', 'success');
      setIsEditingProfile(false);
    } catch (error: any) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordFormData.newPassword || !passwordFormData.confirmPassword || !passwordFormData.currentPassword) {
      showToast('Please fill in all password fields', 'warning');
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'warning');
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showToast('New passwords do not match', 'warning');
      return;
    }

    try {
      setLoading(true);
      await authAPI.changePassword(passwordFormData.currentPassword, passwordFormData.newPassword);
      showToast('Password changed successfully', 'success');
      setIsChangingPassword(false);
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureClick = () => {
    profilePictureInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'warning');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'warning');
      return;
    }

    try {
      setIsUploadingPicture(true);
      
      // Upload image
      const uploadResponse = await uploadAPI.uploadImage(file);
      
      if (!uploadResponse.url) {
        throw new Error('Failed to upload image');
      }

      // Update profile with new picture URL
      await updateProfile({ profilePicture: uploadResponse.url });
      
      showToast('Profile picture updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to upload profile picture', 'error');
    } finally {
      setIsUploadingPicture(false);
      // Reset input
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = '';
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    return location?.city || location?.district || 'Location';
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden">
                {currentUser.profilePicture ? (
                  <img
                    key={currentUser.profilePicture}
                    src={currentUser.profilePicture}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Replace with icon on error
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const icon = document.createElement('div');
                      icon.className = 'w-16 h-16 flex items-center justify-center';
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      img.parentElement?.appendChild(icon);
                    }}
                  />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <button
                onClick={handleProfilePictureClick}
                disabled={isUploadingPicture}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-primary-orange/90 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                title="Change profile picture"
              >
                {isUploadingPicture ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                ref={profilePictureInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-xl opacity-90 mb-4">{currentUser.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <div className="text-sm opacity-90">Bookings</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <div className="text-sm opacity-90">Vehicles</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.memberDays}</div>
                  <div className="text-sm opacity-90">Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-600 hover:text-primary-blue'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-600 hover:text-primary-blue'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-600 hover:text-primary-blue'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'vehicles'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-600 hover:text-primary-blue'
              }`}
            >
              <Car className="w-4 h-4 inline mr-2" />
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-600 hover:text-primary-blue'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6 text-primary-orange" />
                    Personal Information
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={profileFormData.firstName}
                          onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={profileFormData.lastName}
                          onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileFormData.phone}
                          onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                          placeholder="+855 12 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                        <p className="text-lg text-gray-500 italic">Email cannot be changed</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={handleSaveProfile}
                        className="btn btn-primary"
                        disabled={loading || !profileFormData.firstName || !profileFormData.lastName}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileFormData({
                            firstName: currentUser.firstName || '',
                            lastName: currentUser.lastName || '',
                            phone: currentUser.phone || '',
                          });
                        }}
                        className="btn btn-outline"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                      <p className="text-lg">{currentUser.firstName} {currentUser.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                      <p className="text-lg">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                      <p className="text-lg">{currentUser.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Account Type</label>
                      <span className="inline-block px-3 py-1 bg-primary-orange/10 text-primary-orange rounded-full font-semibold capitalize">
                        {currentUser.accountType || 'both'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary-orange" />
                  Account Status
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email Verified</label>
                    {currentUser.emailVerified ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        <XCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">ID Verification</label>
                    {currentUser.idVerified ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        <Clock className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Member Since</label>
                    <p className="text-lg">Recently</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">User ID</label>
                    <p className="text-sm font-mono text-gray-500">
                      {currentUser._id ? `${currentUser._id.substring(0, 12)}...` : 'N/A'}
                    </p>
                  </div>
                </div>

                {!currentUser.idVerified && (
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 mb-1">ID Verification Required</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Complete ID verification to access all features and ensure platform security.
                        </p>
                        <Link to="/verify-id" className="btn btn-primary text-sm">
                          <Shield className="w-4 h-4" />
                          Verify Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <Link to="/rent" className="btn btn-primary">
                  <Calendar className="w-4 h-4" />
                  New Booking
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="card p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring our vehicles and make your first booking!</p>
                  <Link to="/rent" className="btn btn-primary">
                    Browse Vehicles
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="card p-6 hover:shadow-lg transition-all border-l-4 border-primary-orange">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{booking.vehicleName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              booking.status === 'active' ? 'bg-purple-100 text-purple-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Pickup: {formatDate(booking.pickupDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Return: {formatDate(booking.returnDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.rentalDays} days</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-orange mb-1">
                            ${booking.totalPrice.toFixed(2)}
                          </div>
                          <div className="flex gap-2">
                            {(() => {
                              // Normalize vehicleId - handle both string and object
                              const vehicleId = typeof booking.vehicleId === 'string' 
                                ? booking.vehicleId 
                                : booking.vehicleId?._id?.toString() || booking.vehicleId?._id || '';
                              
                              return vehicleId ? (
                                <Link
                                  to={`/product/${vehicleId}`}
                                  className="btn btn-outline text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Vehicle
                                </Link>
                              ) : (
                                <button
                                  className="btn btn-outline text-sm opacity-50 cursor-not-allowed"
                                  disabled
                                  title="Vehicle ID not available"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Vehicle
                                </button>
                              );
                            })()}
                            <button
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  // Get or create chat for this booking
                                  const response = await chatAPI.getChatByBooking(booking._id);
                                  if (response.success && response.chat) {
                                    // Ensure bookingId is included in the chat object
                                    const chatWithBooking = {
                                      ...response.chat,
                                      bookingId: booking._id
                                    };
                                    handleOpenChat(chatWithBooking);
                                  } else {
                                    showToast('Failed to create chat', 'error');
                                  }
                                } catch (error: any) {
                                  console.error('Error opening chat:', error);
                                  showToast(error.message || 'Failed to open chat', 'error');
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="btn btn-primary text-sm"
                              disabled={loading}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Messages</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : chats.length === 0 ? (
                <div className="card p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Your conversations will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chats.map((chat) => {
                    const otherParticipant = chat.participants?.find(
                      (p: any) => (p._id || p)?.toString() !== currentUser?._id?.toString()
                    );
                    const participantName = otherParticipant 
                      ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || 'Other user'
                      : 'Other user';
                    
                    return (
                      <div
                        key={chat._id}
                        onClick={() => handleOpenChat(chat)}
                        className="card p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-primary-blue"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold">
                            {chat.vehicleName?.charAt(0) || 'V'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{chat.vehicleName}</h4>
                            <p className="text-sm text-gray-500">{participantName}</p>
                            <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage || 'No messages yet'}</p>
                          </div>
                          <div className="text-right">
                            {chat.unreadCount && chat.unreadCount > 0 && (
                              <span className="bg-primary-orange text-white text-xs px-2 py-1 rounded-full block mb-1">
                                {chat.unreadCount}
                              </span>
                            )}
                            <p className="text-xs text-gray-500">
                              {chat.lastMessageTime ? formatDate(chat.lastMessageTime) : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Vehicles</h2>
                <Link to="/list-vehicle" className="btn btn-primary">
                  <Car className="w-4 h-4" />
                  List Vehicle
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="card p-12 text-center">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No vehicles listed</h3>
                  <p className="text-gray-600 mb-6">Start earning by listing your first vehicle!</p>
                  <Link to="/list-vehicle" className="btn btn-primary">
                    List a Vehicle
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle._id} className="card overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative h-48">
                        <img
                          src={normalizeImageUrl(vehicle.images?.[0] || vehicle.mainPhoto)}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/RideShare/imge/placeholder.png';
                          }}
                        />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                          vehicle.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {vehicle.available ? 'Available' : 'Unavailable'}
                        </div>
                        {/* Only show pending badge if status is pending AND available */}
                        {vehicle.status === 'pending' && vehicle.available && (
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            pending
                          </span>
                        )}
                        {/* Show Live badge if approved and available */}
                        {vehicle.status === 'approved' && vehicle.available && (
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Live
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{vehicle.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{formatLocation(vehicle.location)}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xl font-bold text-primary-orange">
                            ${vehicle.pricePerDay}/day
                          </div>
                          {vehicle.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span>{vehicle.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${vehicle._id}`}
                              className="btn btn-outline flex-1 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            <button
                              className="btn btn-outline text-sm"
                              onClick={() => handleEditVehicle(vehicle._id)}
                              title="Edit Vehicle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="btn btn-outline text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => handleDeleteVehicle(vehicle._id, vehicle.name)}
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            className={`btn w-full text-sm ${
                              vehicle.available
                                ? 'btn-outline text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white'
                                : 'btn-primary'
                            }`}
                            onClick={() => handleToggleAvailability(vehicle._id, vehicle.available)}
                            title={vehicle.available ? 'Make Unavailable' : 'Make Available'}
                          >
                            <Power className="w-4 h-4" />
                            {vehicle.available ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary-orange" />
                    Change Password
                  </h2>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Current Password *</label>
                      <input
                        type="password"
                        value={passwordFormData.currentPassword}
                        onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">New Password *</label>
                      <input
                        type="password"
                        value={passwordFormData.newPassword}
                        onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Confirm New Password *</label>
                      <input
                        type="password"
                        value={passwordFormData.confirmPassword}
                        onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={handleChangePassword}
                        className="btn btn-primary"
                        disabled={loading || !passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword}
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordFormData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          });
                        }}
                        className="btn btn-outline"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Click "Change Password" to update your password</p>
                )}
              </div>

              {/* Notifications */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary-orange" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive email updates about bookings and messages</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold">Booking Updates</div>
                      <div className="text-sm text-gray-600">Get notified when booking status changes</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>
              </div>

              {/* Privacy */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary-orange" />
                  Privacy
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold">Show Profile to Other Users</div>
                      <div className="text-sm text-gray-600">Allow other users to view your profile</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold">Share Booking History</div>
                      <div className="text-sm text-gray-600">Show your booking history on profile</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card p-6 border-2 border-red-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
                  <Shield className="w-6 h-6" />
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => showToast('Account deletion feature coming soon', 'info')}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Logout */}
              <div className="card p-6">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChat}
        chat={selectedChat}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default Profile;

