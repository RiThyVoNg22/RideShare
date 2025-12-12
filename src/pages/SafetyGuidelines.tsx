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
import { useLanguage } from '../contexts/LanguageContext';

const SafetyGuidelines: React.FC = () => {
  const { t } = useLanguage();
  
  const guidelines = [
    {
      category: t.safetyGuidelines.forRenters,
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500',
      items: [
        {
          title: t.safetyGuidelines.verifyBeforeBooking,
          description: t.safetyGuidelines.verifyBeforeBookingDesc,
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.inspectVehicle,
          description: t.safetyGuidelines.inspectVehicleDesc,
          icon: <Car className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.meetSafeLocations,
          description: t.safetyGuidelines.meetSafeLocationsDesc,
          icon: <Shield className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.keepCommunication,
          description: t.safetyGuidelines.keepCommunicationDesc,
          icon: <MessageSquare className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.followTrafficLaws,
          description: t.safetyGuidelines.followTrafficLawsDesc,
          icon: <AlertTriangle className="w-5 h-5" />
        }
      ]
    },
    {
      category: t.safetyGuidelines.forOwners,
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-500',
      items: [
        {
          title: t.safetyGuidelines.verifyIdentity,
          description: t.safetyGuidelines.verifyIdentityDesc,
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.maintainVehicle,
          description: t.safetyGuidelines.maintainVehicleDesc,
          icon: <Car className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.documentEverythingOwner,
          description: t.safetyGuidelines.documentEverythingOwnerDesc,
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.setClearExpectations,
          description: t.safetyGuidelines.setClearExpectationsDesc,
          icon: <MessageSquare className="w-5 h-5" />
        },
        {
          title: t.safetyGuidelines.securePayments,
          description: t.safetyGuidelines.securePaymentsDesc,
          icon: <CreditCard className="w-5 h-5" />
        }
      ]
    }
  ];

  const safetyTips = [
    {
      title: t.safetyGuidelines.alwaysVerify,
      description: t.safetyGuidelines.alwaysVerifyDesc,
      icon: <Shield className="w-8 h-8 text-primary-orange" />
    },
    {
      title: t.safetyGuidelines.meetInPublic,
      description: t.safetyGuidelines.meetInPublicDesc,
      icon: <User className="w-8 h-8 text-primary-orange" />
    },
    {
      title: t.safetyGuidelines.documentEverything,
      description: t.safetyGuidelines.documentEverythingDesc,
      icon: <FileText className="w-8 h-8 text-primary-orange" />
    },
    {
      title: t.safetyGuidelines.reportIssues,
      description: t.safetyGuidelines.reportIssuesDesc,
      icon: <AlertTriangle className="w-8 h-8 text-primary-orange" />
    }
  ];

  const prohibited = [
    t.safetyGuidelines.prohibited1,
    t.safetyGuidelines.prohibited2,
    t.safetyGuidelines.prohibited3,
    t.safetyGuidelines.prohibited4,
    t.safetyGuidelines.prohibited5,
    t.safetyGuidelines.prohibited6
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.safetyGuidelines.title}</h1>
            <p className="text-xl opacity-90">
              {t.safetyGuidelines.subtitle}
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
                <h2 className="text-2xl font-bold text-red-700">{t.safetyGuidelines.prohibitedTitle}</h2>
              </div>
              <p className="text-gray-700 mb-4">
                {t.safetyGuidelines.prohibitedDesc}
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
                  {t.safetyGuidelines.emergencySupport}
                </h3>
                <p className="opacity-90">
                  {t.safetyGuidelines.emergencyDesc}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="mailto:support@ridesharelocal.com"
                  className="btn bg-white text-primary-orange hover:bg-gray-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.helpCenter.emailSupport}
                </a>
                <a
                  href="tel:+85523123456"
                  className="btn bg-white text-primary-orange hover:bg-gray-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.safetyGuidelines.emergencyLine}
                </a>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 card p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">{t.safetyGuidelines.additionalResources}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/help-center" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">{t.safetyGuidelines.helpCenter}</h4>
                <p className="text-sm text-gray-600">{t.safetyGuidelines.helpCenterDesc}</p>
              </a>
              <a href="/terms-of-service" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">{t.safetyGuidelines.termsOfService}</h4>
                <p className="text-sm text-gray-600">{t.safetyGuidelines.termsDesc}</p>
              </a>
              <a href="/privacy-policy" className="p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-md transition-all">
                <h4 className="font-semibold text-primary-blue mb-2">{t.safetyGuidelines.privacyPolicy}</h4>
                <p className="text-sm text-gray-600">{t.safetyGuidelines.privacyDesc}</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyGuidelines;

