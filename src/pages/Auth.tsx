import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ToastProvider';
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { language, t } = useLanguage();
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

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '', checks: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    }};
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    strength += checks.length ? 1 : 0;
    strength += checks.lowercase ? 1 : 0;
    strength += checks.uppercase ? 1 : 0;
    strength += checks.number ? 1 : 0;
    strength += checks.special ? 1 : 0;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-green-600' },
    ];

    return { 
      strength, 
      label: levels[Math.min(strength, 5)].label, 
      color: levels[Math.min(strength, 5)].color,
      checks 
    };
  };

  const passwordStrength = !isLogin && formData.password ? checkPasswordStrength(formData.password) : null;

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
        // Check password strength
        const strength = checkPasswordStrength(formData.password);
        if (strength.strength < 3) {
          setError(language === 'en' 
            ? 'Password is too weak. Please use a stronger password that meets all requirements.'
            : 'ពាក្យសម្ងាត់ខ្សោយពេក។ សូមប្រើពាក្យសម្ងាត់ដែលខ្លាំងជាងនេះ ដែលបំពេញតម្រូវការទាំងអស់។');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t.auth.passwordsNotMatch);
          setLoading(false);
          return;
        }
        if (!formData.agreeTerms) {
          setError(language === 'en'
            ? 'Please agree to the Terms of Service'
            : 'សូមយល់ព្រមជាមួយលក្ខខណ្ឌសេវា');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-lg mx-auto">
          {/* Toggle Buttons */}
          <div className="flex bg-white rounded-2xl overflow-hidden shadow-xl mb-6 border border-gray-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 font-semibold transition-all duration-300 relative ${
                isLogin
                  ? 'bg-gradient-to-r from-primary-orange to-orange-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.auth.login}
              {isLogin && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30"></span>
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 font-semibold transition-all duration-300 relative ${
                !isLogin
                  ? 'bg-gradient-to-r from-primary-orange to-orange-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.auth.signUp}
              {!isLogin && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30"></span>
              )}
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-blue to-blue-600 px-8 pt-8 pb-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  {isLogin ? (
                    <Lock className="w-8 h-8 text-white" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">
                  {isLogin ? t.auth.welcomeBack : t.auth.joinRideShare}
                </h2>
                <p className="text-blue-100">
                  {isLogin ? t.auth.loginSubtitle : t.auth.signUpSubtitle}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.auth.firstName}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none transition-all"
                          placeholder={t.auth.firstName}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.auth.lastName}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none transition-all"
                          placeholder={t.auth.lastName}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none transition-all"
                      placeholder={t.auth.email}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.auth.phone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required={!isLogin}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none transition-all"
                        placeholder="+855 XX XXX XXX"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.auth.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                        !isLogin && formData.password
                          ? passwordStrength && passwordStrength.strength >= 3
                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                            : passwordStrength && passwordStrength.strength >= 2
                            ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20'
                            : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20'
                      }`}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {!isLogin && formData.password && (
                    <div className="mt-3 space-y-2">
                      {/* Strength Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength?.color || 'bg-gray-300'}`}
                          style={{ width: `${((passwordStrength?.strength || 0) / 5) * 100}%` }}
                        />
                      </div>
                      
                      {/* Strength Label */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${
                          passwordStrength && passwordStrength.strength >= 3
                            ? 'text-green-600'
                            : passwordStrength && passwordStrength.strength >= 2
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {t.auth.passwordStrength}: {passwordStrength?.label || t.auth.veryWeak}
                        </span>
                        <span className="text-gray-500">{passwordStrength?.strength || 0}/5</span>
                      </div>
                      
                      {/* Requirements Checklist */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">{t.auth.passwordRequirements}:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            {passwordStrength?.checks.length ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={passwordStrength?.checks.length ? 'text-green-700' : 'text-gray-500'}>
                              {t.auth.atLeast8Chars}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordStrength?.checks.lowercase ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={passwordStrength?.checks.lowercase ? 'text-green-700' : 'text-gray-500'}>
                              {t.auth.oneLowercase}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordStrength?.checks.uppercase ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={passwordStrength?.checks.uppercase ? 'text-green-700' : 'text-gray-500'}>
                              {t.auth.oneUppercase}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordStrength?.checks.number ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={passwordStrength?.checks.number ? 'text-green-700' : 'text-gray-500'}>
                              {t.auth.oneNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordStrength?.checks.special ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={passwordStrength?.checks.special ? 'text-green-700' : 'text-gray-500'}>
                              {t.auth.oneSpecial}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.auth.confirmPassword}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required={!isLogin}
                          className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                            formData.confirmPassword
                              ? formData.password === formData.confirmPassword
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                                : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20'
                          }`}
                          placeholder={t.auth.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      
                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">{t.auth.passwordsMatch}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">{t.auth.passwordsNotMatch}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.auth.accountType}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                          name="accountType"
                          value={formData.accountType}
                          onChange={handleChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none transition-all appearance-none bg-white"
                        >
                          <option value="rent">{t.auth.rentVehicles}</option>
                          <option value="list">{t.auth.listVehicles}</option>
                          <option value="both">{t.auth.both}</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required={!isLogin}
                        className="mt-0.5 w-5 h-5 text-primary-orange border-gray-300 rounded focus:ring-primary-orange focus:ring-2"
                      />
                      <label className="text-sm text-gray-700 leading-relaxed">
                        {t.auth.agreeTerms}{' '}
                        <Link to="/terms-of-service" className="text-primary-orange hover:underline font-medium">
                          {t.auth.termsOfService}
                        </Link>{' '}
                        {t.auth.and}{' '}
                        <Link to="/privacy-policy" className="text-primary-orange hover:underline font-medium">
                          {t.auth.privacyPolicy}
                        </Link>
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-orange to-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.auth.processing}
                    </span>
                  ) : (
                    isLogin ? t.auth.login : t.auth.createAccount
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      {t.auth.dontHaveAccount}{' '}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-primary-orange hover:text-orange-600 font-semibold transition-colors"
                      >
                        {t.auth.signUpHere}
                      </button>
                    </>
                  ) : (
                    <>
                      {t.auth.alreadyHaveAccount}{' '}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-primary-orange hover:text-orange-600 font-semibold transition-colors"
                      >
                        {t.auth.loginHere}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          {!isLogin && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-5 shadow-md">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    {t.auth.idVerificationRequired}
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {t.auth.idVerificationText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
