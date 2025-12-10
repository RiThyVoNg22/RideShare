import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">RideShare Local</h4>
            <p className="text-gray-300 text-sm">
              Connecting vehicle owners with renters across Cambodia for safe, transparent, and convenient transportation solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-primary-orange transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Rent a Vehicle
                </Link>
              </li>
              <li>
                <Link to="/list-vehicle" className="text-gray-300 hover:text-primary-orange transition-colors">
                  List Your Vehicle
                </Link>
              </li>
              <li>
                <a href="#support" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#help" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#safety" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-primary-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@ridesharelocal.com</li>
              <li>Phone: +855 23 123 456</li>
              <li>Phnom Penh, Cambodia</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 RideShare Local. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

