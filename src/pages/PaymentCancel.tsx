import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <XCircle className="w-24 h-24 text-orange-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
              <p className="text-gray-600">
                Your booking was not completed. No charges were made.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-xl font-semibold mb-4">What happened?</h2>
              <p className="text-gray-700 mb-4">
                You cancelled the payment process. Your booking request has been saved 
                but is not confirmed until payment is completed.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>No payment was processed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Your booking is still pending</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>You can complete payment from your bookings page</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/profile" className="btn btn-primary">
                View My Bookings
              </Link>
              <Link to="/" className="btn btn-secondary">
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;

