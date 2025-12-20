import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !bookingId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payments/verify-session/${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.paid) {
          setVerified(true);
          showToast('Payment successful! Your booking is confirmed.', 'success');
        } else {
          showToast('Payment verification failed. Please contact support.', 'error');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        showToast('Error verifying payment. Please check your bookings.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, bookingId, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-primary-orange animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {verified ? (
              <>
                <div className="mb-6">
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                  <p className="text-gray-600">Your booking has been confirmed.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>You will receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Contact the vehicle owner through the chat system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Check your bookings in your profile</span>
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
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification</h1>
                  <p className="text-gray-600">
                    We're having trouble verifying your payment. Don't worry - if you were charged, 
                    your booking will be processed shortly.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link to="/profile" className="btn btn-primary">
                    Check My Bookings
                  </Link>
                  <Link to="/" className="btn btn-secondary">
                    Go Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

