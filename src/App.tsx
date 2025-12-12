import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Rent from './pages/Rent';
import ProductDetail from './pages/ProductDetail';
import ListVehicle from './pages/ListVehicle';
import HowItWorks from './pages/HowItWorks';
import VerifyID from './pages/VerifyID';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpCenter from './pages/HelpCenter';
import SafetyGuidelines from './pages/SafetyGuidelines';
import Profile from './pages/Profile';
import AdminVerifications from './pages/AdminVerifications';
import AdminCommissions from './pages/AdminCommissions';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/list-vehicle" element={<ListVehicle />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/verify-id" element={<VerifyID />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/verifications" element={<AdminVerifications />} />
              <Route path="/admin/commissions" element={<AdminCommissions />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

