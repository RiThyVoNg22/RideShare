import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Book, 
  Shield, 
  CreditCard, 
  Car, 
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500',
      faqs: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" in the header, fill in your details (name, email, password, phone number), select your account type (Renter, Owner, or Both), and click "Sign Up". You\'ll receive a confirmation email to verify your account.'
        },
        {
          q: 'What account types are available?',
          a: 'You can choose to be a Renter (to rent vehicles), an Owner (to list your vehicles), or Both (to do both). You can change this later in your profile settings.'
        },
        {
          q: 'Do I need to verify my ID?',
          a: 'Yes, ID verification is required for security and to ensure a safe platform for all users. You can complete verification in your profile under "Verify ID".'
        }
      ]
    },
    {
      id: 'renting',
      title: 'Renting a Vehicle',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-500',
      faqs: [
        {
          q: 'How do I rent a vehicle?',
          a: 'Browse available vehicles on the Rent page, use filters to find what you need, click on a vehicle to see details, select your pickup and return dates, and complete the booking. You\'ll receive a confirmation with the owner\'s contact information.'
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept major credit cards, debit cards, and bank transfers. Payment is processed securely through our platform when you confirm your booking.'
        },
        {
          q: 'Can I cancel my booking?',
          a: 'Yes, you can cancel your booking from your profile. Cancellation policies vary by owner - check the vehicle listing for specific terms. Refunds are processed according to the cancellation policy.'
        },
        {
          q: 'What if the vehicle has issues?',
          a: 'Contact the owner immediately through the messaging system. If you cannot resolve the issue, contact our support team. We have a dispute resolution process to help resolve any problems.'
        }
      ]
    },
    {
      id: 'listing',
      title: 'Listing Your Vehicle',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-orange-500',
      faqs: [
        {
          q: 'How do I list my vehicle?',
          a: 'Go to "List Your Vehicle" in the header, fill in all vehicle details (make, model, year, photos, location, price), upload clear photos, set your availability, and submit. Your vehicle will be listed immediately after approval.'
        },
        {
          q: 'How much can I earn?',
          a: 'Earnings depend on your vehicle type, location, and pricing. Use our earnings calculator on the listing page to estimate potential income. Popular vehicles in high-demand areas typically earn more.'
        },
        {
          q: 'What are the requirements to list a vehicle?',
          a: 'You must be the legal owner, have valid registration and insurance, complete ID verification, and provide accurate vehicle information. All vehicles are subject to our safety standards.'
        },
        {
          q: 'How do I manage my listings?',
          a: 'Go to your Profile, click on the "Vehicles" tab. From there you can edit details, upload new photos, change pricing, enable/disable availability, and view booking history.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      faqs: [
        {
          q: 'How do you ensure safety?',
          a: 'We require ID verification for all users, verify vehicle ownership, provide secure messaging, have a review system, and offer 24/7 support. We also have safety guidelines that all users must follow.'
        },
        {
          q: 'What if something goes wrong?',
          a: 'Contact our support team immediately. We have a dedicated team to handle disputes, emergencies, and safety concerns. You can also contact the other party through our secure messaging system.'
        },
        {
          q: 'Is my personal information safe?',
          a: 'Yes, we use industry-standard encryption and security measures. Your personal information is only shared with verified users when necessary for bookings. See our Privacy Policy for details.'
        }
      ]
    }
  ];

  const popularArticles = [
    'How to complete ID verification',
    'Setting up your first vehicle listing',
    'Understanding cancellation policies',
    'Contacting vehicle owners',
    'Managing your bookings'
  ];

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.faqs.some(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
            <p className="text-xl opacity-90 mb-8">
              Find answers to common questions or contact our support team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Popular Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Book className="w-6 h-6 text-primary-orange" />
              Popular Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className="card p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-primary-orange"
                >
                  <h3 className="font-semibold text-primary-blue">{article}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary-orange" />
              Frequently Asked Questions
            </h2>

            {filteredCategories.length === 0 ? (
              <div className="card p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${category.color} text-white p-3 rounded-lg`}>
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-primary-blue">{category.title}</h3>
                    </div>
                    {openCategory === category.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {openCategory === category.id && (
                    <div className="px-6 pb-6 space-y-4">
                      {category.faqs.map((faq, index) => (
                        <div key={index} className="border-l-4 border-primary-orange pl-4">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            className="w-full text-left flex items-center justify-between mb-2"
                          >
                            <h4 className="font-semibold text-gray-800">{faq.q}</h4>
                            {openFAQ === index ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                            )}
                          </button>
                          {openFAQ === index && (
                            <p className="text-gray-600 mt-2">{faq.a}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-12 card p-8 bg-gradient-to-r from-primary-blue to-primary-orange text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                <p className="opacity-90">Our support team is here to assist you 24/7</p>
              </div>
              <div className="flex gap-4">
                <a
                  href="mailto:support@ridesharelocal.com"
                  className="btn bg-white text-primary-orange hover:bg-gray-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  Email Support
                </a>
                <a
                  href="tel:+85523123456"
                  className="btn bg-white text-primary-orange hover:bg-gray-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;

