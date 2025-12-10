import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    accountType: 'both' as 'rent' | 'list' | 'both',
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.agreeTerms) {
          setError('Please agree to the Terms of Service');
          setLoading(false);
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          accountType: formData.accountType,
        });
        setError('');
        showToast('Registration successful! Welcome to RideShare Local!', 'success');
        setIsLogin(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="flex bg-white rounded-t-lg overflow-hidden shadow-md mb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 font-semibold transition-colors ${
                isLogin
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 font-semibold transition-colors ${
                !isLogin
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Card */}
          <div className="card p-8">
            <h2 className="text-3xl font-bold mb-2 text-center text-primary-blue">
              {isLogin ? 'Welcome Back!' : 'Join RideShare Local'}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {isLogin
                ? 'Log in to your RideShare Local account'
                : 'Create your account to start renting or listing vehicles'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                    placeholder="+855 XX XXX XXX"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none pr-10"
                    placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isLogin}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">I want to</label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                    >
                      <option value="rent">Rent vehicles</option>
                      <option value="list">List my vehicles</option>
                      <option value="both">Both rent and list vehicles</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required={!isLogin}
                      className="mt-1"
                    />
                    <label className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="/terms-of-service" className="text-primary-orange hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" className="text-primary-orange hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Processing...' : isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary-orange hover:underline font-semibold"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary-orange hover:underline font-semibold"
                  >
                    Log in here
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Verification Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <i className="fas fa-info-circle text-blue-600 mt-1"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">ID Verification Required</h4>
                <p className="text-sm text-blue-700">
                  After registration, you'll need to verify your identity with a government-issued ID to ensure platform security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
