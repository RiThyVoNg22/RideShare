import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, MapPin, DollarSign, Smartphone } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = () => {
    if (searchLocation) {
      navigate(`/rent?location=${searchLocation}`);
    } else {
      navigate('/rent');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        id="home"
        className="hero relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat py-16"
        style={{ backgroundImage: 'url(/RideShare/imge/map.png)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-primary-blue">{t.home.heroTitle}</h1>
          
          <div className="search-section max-w-3xl mx-auto">
            <div className="search-container bg-white rounded-full p-2 shadow-lg flex flex-col md:flex-row gap-2 items-center">
              <input
                type="text"
                className="search-input flex-2 border-none px-6 py-3 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:border-2 focus:border-primary-orange"
                placeholder={t.home.searchPlaceholder}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <select 
                className="search-select flex-1 border-none px-4 py-3 rounded-full bg-gray-100 focus:bg-white focus:outline-none"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              >
                <option value="">{t.home.location}</option>
                <option value="phnom-penh">Phnom Penh</option>
                <option value="siem-reap">Siem Reap</option>
                <option value="sihanoukville">Sihanoukville</option>
                <option value="battambang">Battambang</option>
              </select>
              <button 
                onClick={handleSearch}
                className="search-btn bg-primary-orange text-white border-none px-8 py-3 rounded-full font-semibold cursor-pointer hover:bg-orange-600 transition-all"
              >
                {t.home.search}
              </button>
            </div>
            
            <div className="vehicle-icons flex justify-center gap-32 mt-8">
              <img src="/RideShare/imge/8.png" alt="Vehicle type" className="h-20 w-auto" />
              <img src="/RideShare/imge/9.png" alt="Vehicle type" className="h-20 w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-blue">{t.home.quickLinks}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Car Card */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-car text-3xl text-primary-orange"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.home.rentCar}</h3>
              <p className="text-gray-600 mb-4">Car | Par</p>
              <p className="text-gray-600 mb-6">
                {t.home.carDescription}
              </p>
              <Link to="/rent?type=car" className="btn btn-primary w-full">
                {t.home.findCar}
              </Link>
            </div>

            {/* Bike Card */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-motorcycle text-3xl text-primary-orange"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.home.rentBike}</h3>
              <p className="text-gray-600 mb-4">Swer | Car</p>
              <p className="text-gray-600 mb-6">
                {t.home.bikeDescription}
              </p>
              <Link to="/rent?type=motorbike" className="btn btn-primary w-full">
                {t.home.findBike}
              </Link>
            </div>

            {/* Bicycle Card */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bicycle text-3xl text-primary-orange"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.home.rentBicycle}</h3>
              <p className="text-gray-600 mb-4">Motorby | Car</p>
              <p className="text-gray-600 mb-6">
                {t.home.bicycleDescription}
              </p>
              <Link to="/rent?type=bicycle" className="btn btn-primary w-full">
                {t.home.findBicycle}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-blue">{t.home.whyChoose}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.home.idVerified}</h3>
              <p className="text-gray-600">
                {t.home.idVerifiedDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.home.gpsTracking}</h3>
              <p className="text-gray-600">
                {t.home.gpsTrackingDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.home.transparentPricing}</h3>
              <p className="text-gray-600">
                {t.home.transparentPricingDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.home.easyBooking}</h3>
              <p className="text-gray-600">
                {t.home.easyBookingDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-blue to-primary-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.home.readyToStart}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t.home.readyToStartDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent" className="btn bg-white text-primary-blue hover:bg-gray-100">
              {t.home.startRenting}
            </Link>
            <Link to="/list-vehicle" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-blue">
              {t.nav.listVehicle}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

