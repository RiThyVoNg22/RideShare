import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, CalendarCheck, Key, UserCheck, Car, Users, DollarSign, Shield, MapPin, CreditCard, Headphones, FileText, Star, ChevronDown, ChevronUp } from 'lucide-react';


const HowItWorks: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="page-header bg-primary-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How RideShare Local Works</h1>
          <p className="text-xl opacity-90">Learn how to rent or list vehicles safely and easily on our platform</p>
        </div>
      </section>

      {/* How It Works - For Renters */}
      <section className="how-it-works-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">For Renters</h2>
            <p className="text-lg text-gray-600">Find and rent the perfect vehicle in just a few simple steps</p>
          </div>
          
          <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <UserPlus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Create Your Account</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Sign up with your email and verify your government-issued ID for secure access to the platform.
              </p>
              <div className="step-details text-left mt-4">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Provide basic contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Upload clear photo of your ID</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Complete phone number verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-orange font-bold mr-2">•</span>
                    <span>Set up secure payment method</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Search & Browse</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Use GPS-enabled search to find available vehicles near you with transparent pricing and detailed information.
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
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <CalendarCheck className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Book & Pay</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Select your rental dates, make secure payment, and communicate directly with the vehicle owner.
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
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <Key className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Pick Up & Enjoy</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Meet the owner, inspect the vehicle, and start your journey with complete peace of mind.
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
      <section className="how-it-works-section alt-bg py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">For Vehicle Owners</h2>
            <p className="text-lg text-gray-600">Start earning from your unused vehicle with complete security</p>
          </div>
          
          <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <UserCheck className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Register & Verify</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Create your owner account and complete verification to start listing your vehicles.
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
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <Car className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">List Your Vehicle</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Upload photos, set your pricing, and describe your vehicle with all important details.
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
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Accept Bookings</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Review rental requests, communicate with renters, and approve bookings that meet your criteria.
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
            
            <div className="step-card bg-white p-8 rounded-lg shadow-md text-center relative border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="step-number absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div className="step-icon text-primary-blue text-5xl my-4">
                <DollarSign className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Earn Money</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Hand over your vehicle, track the rental through GPS, and receive payment automatically.
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
      <section className="safety-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Safety & Security Features</h2>
            <p className="text-lg text-gray-600">Your safety and security are our top priorities</p>
          </div>
          
          <div className="safety-features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">ID Verification</h3>
              <p className="text-gray-600">All users must verify their identity with government-issued ID before using the platform.</p>
            </div>
            
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">GPS Tracking</h3>
              <p className="text-gray-600">Real-time location tracking ensures vehicle security and helps resolve any disputes.</p>
            </div>
            
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Secure Payments</h3>
              <p className="text-gray-600">All payments are processed securely with automatic deposit handling and refunds.</p>
            </div>
            
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support with dispute resolution for any issues.</p>
            </div>
            
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Digital Contracts</h3>
              <p className="text-gray-600">Clear rental agreements with terms and conditions for every transaction.</p>
            </div>
            
            <div className="safety-feature text-center">
              <div className="safety-icon w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Rating System</h3>
              <p className="text-gray-600">Transparent rating and review system builds trust and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find answers to common questions about RideShare Local</p>
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
              <div key={index} className="faq-item bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
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
                  <div className="faq-answer p-6 pt-0 text-gray-600 leading-relaxed">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16 bg-primary-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join RideShare Local today and experience the safest way to rent or share vehicles in Cambodia.
          </p>
          
          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent" className="btn bg-primary-orange text-white hover:bg-orange-600 px-8 py-3 rounded-full font-semibold">
              Find a Vehicle
            </Link>
            <Link to="/list-vehicle" className="btn bg-white text-primary-blue hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
              List Your Vehicle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
