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
import { useLanguage } from '../contexts/LanguageContext';

const HelpCenter: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: t.helpCenter.gettingStarted,
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500',
      faqs: [
        {
          q: t.helpCenter.faq1Q,
          a: t.helpCenter.faq1A
        },
        {
          q: t.helpCenter.faq2Q,
          a: t.helpCenter.faq2A
        },
        {
          q: t.helpCenter.faq3Q,
          a: t.helpCenter.faq3A
        }
      ]
    },
    {
      id: 'renting',
      title: t.helpCenter.renting,
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-500',
      faqs: [
        {
          q: t.helpCenter.faq4Q,
          a: t.helpCenter.faq4A
        },
        {
          q: t.helpCenter.faq5Q,
          a: t.helpCenter.faq5A
        },
        {
          q: t.helpCenter.faq6Q,
          a: t.helpCenter.faq6A
        },
        {
          q: t.helpCenter.faq7Q,
          a: t.helpCenter.faq7A
        }
      ]
    },
    {
      id: 'listing',
      title: t.helpCenter.listing,
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-orange-500',
      faqs: [
        {
          q: t.helpCenter.faq8Q,
          a: t.helpCenter.faq8A
        },
        {
          q: t.helpCenter.faq9Q,
          a: t.helpCenter.faq9A
        },
        {
          q: t.helpCenter.faq10Q,
          a: t.helpCenter.faq10A
        },
        {
          q: t.helpCenter.faq11Q,
          a: t.helpCenter.faq11A
        }
      ]
    },
    {
      id: 'safety',
      title: t.helpCenter.safety,
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      faqs: [
        {
          q: t.helpCenter.faq12Q,
          a: t.helpCenter.faq12A
        },
        {
          q: t.helpCenter.faq13Q,
          a: t.helpCenter.faq13A
        },
        {
          q: t.helpCenter.faq14Q,
          a: t.helpCenter.faq14A
        }
      ]
    }
  ];

  const popularArticles = [
    t.helpCenter.popular1,
    t.helpCenter.popular2,
    t.helpCenter.popular3,
    t.helpCenter.popular4,
    t.helpCenter.popular5
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.helpCenter.title}</h1>
            <p className="text-xl opacity-90 mb-8">
              {t.helpCenter.subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.helpCenter.searchPlaceholder}
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
              {t.helpCenter.popularArticles}
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
              {t.helpCenter.faq}
            </h2>

            {filteredCategories.length === 0 ? (
              <div className="card p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t.helpCenter.noResults}</h3>
                <p className="text-gray-600">{t.helpCenter.noResultsText}</p>
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
                <h3 className="text-2xl font-bold mb-2">{t.helpCenter.stillNeedHelp}</h3>
                <p className="opacity-90">{t.helpCenter.support247}</p>
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
                  {t.helpCenter.callUs}
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

