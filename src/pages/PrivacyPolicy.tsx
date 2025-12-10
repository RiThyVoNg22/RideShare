import React from 'react';
import { Shield, Lock, Mail, Phone, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const dataTypes = [
    {
      title: 'Personal Information',
      icon: <Shield className="w-6 h-6" />,
      items: ['Full name and contact details', 'Email address and phone number', 'Date of birth and government ID', 'Driver\'s license information', 'Profile photos']
    },
    {
      title: 'Vehicle Information',
      icon: <Shield className="w-6 h-6" />,
      items: ['Vehicle details and specifications', 'Registration and insurance documents', 'Vehicle photos and descriptions', 'Pricing and availability settings']
    },
    {
      title: 'Financial Information',
      icon: <Shield className="w-6 h-6" />,
      items: ['Payment method details', 'Billing and transaction history', 'Bank account information (for payouts)', 'Tax identification numbers']
    },
    {
      title: 'Location Data',
      icon: <Shield className="w-6 h-6" />,
      items: ['GPS coordinates during rentals', 'Pickup and drop-off locations', 'Travel routes and destinations', 'IP address and general location']
    },
    {
      title: 'Usage Information',
      icon: <Shield className="w-6 h-6" />,
      items: ['Platform interaction data', 'Search queries and preferences', 'Device and browser information', 'Log files and analytics data']
    },
    {
      title: 'Communication Data',
      icon: <Shield className="w-6 h-6" />,
      items: ['Messages between users', 'Customer support interactions', 'Reviews and ratings', 'Feedback and survey responses']
    }
  ];

  const privacyRights = [
    { right: 'Access', description: 'Request a copy of the personal information we hold about you' },
    { right: 'Correction', description: 'Update or correct inaccurate personal information' },
    { right: 'Deletion', description: 'Request deletion of your personal information (with some limitations)' },
    { right: 'Portability', description: 'Export your data in a structured, machine-readable format' },
    { right: 'Objection', description: 'Object to processing based on legitimate interests' },
    { right: 'Restriction', description: 'Limit how we process your information in certain circumstances' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">How we collect, use, and protect your personal information</p>
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

            <div className="bg-primary-blue text-white p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Privacy at a Glance
              </h3>
              <p className="opacity-90">
                At RideShare Local, your privacy and data security are fundamental to our service. We collect only the information necessary to provide a safe, secure vehicle rental platform. We never sell your personal data to third parties, and we use industry-standard security measures to protect your information.
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This Privacy Policy explains how RideShare Local ("we," "our," or "us") collects, uses, processes, and protects your personal information when you use our vehicle rental platform and related services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you consent to the collection and use of your information as described in this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">2. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We collect several types of information to provide and improve our services:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {dataTypes.map((type, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-orange">
                      <h4 className="font-bold text-primary-blue mb-3 flex items-center gap-2">
                        {type.icon}
                        {type.title}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {type.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">3. How We Collect Information</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Account registration and profile setup</li>
                  <li>Vehicle listing creation</li>
                  <li>Booking and payment processes</li>
                  <li>Customer support communications</li>
                  <li>Survey responses and feedback</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>GPS location data during rentals</li>
                  <li>Device and browser information</li>
                  <li>Platform usage patterns</li>
                  <li>Log files and performance data</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Identity verification services</li>
                  <li>Payment processors</li>
                  <li>Social media platforms (with your consent)</li>
                  <li>Government databases for license verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">4. How We Use Your Information</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Service Provision</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Create and manage user accounts</li>
                  <li>Facilitate vehicle rentals and bookings</li>
                  <li>Process payments and handle deposits</li>
                  <li>Provide customer support services</li>
                  <li>Enable communication between users</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Safety and Security</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Verify user identities and credentials</li>
                  <li>Monitor platform for fraudulent activity</li>
                  <li>Track vehicle locations during rentals</li>
                  <li>Investigate and resolve disputes</li>
                  <li>Ensure compliance with terms of service</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Platform Improvement</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Analyze usage patterns and preferences</li>
                  <li>Develop new features and services</li>
                  <li>Optimize platform performance</li>
                  <li>Conduct research and analytics</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Communications</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Send booking confirmations and updates</li>
                  <li>Provide important service notifications</li>
                  <li>Share promotional offers (with consent)</li>
                  <li>Respond to inquiries and support requests</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">5. Information Sharing</h2>
                <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-6 rounded-lg my-6">
                  <h4 className="font-bold text-primary-blue mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    We Never Sell Your Data
                  </h4>
                  <p className="text-gray-700">
                    RideShare Local never sells, rents, or trades your personal information to third parties for marketing purposes. We only share your information in the specific circumstances outlined below.
                  </p>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 With Other Users</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Profile information (name, photo, ratings) when booking or listing</li>
                  <li>Contact details during active rentals</li>
                  <li>Vehicle location information during rentals</li>
                  <li>Reviews and ratings after completed rentals</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 With Service Providers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Payment processors for transaction handling</li>
                  <li>ID verification services for security purposes</li>
                  <li>Cloud hosting providers for data storage</li>
                  <li>Analytics services for platform improvement</li>
                  <li>Customer support tools and services</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Legal Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Compliance with legal obligations</li>
                  <li>Response to government requests</li>
                  <li>Protection of our rights and property</li>
                  <li>Investigation of suspected illegal activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">6. Your Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-6">You have several rights regarding your personal information:</p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary-blue text-white">
                        <th className="border border-gray-300 p-3 text-left">Right</th>
                        <th className="border border-gray-300 p-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {privacyRights.map((right, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="border border-gray-300 p-3 font-semibold text-gray-800">{right.right}</td>
                          <td className="border border-gray-300 p-3 text-gray-700">{right.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Exercising Your Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  To exercise these rights, contact us at <a href="mailto:privacy@ridesharelocal.com" className="text-primary-orange hover:underline">privacy@ridesharelocal.com</a>. We will respond within 30 days of receiving your request.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">7. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We implement comprehensive security measures to protect your personal information:</p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.1 Technical Safeguards</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure HTTPS connections for all communications</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication for admin access</li>
                  <li>Automated backup systems with encryption</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Organizational Measures</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Employee privacy training and confidentiality agreements</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Regular security awareness training</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">8. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We retain your personal information only as long as necessary for the purposes outlined in this policy:</p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.1 Account Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Active accounts: Retained while account is active</li>
                  <li>Closed accounts: Deleted within 90 days unless legal obligations require retention</li>
                  <li>Financial records: Retained for 7 years for tax and audit purposes</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Rental Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Booking information: Retained for 3 years</li>
                  <li>GPS tracking data: Deleted within 30 days after rental completion</li>
                  <li>Payment records: Retained for 7 years</li>
                  <li>Dispute-related data: Retained until resolution plus 1 year</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  RideShare Local is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have inadvertently collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. When we make significant changes:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We will notify you via email and platform notifications</li>
                  <li>We will post the updated policy on our website</li>
                  <li>We will update the "Last Updated" date</li>
                  <li>Continued use constitutes acceptance of the changes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4 border-l-4 border-primary-orange pl-4">11. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-6">For privacy-related inquiries, you can contact us:</p>
                <div className="bg-primary-blue text-white p-8 rounded-lg">
                  <h4 className="text-xl font-bold mb-6 text-center">Privacy Contact Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      <a href="mailto:privacy@ridesharelocal.com" className="text-primary-orange hover:underline">
                        privacy@ridesharelocal.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      <a href="mailto:dpo@ridesharelocal.com" className="text-primary-orange hover:underline">
                        dpo@ridesharelocal.com
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
                  </div>
                </div>
              </section>

              <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-6 rounded-lg mt-8">
                <h4 className="font-bold text-primary-blue mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Questions About Your Privacy?
                </h4>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy or how we handle your personal information, we encourage you to contact us. We're committed to addressing your concerns promptly and transparently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
