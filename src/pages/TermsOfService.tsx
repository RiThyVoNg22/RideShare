import React from 'react';
import { FileText, Shield, AlertTriangle, Mail, Phone, MapPin, Clock } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90">Please read these terms carefully before using our platform</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card p-8 md:p-12">
            <div className="bg-gray-100 p-4 rounded-lg mb-8 italic text-gray-600">
              <strong>Last Updated:</strong> January 15, 2025
            </div>

            <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-6 rounded-lg mb-8">
              <h4 className="font-bold text-primary-blue mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Important Notice
              </h4>
              <p className="text-gray-700">
                By using RideShare Local, you agree to these Terms of Service. Please read them carefully as they contain important information about your rights and obligations.
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to RideShare Local ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our vehicle rental platform and services. By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">2. Platform Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  RideShare Local is a digital marketplace that connects vehicle owners ("Hosts") with individuals seeking to rent vehicles ("Renters") in Cambodia. We provide the technology platform but do not own, operate, or manage any vehicles listed on our platform.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Our Role</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We provide a technology platform for connecting Hosts and Renters</li>
                  <li>We facilitate payment processing and deposit handling</li>
                  <li>We provide customer support and dispute resolution services</li>
                  <li>We maintain security features including ID verification and GPS tracking</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">3. Eligibility and Account Registration</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Eligibility Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>You must be at least 18 years old</li>
                  <li>You must be legally authorized to enter into contracts</li>
                  <li>You must provide accurate and complete registration information</li>
                  <li>You must complete government-issued ID verification</li>
                  <li>For vehicle listings, you must be the legal owner or authorized to rent the vehicle</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Security</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>You are liable for all activities that occur under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">4. Host Responsibilities</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Vehicle Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Vehicles must be legally registered and properly insured</li>
                  <li>Vehicles must meet safety and operational standards</li>
                  <li>Accurate descriptions and photos must be provided</li>
                  <li>Availability calendars must be kept up-to-date</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Host Obligations</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Respond to rental requests within 24 hours</li>
                  <li>Provide clean, safe, and properly functioning vehicles</li>
                  <li>Meet renters at agreed pickup/drop-off locations</li>
                  <li>Report any incidents or damages immediately</li>
                  <li>Maintain valid insurance coverage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">5. Renter Responsibilities</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Rental Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Possess a valid driver's license (for cars and motorbikes)</li>
                  <li>Be at least 21 years old for car rentals</li>
                  <li>Complete ID verification process</li>
                  <li>Provide accurate rental information</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 During Rental Period</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Use vehicles safely and in accordance with local laws</li>
                  <li>Return vehicles in the same condition as received</li>
                  <li>Report any incidents or mechanical issues immediately</li>
                  <li>Allow GPS tracking during rental period</li>
                  <li>Not use vehicles for commercial purposes without explicit permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">6. Payments and Fees</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Service Fees</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Renters pay a service fee of 5% per booking (3% for Saver Plan, 0% for Premium Plan)</li>
                  <li>Hosts pay a commission fee of 10% per completed rental</li>
                  <li>Payment processing fees may apply</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Security Deposits</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Security deposits are held during the rental period</li>
                  <li>Deposits are released within 48 hours after successful vehicle return</li>
                  <li>Deposits may be used to cover damages, cleaning fees, or other charges</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Cancellation Policy</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Free cancellation up to 24 hours before pickup time</li>
                  <li>50% refund for cancellations between 24-2 hours before pickup</li>
                  <li>No refund for cancellations within 2 hours of pickup</li>
                  <li>Full refund if Host cancels the booking</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">7. Insurance and Liability</h2>
                <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-6 rounded-lg my-6">
                  <h4 className="font-bold text-primary-blue mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Important Insurance Information
                  </h4>
                  <p className="text-gray-700">
                    RideShare Local does not provide insurance coverage. Vehicle insurance is the responsibility of the Host. Renters should verify insurance coverage before each rental.
                  </p>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Host Insurance Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Hosts must maintain valid comprehensive vehicle insurance</li>
                  <li>Insurance must cover rental activities</li>
                  <li>Hosts are responsible for ensuring insurance validity</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Limitation of Liability</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>RideShare Local acts as an intermediary platform only</li>
                  <li>We are not liable for accidents, damages, or injuries during rentals</li>
                  <li>Users participate in rentals at their own risk</li>
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">8. Prohibited Activities</h2>
                <p className="text-gray-700 leading-relaxed mb-4">The following activities are strictly prohibited:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Using false or misleading information</li>
                  <li>Circumventing our payment system</li>
                  <li>Using vehicles for illegal activities</li>
                  <li>Subletting or transferring rental agreements</li>
                  <li>Tampering with GPS tracking systems</li>
                  <li>Harassing or discriminating against other users</li>
                  <li>Creating multiple accounts to avoid restrictions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">9. Dispute Resolution</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.1 Resolution Process</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Report disputes within 24 hours of rental completion</li>
                  <li>Provide documentation and evidence</li>
                  <li>Cooperate with our investigation process</li>
                  <li>Accept our final decision on disputes</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Damage Claims</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Document vehicle condition before and after rental</li>
                  <li>Report damages immediately</li>
                  <li>Provide photos and repair estimates</li>
                  <li>Allow third-party assessment if required</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">10. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which forms part of these Terms. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">11. Platform Modifications</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Modify or discontinue any aspect of our platform</li>
                  <li>Update these Terms at any time</li>
                  <li>Suspend or terminate user accounts for violations</li>
                  <li>Remove listings that don't meet our standards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">12. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The RideShare Local platform, including its design, functionality, and content, is protected by intellectual property laws. Users may not copy, modify, or distribute our intellectual property without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">13. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by the laws of the Kingdom of Cambodia. Any disputes arising from these Terms or use of our services will be subject to the jurisdiction of Cambodian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">14. Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We may terminate or suspend your account at any time for violations of these Terms. Upon termination:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your access to the platform will be revoked</li>
                  <li>Outstanding bookings will be handled according to our policies</li>
                  <li>Pending payments will be processed according to our standard procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">15. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-6">If you have questions about these Terms of Service, please contact us:</p>
                <div className="bg-primary-blue text-white p-8 rounded-lg">
                  <h4 className="text-xl font-bold mb-6 text-center">Contact RideShare Local</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      <a href="mailto:legal@ridesharelocal.com" className="text-primary-orange hover:underline">
                        legal@ridesharelocal.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      <a href="tel:+85523123456" className="text-primary-orange hover:underline">
                        +855 23 123 456
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>Phnom Penh, Cambodia</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>Mon-Fri, 9:00 AM - 6:00 PM ICT</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-6 rounded-lg mt-8">
                <h4 className="font-bold text-primary-blue mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Changes to Terms
                </h4>
                <p className="text-gray-700">
                  We may update these Terms of Service from time to time. We will notify users of significant changes via email or platform notifications. Continued use of our services after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
