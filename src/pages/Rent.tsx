import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { vehiclesAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import { Heart, MapPin } from 'lucide-react';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  location: {
    city?: string;
    district?: string;
  };
  pricePerDay: number;
  depositAmount: number;
  available: boolean;
  images?: string[];
  mainPhoto?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
}

const Rent: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    priceRange: '',
    availability: '',
  });

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      
      if (filters.location) filterParams.location = filters.location;
      if (filters.type) filterParams.type = filters.type;
      if (filters.availability) filterParams.available = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map((p) => {
          if (p === '50+') return null;
          return parseFloat(p) || 0;
        });
        if (filters.priceRange === '50+') {
          filterParams.minPrice = 50;
        } else {
          if (min !== null) filterParams.minPrice = min;
          if (max !== null) filterParams.maxPrice = max;
        }
      }

      const response = await vehiclesAPI.getAll(filterParams);
      let filteredVehicles = response.vehicles || [];

      // Additional client-side filtering for price range
      if (filters.priceRange && filters.priceRange !== '50+') {
        const [min, max] = filters.priceRange.split('-').map(p => parseFloat(p) || 0);
        filteredVehicles = filteredVehicles.filter((v: Vehicle) => 
          v.pricePerDay >= min && v.pricePerDay <= max
        );
      }

      setVehicles(filteredVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    return location?.city || location?.district || 'Location';
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
          <p className="text-gray-600">{t.rent.loadingVehicles}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{t.rent.findPerfectRide}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">{t.rent.browseAvailable}</p>
        </div>
      </section>

      {/* Rent Section */}
      <section className="rent-section py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Advanced Search Filters */}
          <div className="search-filters bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12 backdrop-blur-sm">
            <div className="filter-row flex flex-wrap gap-4 items-end">
              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.rent.location}</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none bg-white hover:border-gray-300 transition-all"
                >
                  <option value="">{t.rent.allLocations}</option>
                  <option value="phnom-penh">Phnom Penh</option>
                  <option value="siem-reap">Siem Reap</option>
                  <option value="sihanoukville">Sihanoukville</option>
                  <option value="battambang">Battambang</option>
                  <option value="kampot">Kampot</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.rent.vehicleType}</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none bg-white hover:border-gray-300 transition-all"
                >
                  <option value="">{t.rent.allTypes}</option>
                  <option value="car">{t.rent.car}</option>
                  <option value="motorbike">{t.rent.motorbike}</option>
                  <option value="bicycle">{t.rent.bicycle}</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.rent.maxPricePerDay}</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none bg-white hover:border-gray-300 transition-all"
                >
                  <option value="">{t.rent.anyPrice}</option>
                  <option value="0-10">$0 - $10</option>
                  <option value="10-25">$10 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50+">$50+</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.rent.availability}</label>
                <input
                  type="date"
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="filter-input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none bg-white hover:border-gray-300 transition-all"
                />
              </div>

              <div className="filter-group">
                <button
                  onClick={loadVehicles}
                  className="search-filter-btn bg-gradient-to-r from-primary-orange to-orange-600 text-white px-8 py-3 rounded-xl font-semibold whitespace-nowrap hover:from-orange-600 hover:to-primary-orange transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-search mr-2"></i> {t.rent.search}
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="vehicles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {vehicles.length === 0 ? (
              <div className="col-span-full">
                <div className="no-results text-center py-20">
                  <div className="no-results-content">
                    <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">{t.rent.noVehiclesFound}</h3>
                    <p className="text-gray-600 mb-6">
                      {t.rent.noVehiclesDesc}
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ location: '', type: '', priceRange: '', availability: '' });
                        loadVehicles();
                      }}
                      className="clear-filters-btn bg-gradient-to-r from-primary-orange to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-primary-orange transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t.rent.clearFilters}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="vehicle-card group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="vehicle-image-container relative overflow-hidden">
                    <img
                      src={normalizeImageUrl(vehicle.images?.[0] || vehicle.mainPhoto)}
                      alt={vehicle.name}
                      className="vehicle-image w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/RideShare/imge/placeholder.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className={`vehicle-badge absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
                      vehicle.available ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}>
                      {vehicle.available ? t.common.available : t.common.unavailable}
                    </div>
                    <button className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                      <span className="text-sm text-gray-500 capitalize">{vehicle.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {vehicle.location?.district || ''}, {formatLocation(vehicle.location)}
                      </span>
                    </div>
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {vehicle.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {generateStars(vehicle.rating || 0)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(vehicle.rating || 0).toFixed(1)} ({vehicle.reviewCount || 0} {t.rent.reviews})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-orange to-orange-600 bg-clip-text text-transparent">
                          ${vehicle.pricePerDay}/{t.rent.perDay}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.rent.deposit}: ${vehicle.depositAmount || 0}
                        </div>
                      </div>
                      <Link
                        to={`/product/${vehicle._id}`}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          vehicle.available 
                            ? 'bg-gradient-to-r from-primary-orange to-orange-600 text-white hover:from-orange-600 hover:to-primary-orange' 
                            : 'bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {vehicle.available ? t.rent.rentNow : t.rent.currentlyRented}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {vehicles.length > 0 && (
            <div className="load-more-section text-center mt-12">
              <button className="load-more-btn px-8 py-3 bg-white border-2 border-primary-orange text-primary-orange rounded-xl font-semibold hover:bg-primary-orange hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <i className="fas fa-plus mr-2"></i> Load More Vehicles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rent;
