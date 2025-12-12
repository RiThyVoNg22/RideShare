import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Car, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  HelpCircle,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-orange to-primary-blue rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-orange to-primary-blue bg-clip-text text-transparent">
                RideShare Local
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-orange rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-orange/50"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-blue rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-blue/50"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/50"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary-orange" />
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-orange transition-all duration-300"></span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  to="/rent" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-orange transition-all duration-300"></span>
                  Rent a Vehicle
                </Link>
              </li>
              <li>
                <Link 
                  to="/list-vehicle" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-orange transition-all duration-300"></span>
                  List Your Vehicle
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-orange transition-all duration-300"></span>
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-orange" />
              {t.footer.support}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help-center" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/safety-guidelines" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-300 hover:text-primary-orange transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-orange" />
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gray-700 group-hover:bg-primary-orange rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{t.footer.email}</p>
                  <a 
                    href="mailto:support@ridesharelocal.com" 
                    className="text-gray-300 hover:text-primary-orange transition-colors text-sm break-all"
                  >
                    support@ridesharelocal.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gray-700 group-hover:bg-primary-orange rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{t.footer.phone}</p>
                  <a 
                    href="tel:+85523123456" 
                    className="text-gray-300 hover:text-primary-orange transition-colors text-sm"
                  >
                    +855 23 123 456
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gray-700 group-hover:bg-primary-orange rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{t.footer.location}</p>
                  <p className="text-gray-300 text-sm">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {t.footer.rights}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>{t.footer.madeWith} ❤️ {t.footer.inCambodia}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

