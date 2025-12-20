import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ToastProvider';
import { vehiclesAPI, uploadAPI } from '../services/api';
import { DollarSign, Shield, MapPin, CreditCard } from 'lucide-react';

const ListVehicle: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editVehicleId = searchParams.get('edit');
  const [isEditMode] = useState(!!editVehicleId);
  const [loading, setLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    condition: '',
    description: '',
    pricePerDay: '',
    depositAmount: '',
    city: '',
    district: '',
    address: '',
    availableDays: [] as string[],
    availableFrom: '',
    availableTo: '',
    ownerName: '',
    contactNumber: '',
    contactEmail: '',
    features: [] as string[],
    images: [] as File[],
    agreeTerms: false,
    agreeVerification: false,
    agreeInsurance: false,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [earnings, setEarnings] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else {
      setFormData(prev => ({
        ...prev,
        ownerName: `${currentUser.firstName} ${currentUser.lastName}`,
        contactEmail: currentUser.email || '',
        contactNumber: currentUser.phone || '',
      }));
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (editVehicleId && currentUser) {
      loadVehicleForEdit(editVehicleId);
    }
  }, [editVehicleId, currentUser]);

  const loadVehicleForEdit = async (vehicleId: string) => {
    try {
      setLoadingVehicle(true);
      const response = await vehiclesAPI.getById(vehicleId);
      if (response.success && response.vehicle) {
        const vehicle = response.vehicle;
        
        // Check if user owns this vehicle
        if (vehicle.ownerId?._id !== currentUser?._id && vehicle.ownerId !== currentUser?._id) {
          showToast('You can only edit your own vehicles', 'error');
          navigate('/profile');
          return;
        }

        setFormData({
          name: vehicle.name || '',
          type: vehicle.type || '',
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          year: vehicle.year?.toString() || '',
          condition: vehicle.condition || '',
          description: vehicle.description || '',
          pricePerDay: vehicle.pricePerDay?.toString() || '',
          depositAmount: vehicle.depositAmount?.toString() || '',
          city: vehicle.location?.city || '',
          district: vehicle.location?.district || '',
          address: vehicle.location?.address || '',
          availableDays: vehicle.availability?.days || [],
          availableFrom: vehicle.availability?.timeFrom || '09:00',
          availableTo: vehicle.availability?.timeTo || '17:00',
          ownerName: vehicle.contact?.name || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''),
          contactNumber: vehicle.contact?.phone || currentUser?.phone || '',
          contactEmail: vehicle.contact?.email || currentUser?.email || '',
          features: vehicle.features || [],
          images: [],
          agreeTerms: true,
          agreeVerification: true,
          agreeInsurance: true,
        });

        // Set image previews from existing images
        if (vehicle.images && vehicle.images.length > 0) {
          setImagePreviews(vehicle.images);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load vehicle', 'error');
      navigate('/profile');
    } finally {
      setLoadingVehicle(false);
    }
  };

  useEffect(() => {
    updateCalculator();
  }, [formData.type, formData.pricePerDay]);

  const updateCalculator = () => {
    const dailyRate = parseFloat(formData.pricePerDay) || 0;
    const daysPerMonth = 15; // Default assumption
    const commission = 0.1; // 10% platform commission

    const dailyEarning = dailyRate * (1 - commission);
    const monthlyEarning = dailyEarning * daysPerMonth;
    const yearlyEarning = monthlyEarning * 12;

    setEarnings({
      daily: dailyEarning,
      monthly: monthlyEarning,
      yearly: yearlyEarning,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'agreeTerms' || name === 'agreeVerification' || name === 'agreeInsurance') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (name.startsWith('availableDays')) {
        const dayValue = (e.target as HTMLInputElement).value;
        setFormData(prev => ({
          ...prev,
          availableDays: prev.availableDays.includes(dayValue)
            ? prev.availableDays.filter(d => d !== dayValue)
            : [...prev.availableDays, dayValue]
        }));
      } else {
        const featureValue = (e.target as HTMLInputElement).value;
        setFormData(prev => ({
          ...prev,
          features: prev.features.includes(featureValue)
            ? prev.features.filter(f => f !== featureValue)
            : [...prev.features, featureValue]
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Create previews for new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // For new listings, require at least 3 photos. For edits, allow existing images
    const totalImages = formData.images.length + (isEditMode ? imagePreviews.filter(p => !p.startsWith('blob:')).length : 0);
    if (!isEditMode && formData.images.length < 3) {
      showToast('Please upload at least 3 photos of your vehicle', 'warning');
      return;
    }
    if (isEditMode && totalImages < 3) {
      showToast('Please ensure you have at least 3 photos (existing + new)', 'warning');
      return;
    }

    if (formData.availableDays.length === 0) {
      showToast('Please select at least one available day', 'warning');
      return;
    }

    if (!formData.agreeTerms || !formData.agreeVerification || !formData.agreeInsurance) {
      showToast('Please agree to all terms and conditions', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Upload new images (if any)
      let imageUrls: string[] = [];
      
      // In edit mode, keep existing images that are URLs (not blob URLs)
      if (isEditMode) {
        imageUrls = imagePreviews.filter(url => !url.startsWith('blob:'));
      }
      
      // Upload new images
      if (formData.images.length > 0) {
        const uploadResponse = await uploadAPI.uploadImages(formData.images);
        const newUrls = uploadResponse.images.map((img: any) => {
          const url = img.url || img;
          // If URL is already full URL, use it; otherwise it should already be from backend
          return url.startsWith('http') ? url : `http://localhost:5001${url}`;
        });
        imageUrls = [...imageUrls, ...newUrls];
      }

      // Create vehicle data
      const vehicleData = {
        name: formData.name,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : undefined,
        condition: formData.condition,
        description: formData.description,
        pricePerDay: parseFloat(formData.pricePerDay),
        depositAmount: parseFloat(formData.depositAmount),
        location: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          coordinates: {
            latitude: 0,
            longitude: 0
          }
        },
        contact: {
          name: formData.ownerName,
          phone: formData.contactNumber,
          email: formData.contactEmail,
        },
        features: formData.features,
        images: imageUrls,
        mainPhoto: imageUrls[0],
        availability: {
          days: formData.availableDays,
          timeFrom: formData.availableFrom,
          timeTo: formData.availableTo,
          isAvailableNow: true
        }
      };

      let response;
      if (isEditMode && editVehicleId) {
        // Update existing vehicle
        response = await vehiclesAPI.update(editVehicleId, vehicleData);
        if (response.success) {
          showToast('Vehicle updated successfully!', 'success');
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } else {
        // Create new vehicle
        response = await vehiclesAPI.create(vehicleData);
        if (response.success) {
          showToast('Vehicle listed successfully! Your vehicle is now live and available for rent.', 'success');
          setTimeout(() => {
            navigate('/rent');
          }, 2000);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to list vehicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loadingVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  const carFeatures = [
    'air-conditioning', 'gps', 'automatic', 'bluetooth', 'usb-charging', 'insurance'
  ];
  const motorbikeFeatures = [
    'helmet-included', 'automatic-scooter', 'fuel-efficient', 'storage-box', 'rain-cover', 'phone-holder'
  ];
  const bicycleFeatures = [
    'helmet-bicycle', 'lock-included', 'basket', 'lights', 'multi-speed', 'comfortable-seat'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="page-header relative bg-gradient-to-br from-primary-blue via-blue-600 to-primary-orange text-white py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{t.listVehicle.title}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">{t.listVehicle.subtitle}</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">{t.listVehicle.whyList}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.listVehicle.whyListDesc}</p>
          </div>
          
          <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="benefit-card group bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="benefit-icon w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.listVehicle.earnIncome}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.listVehicle.earnIncomeDesc}
              </p>
            </div>
            
            <div className="benefit-card group bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="benefit-icon w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.listVehicle.verifiedRenters}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.listVehicle.verifiedRentersDesc}
              </p>
            </div>
            
            <div className="benefit-card group bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="benefit-icon w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.listVehicle.gpsTracking}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.listVehicle.gpsTrackingDesc}
              </p>
            </div>
            
            <div className="benefit-card group bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="benefit-icon w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.listVehicle.securePayments}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.listVehicle.securePaymentsDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Form Section */}
      <section className="listing-form-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="form-container max-w-4xl mx-auto">
            <div className="form-header text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">
                {isEditMode ? t.listVehicle.editVehicle : t.listVehicle.listVehicle}
              </h2>
              <p className="text-xl text-gray-600">
                {isEditMode ? t.listVehicle.editDesc : t.listVehicle.listDesc}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="listing-form bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
              {/* Vehicle Information */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-car text-primary-orange"></i> {t.listVehicle.vehicleInfo}
                </h3>
                
                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.vehicleTitle}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Honda Click 2020"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.vehicleType}</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    >
                      <option value="">{t.listVehicle.selectType}</option>
                      <option value="car">{t.rent.car}</option>
                      <option value="motorbike">{t.rent.motorbike}</option>
                      <option value="bicycle">{t.rent.bicycle}</option>
                    </select>
                  </div>
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.brand}</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Honda, Toyota, Trek"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.model}</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Click, Camry, Mountain Bike"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.year}</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    >
                      <option value="">{t.listVehicle.selectYear}</option>
                      {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                      <option value="older">{t.listVehicle.older}</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.condition}</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    >
                      <option value="">{t.listVehicle.selectCondition}</option>
                      <option value="excellent">{t.listVehicle.excellent}</option>
                      <option value="good">{t.listVehicle.good}</option>
                      <option value="fair">{t.listVehicle.fair}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold mb-2">{t.listVehicle.description}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Describe your vehicle, its features, condition, and any special instructions for renters..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-camera text-primary-orange"></i> {t.listVehicle.photos}
                </h3>
                <p className="section-description text-gray-600 mb-4">{t.listVehicle.photosDesc}</p>
                
                <div className="photo-upload-container">
                  <div 
                    className="photo-upload-area border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-orange transition-colors bg-gray-50"
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 mb-2">Drag and drop photos here or click to select</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="vehiclePhotos"
                      name="vehiclePhotos"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-4 inline-block cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadAreaClick();
                      }}
                    >
                      Select Photos
                    </button>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="photo-preview-container grid grid-cols-3 gap-4 mt-6">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {formData.images[idx]?.name || `Photo ${idx + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {imagePreviews.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {imagePreviews.length} photo{imagePreviews.length !== 1 ? 's' : ''} selected
                      {imagePreviews.length < 3 && (
                        <span className="text-yellow-600 ml-2">({3 - imagePreviews.length} more needed)</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-tag text-primary-orange"></i> Pricing
                </h3>
                
                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.dailyPrice}</label>
                    <div className="input-with-icon relative">
                      <span className="input-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">$</span>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        step="0.01"
                        min="1"
                        required
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.deposit}</label>
                    <div className="input-with-icon relative">
                      <span className="input-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">$</span>
                      <input
                        type="number"
                        name="depositAmount"
                        value={formData.depositAmount}
                        onChange={handleChange}
                        step="0.01"
                        min="10"
                        required
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pricing-suggestions bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">{t.listVehicle.pricingSuggestions}</h4>
                  <div className="suggestion-grid grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="suggestion-item">
                      <strong>Cars:</strong> $25-50/day | Deposit: $150-300
                    </div>
                    <div className="suggestion-item">
                      <strong>Motorbikes:</strong> $6-12/day | Deposit: $30-80
                    </div>
                    <div className="suggestion-item">
                      <strong>Bicycles:</strong> $3-8/day | Deposit: $15-40
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary-orange"></i> {t.listVehicle.location}
                </h3>
                
                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.city}</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    >
                      <option value="">{t.listVehicle.selectCity}</option>
                      <option value="phnom-penh">Phnom Penh</option>
                      <option value="siem-reap">Siem Reap</option>
                      <option value="sihanoukville">Sihanoukville</option>
                      <option value="battambang">Battambang</option>
                      <option value="kampot">Kampot</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.district}</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Daun Penh, BKK1, Russian Market"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold mb-2">{t.listVehicle.pickupLocation}</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    required
                    placeholder="Provide detailed pickup location and any landmarks..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-calendar text-primary-orange"></i> {t.listVehicle.availability}
                </h3>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold mb-2">{t.listVehicle.availableDays}</label>
                  <div className="checkbox-group grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name={`availableDays-${day}`}
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.availableFrom}</label>
                    <input
                      type="time"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.availableUntil}</label>
                    <input
                      type="time"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-phone text-primary-orange"></i> {t.listVehicle.contactInfo}
                </h3>
                
                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.ownerName}</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold mb-2">{t.listVehicle.contactPhone}</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="+855 XX XXX XXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none hover:border-gray-300 transition-all"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold mb-2">{t.listVehicle.contactEmail}</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="form-section mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-list text-primary-orange"></i> {t.listVehicle.features}
                </h3>
                
                <div className="features-grid">
                  {formData.type === 'car' && (
                    <div className="feature-category mb-6">
                      <h4 className="font-semibold mb-4">{t.rent.car} {t.listVehicle.features}</h4>
                      <div className="checkbox-grid grid grid-cols-2 md:grid-cols-3 gap-3">
                        {carFeatures.map(feature => (
                          <label key={feature} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`feature-${feature}`}
                              value={feature}
                              checked={formData.features.includes(feature)}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.type === 'motorbike' && (
                    <div className="feature-category mb-6">
                      <h4 className="font-semibold mb-4">{t.rent.motorbike} {t.listVehicle.features}</h4>
                      <div className="checkbox-grid grid grid-cols-2 md:grid-cols-3 gap-3">
                        {motorbikeFeatures.map(feature => (
                          <label key={feature} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`feature-${feature}`}
                              value={feature}
                              checked={formData.features.includes(feature)}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.type === 'bicycle' && (
                    <div className="feature-category mb-6">
                      <h4 className="font-semibold mb-4">{t.rent.bicycle} {t.listVehicle.features}</h4>
                      <div className="checkbox-grid grid grid-cols-2 md:grid-cols-3 gap-3">
                        {bicycleFeatures.map(feature => (
                          <label key={feature} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`feature-${feature}`}
                              value={feature}
                              checked={formData.features.includes(feature)}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!formData.type && (
                    <p className="text-gray-600">Please select a vehicle type to see available features</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-section mb-8">
                <h3 className="text-xl font-bold text-primary-blue mb-6 flex items-center gap-2">
                  <i className="fas fa-file-contract text-primary-orange"></i> Terms & Conditions
                </h3>
                
                <div className="terms-container space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4"
                    />
                    <span className="text-gray-700">
                      I agree to the <a href="/terms-of-service" target="_blank" className="text-primary-orange hover:underline">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-primary-orange hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeVerification"
                      checked={formData.agreeVerification}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4"
                    />
                    <span className="text-gray-700">
                      I confirm that I am the legal owner of this vehicle and have the right to rent it out
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeInsurance"
                      checked={formData.agreeInsurance}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4"
                    />
                    <span className="text-gray-700">
                      I understand that I am responsible for maintaining valid insurance and registration for my vehicle
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-submit text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-large px-8 py-4 text-lg font-semibold"
                >
                  <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus-circle'} mr-2`}></i>
                  {loading ? (isEditMode ? t.listVehicle.updating : t.listVehicle.submitting) : (isEditMode ? t.listVehicle.update : t.listVehicle.submit)}
                </button>
                <p className="submit-note text-gray-600 mt-4">{t.listVehicle.listingReview}</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="earnings-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Calculate Your Potential Earnings</h2>
            <p className="text-lg text-gray-600">See how much you could earn by listing your vehicle</p>
          </div>
          
          <div className="calculator-container max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
            <div className="calculator-inputs grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="calc-group">
                <label className="block text-sm font-semibold mb-2">Vehicle Type</label>
                <select
                  value={formData.type}
                  onChange={handleChange}
                  name="type"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="car">Car</option>
                  <option value="motorbike">Motorbike</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              </div>
              
              <div className="calc-group">
                <label className="block text-sm font-semibold mb-2">Daily Rate ($)</label>
                <input
                  type="number"
                  value={formData.pricePerDay || ''}
                  onChange={handleChange}
                  name="pricePerDay"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none"
                />
              </div>
              
              <div className="calc-group">
                <label className="block text-sm font-semibold mb-2">Days Rented/Month</label>
                <input
                  type="number"
                  value="15"
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
            
            <div className="calculator-results bg-primary-blue text-white p-8 rounded-lg">
              <div className="earning-item flex justify-between items-center mb-4 pb-4 border-b border-white/20">
                <span className="earning-label text-lg">Daily Earnings:</span>
                <span className="earning-value text-2xl font-bold">${earnings.daily.toFixed(2)}</span>
              </div>
              <div className="earning-item flex justify-between items-center mb-4 pb-4 border-b border-white/20">
                <span className="earning-label text-lg">Monthly Earnings:</span>
                <span className="earning-value text-2xl font-bold">${earnings.monthly.toFixed(2)}</span>
              </div>
              <div className="earning-item flex justify-between items-center mb-4">
                <span className="earning-label text-lg">Yearly Earnings:</span>
                <span className="earning-value text-2xl font-bold">${earnings.yearly.toFixed(2)}</span>
              </div>
              <div className="commission-note text-sm opacity-80 mt-4">
                <small>*After 10% platform commission</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListVehicle;
