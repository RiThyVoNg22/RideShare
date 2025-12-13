import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, MapPin, DollarSign, Smartphone, Search, Car, Bike, ArrowRight, CheckCircle } from 'lucide-react';

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
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        id="home"
        className="hero relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Optional Map Background with Overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/RideShare/imge/map.png)' }}
        ></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Main Heading with Animation */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-blue via-blue-600 to-primary-orange bg-clip-text text-transparent leading-tight">
              {t.home.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              {t.home.searchPlaceholder}
            </p>
          </div>
          
          {/* Modern Search Section */}
          <div className="search-section max-w-4xl mx-auto animate-fade-in-up">
            <div className="search-container bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-3 items-center hover:shadow-3xl transition-all duration-300">
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  placeholder={t.home.searchPlaceholder}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <select 
                className="flex-1 border-none px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange text-gray-700 cursor-pointer transition-all"
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
                className="bg-gradient-to-r from-primary-orange to-orange-600 text-white border-none px-8 py-3 rounded-xl font-semibold cursor-pointer hover:from-orange-600 hover:to-primary-orange transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>{t.home.search}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Vehicle Type Quick Select */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              <Link 
                to="/rent?type=car" 
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{t.home.rentCar}</span>
              </Link>
              <Link 
                to="/rent?type=motorbike" 
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{t.home.rentBike}</span>
              </Link>
              <Link 
                to="/rent?type=bicycle" 
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{t.home.rentBicycle}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">
              {t.home.quickLinks}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your perfect ride for any journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Car Card */}
            <Link 
              to="/rent?type=car" 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{t.home.rentCar}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t.home.carDescription}
                </p>
                <div className="flex items-center justify-center text-primary-blue font-semibold group-hover:text-primary-orange transition-colors">
                  <span>{t.home.findCar}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Bike Card */}
            <Link 
              to="/rent?type=motorbike" 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bike className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{t.home.rentBike}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t.home.bikeDescription}
                </p>
                <div className="flex items-center justify-center text-primary-blue font-semibold group-hover:text-primary-orange transition-colors">
                  <span>{t.home.findBike}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Bicycle Card */}
            <Link 
              to="/rent?type=bicycle" 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bike className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{t.home.rentBicycle}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t.home.bicycleDescription}
                </p>
                <div className="flex items-center justify-center text-primary-blue font-semibold group-hover:text-primary-orange transition-colors">
                  <span>{t.home.findBicycle}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">
              {t.home.whyChoose}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for a safe and convenient ride-sharing experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.home.idVerified}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.home.idVerifiedDesc}
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.home.gpsTracking}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.home.gpsTrackingDesc}
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.home.transparentPricing}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.home.transparentPricingDesc}
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.home.easyBooking}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.home.easyBookingDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative bg-gradient-to-br from-primary-blue via-blue-600 to-primary-orange text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">{t.home.readyToStart}</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 leading-relaxed">
              {t.home.readyToStartDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/rent" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-blue font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>{t.home.startRenting}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/list-vehicle" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>{t.nav.listVehicle}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

