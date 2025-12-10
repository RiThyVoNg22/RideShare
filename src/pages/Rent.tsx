import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { vehiclesAPI } from '../services/api';
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
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="page-header bg-primary-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl opacity-90">Browse available vehicles in Cambodia or search for something specific</p>
        </div>
      </section>

      {/* Rent Section */}
      <section className="rent-section py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Advanced Search Filters */}
          <div className="search-filters bg-gray-100 p-8 rounded-2xl shadow-md mb-12">
            <div className="filter-row flex flex-wrap gap-4 items-end">
              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none bg-white"
                >
                  <option value="">All Locations</option>
                  <option value="phnom-penh">Phnom Penh</option>
                  <option value="siem-reap">Siem Reap</option>
                  <option value="sihanoukville">Sihanoukville</option>
                  <option value="battambang">Battambang</option>
                  <option value="kampot">Kampot</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Vehicle Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none bg-white"
                >
                  <option value="">All Types</option>
                  <option value="car">Car</option>
                  <option value="motorbike">Motorbike</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Max Price per Day</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="filter-select w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none bg-white"
                >
                  <option value="">Any Price</option>
                  <option value="0-10">$0 - $10</option>
                  <option value="10-25">$10 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50+">$50+</option>
                </select>
              </div>

              <div className="filter-group flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Availability</label>
                <input
                  type="date"
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="filter-input w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none bg-white"
                />
              </div>

              <div className="filter-group">
                <button
                  onClick={loadVehicles}
                  className="search-filter-btn btn btn-primary px-8 py-3 whitespace-nowrap"
                >
                  <i className="fas fa-search mr-2"></i> Search
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
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No vehicles found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search filters or browse all available vehicles.
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ location: '', type: '', priceRange: '', availability: '' });
                        loadVehicles();
                      }}
                      className="clear-filters-btn btn btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="vehicle-card bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="vehicle-image-container relative overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || vehicle.mainPhoto || '/RideShare/imge/placeholder.png'}
                      alt={vehicle.name}
                      className="vehicle-image w-full h-48 object-cover transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/RideShare/imge/placeholder.png';
                      }}
                    />
                    <div className={`vehicle-badge absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {vehicle.available ? 'Available' : 'Rented'}
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
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
                        {(vehicle.rating || 0).toFixed(1)} ({vehicle.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-orange">
                          ${vehicle.pricePerDay}/day
                        </div>
                        <div className="text-sm text-gray-600">
                          Deposit: ${vehicle.depositAmount || 0}
                        </div>
                      </div>
                      <Link
                        to={`/product/${vehicle._id}`}
                        className={`btn ${vehicle.available ? 'btn-primary' : 'btn-secondary'} ${
                          !vehicle.available ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {vehicle.available ? 'Rent Now' : 'Currently Rented'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {vehicles.length > 0 && (
            <div className="load-more-section text-center">
              <button className="load-more-btn btn btn-secondary">
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
