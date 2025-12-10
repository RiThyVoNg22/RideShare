import React from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Car, 
  CreditCard,
  MessageSquare,
  FileText,
  Lock
} from 'lucide-react';

const SafetyGuidelines: React.FC = () => {
  const guidelines = [
    {
      category: 'For Renters',
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500',
      items: [
        {
          title: 'Verify Before Booking',
          description: 'Always check the vehicle owner\'s verification status and read reviews from previous renters before making a booking.',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: 'Inspect the Vehicle',
          description: 'Before accepting the vehicle, thoroughly inspect it for any existing damage. Take photos and report any issues immediately.',
          icon: <Car className="w-5 h-5" />
        },
        {
          title: 'Meet in Safe Locations',
          description: 'Arrange to meet the owner in a public, well-lit location for vehicle pickup and return. Avoid isolated areas.',
          icon: <Shield className="w-5 h-5" />
        },
        {
          title: 'Keep Communication on Platform',
          description: 'Use our secure messaging system for all communications. This protects both parties and provides a record of conversations.',
          icon: <MessageSquare className="w-5 h-5" />
        },
        {
          title: 'Follow Traffic Laws',
          description: 'Always drive responsibly, follow all traffic laws, and ensure you have a valid driver\'s license. You are responsible for any violations.',
          icon: <AlertTriangle className="w-5 h-5" />
        }
      ]
    },
    {
      category: 'For Vehicle Owners',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-500',
      items: [
        {
          title: 'Verify Your Identity',
          description: 'Complete ID verification to build trust with renters. Verified owners receive priority in search results.',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: 'Maintain Your Vehicle',
          description: 'Keep your vehicle in excellent condition. Regular maintenance ensures safety and positive reviews from renters.',
          icon: <Car className="w-5 h-5" />
        },
        {
          title: 'Document Everything',
          description: 'Take photos of your vehicle before and after each rental. Document any damage and communicate clearly with renters.',
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: 'Set Clear Expectations',
          description: 'Provide accurate vehicle descriptions, clear photos, and detailed terms. Be transparent about any limitations or requirements.',
          icon: <MessageSquare className="w-5 h-5" />
        },
        {
          title: 'Secure Your Payments',
          description: 'Use our secure payment system. Never accept cash payments or wire transfers outside the platform.',
          icon: <CreditCard className="w-5 h-5" />
        }
      ]
    }
  ];

  const safetyTips = [
    {
      title: 'Always Verify',
      description: 'Check verification badges and read reviews before any transaction.',
      icon: <Shield className="w-8 h-8 text-primary-orange" />
    },
    {
      title: 'Meet in Public',
      description: 'Choose safe, public locations for vehicle exchanges.',
      icon: <User className="w-8 h-8 text-primary-orange" />
    },
    {
      title: 'Document Everything',
      description: 'Take photos and keep records of all communications and transactions.',
      icon: <FileText className="w-8 h-8 text-primary-orange" />
    },
    {
      title: 'Report Issues',
      description: 'Immediately report any suspicious activity or safety concerns to our support team.',
      icon: <AlertTriangle className="w-8 h-8 text-primary-orange" />
    }
  ];

  const prohibited = [
    'Renting vehicles without proper verification',
    'Sharing personal contact information before booking confirmation',
    'Accepting payments outside the platform',
    'Renting to unverified users',
    'Misrepresenting vehicle condition or features',
    'Using the platform for illegal activities'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Safety Guidelines</h1>
            <p className="text-xl opacity-90">
              Your safety and security are our top priorities. Follow these guidelines to ensure a safe experience for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Quick Safety Tips */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {safetyTips.map((tip, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="flex justify-center mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-bold text-primary-blue mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Guidelines by Category */}
          <div className="space-y-8 mb-12">
            {guidelines.map((section, sectionIndex) => (
              <div key={sectionIndex} className="card overflow-hidden">
                <div className={`${section.color} text-white p-6 flex items-center gap-4`}>
                  <div className="bg-white/20 p-3 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.category}</h2>
                </div>
                
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-orange/10 rounded-lg flex items-center justify-center text-primary-orange">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-blue mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Prohibited Activities */}
          <div className="card border-2 border-red-200 bg-red-50 mb-12">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-700">Prohibited Activities</h2>
              </div>
              <p className="text-gray-700 mb-4">
                The following activities are strictly prohibited and may result in account suspension or legal action:
              </p>
              <ul className="space-y-2">
                {prohibited.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card p-8 bg-gradient-to-r from-primary-blue to-primary-orange text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Emergency Support
                </h3>
                <p className="opacity-90">
                  If you encounter a safety issue or emergency, contact us immediately
                </p>
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
                  Emergency Line
                </a>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 card p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">Additional Resources</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/help-center" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">Help Center</h4>
                <p className="text-sm text-gray-600">Find answers to common questions</p>
              </a>
              <a href="/terms-of-service" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">Terms of Service</h4>
                <p className="text-sm text-gray-600">Read our terms and conditions</p>
              </a>
              <a href="/privacy-policy" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">Privacy Policy</h4>
                <p className="text-sm text-gray-600">Learn how we protect your data</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyGuidelines;

