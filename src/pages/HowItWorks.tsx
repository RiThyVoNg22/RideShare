import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { UserPlus, Search, CalendarCheck, Key, UserCheck, Car, Users, DollarSign, Shield, MapPin, CreditCard, Headphones, FileText, Star, ChevronDown, ChevronUp } from 'lucide-react';


const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{t.howItWorks.title}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">{t.howItWorks.subtitle}</p>
        </div>
      </section>

      {/* How It Works - For Renters */}
      <section className="how-it-works-section py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">{t.howItWorks.forRenters}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.howItWorks.forRentersDesc}</p>
          </div>
          
          <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step1Renter}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step1RenterDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>{t.auth.firstName} {t.auth.lastName}, {t.auth.email}, {t.auth.phone}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>{t.auth.idVerificationRequired}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>{t.auth.phone} verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>{t.howItWorks.securePayments}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Search className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step2Renter}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step2RenterDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Filter by location, price, and vehicle type</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>View high-quality photos and descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Check owner ratings and reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Compare prices and features</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <CalendarCheck className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step3Renter}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step3RenterDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Choose rental duration and dates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Pay securely through the platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Receive instant booking confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Get pickup location and contact details</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Key className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step4Renter}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step4RenterDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Meet owner at agreed pickup location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Inspect vehicle condition together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Receive keys and important instructions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Enjoy your rental experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - For Owners */}
      <section className="how-it-works-section alt-bg py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">{t.howItWorks.forOwners}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.howItWorks.forOwnersDesc}</p>
          </div>
          
          <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step1Owner}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step1OwnerDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Complete profile with ID verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Provide vehicle registration documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Set up secure payment receiving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Complete background verification</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Car className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step2Owner}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step2OwnerDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Add high-quality photos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Write detailed description</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Set competitive daily rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Define availability schedule</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step3Owner}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step3OwnerDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Receive instant booking notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Review renter profiles and ratings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Accept or decline rental requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Coordinate pickup arrangements</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card group bg-white p-8 rounded-2xl shadow-lg text-center relative border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="step-number absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <div className="step-icon my-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{t.howItWorks.step4Owner}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t.howItWorks.step4OwnerDesc}
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Meet renter at pickup location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Inspect vehicle condition together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Monitor rental through GPS tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Receive automatic payment after return</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Security Features */}
      <section className="safety-section py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">{t.howItWorks.safetyTitle}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.howItWorks.safetySubtitle}</p>
          </div>
          
          <div className="safety-features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{t.howItWorks.idVerification}</h3>
              <p className="text-gray-600">{t.howItWorks.idVerificationDesc}</p>
            </div>
            
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.howItWorks.gpsTracking}</h3>
              <p className="text-gray-600 leading-relaxed">{t.howItWorks.gpsTrackingDesc}</p>
            </div>
            
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.howItWorks.securePayments}</h3>
              <p className="text-gray-600 leading-relaxed">{t.howItWorks.securePaymentsDesc}</p>
            </div>
            
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.howItWorks.support247}</h3>
              <p className="text-gray-600 leading-relaxed">{t.howItWorks.support247Desc}</p>
            </div>
            
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Digital Contracts</h3>
              <p className="text-gray-600 leading-relaxed">Clear rental agreements with terms and conditions for every transaction.</p>
            </div>
            
            <div className="safety-feature group text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="safety-icon w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Rating System</h3>
              <p className="text-gray-600 leading-relaxed">Transparent rating and review system builds trust and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-orange bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about RideShare Local</p>
          </div>
          
          <div className="faq-container space-y-4">
            {[
              {
                q: "How do I verify my identity?",
                a: "Upload a clear photo of your government-issued ID (National ID, Passport, or Driver's License) during registration. Our team will verify your identity within 24 hours."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept ABA Pay, Wing, Pi Pay, and major credit/debit cards. All payments are processed securely through encrypted channels."
              },
              {
                q: "What happens if there's damage to the vehicle?",
                a: "Vehicle condition is documented before and after rental. Any damage is assessed and covered by the security deposit. Our support team helps resolve disputes fairly."
              },
              {
                q: "Can I cancel my booking?",
                a: "Yes, you can cancel bookings according to our cancellation policy. Free cancellation is available up to 24 hours before pickup time."
              },
              {
                q: "How much can I earn as a vehicle owner?",
                a: "Earnings depend on your vehicle type, location, and availability. Car owners typically earn $25-50/day, motorbike owners $6-12/day, and bicycle owners $3-8/day."
              }
            ].map((faq, index) => (
              <div key={index} className="faq-item bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="faq-question w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.q}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-orange flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-orange flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="faq-answer p-6 pt-0 text-gray-600 leading-relaxed animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-24 relative bg-gradient-to-br from-primary-blue via-blue-600 to-primary-orange text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">{t.howItWorks.readyToStart}</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed">
            {t.howItWorks.readyToStartDesc}
          </p>
          
          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-blue font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              {t.howItWorks.findVehicle}
            </Link>
            <Link to="/list-vehicle" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t.nav.listVehicle}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
