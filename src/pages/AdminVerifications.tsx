import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { verificationAPI } from '../services/api';
import Modal from '../components/Modal';
import { 
  Shield, Clock, CheckCircle, XCircle, Eye, 
  AlertCircle, User
} from 'lucide-react';

interface Verification {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt?: string;
  };
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  frontImage: string;
  backImage?: string;
  selfieImage?: string;
  drivingLicenseImage?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  rejectionReason?: string;
  notes?: string;
}

const AdminVerifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (!currentUser.isAdmin && currentUser.role !== 'admin') {
      showToast('Access denied. Admin privileges required.', 'error');
      navigate('/');
      return;
    }

    loadVerifications();
  }, [currentUser, navigate, filter]);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = filter === 'all' 
        ? await verificationAPI.getAllVerifications()
        : await verificationAPI.getAllVerifications(filter);
      
      if (response.success) {
        setVerifications(response.verifications || []);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load verifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await verificationAPI.getVerificationById(id);
      if (response.success) {
        setSelectedVerification(response.verification);
        setShowModal(true);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load verification details', 'error');
    }
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;

    try {
      setProcessing(true);
      const response = await verificationAPI.approveVerification(
        selectedVerification._id,
        notes || undefined
      );

      if (response.success) {
        showToast('Verification approved successfully', 'success');
        setShowApproveModal(false);
        setShowModal(false);
        setNotes('');
        setSelectedVerification(null);
        loadVerifications();
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to approve verification', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'warning');
      return;
    }

    try {
      setProcessing(true);
      const response = await verificationAPI.rejectVerification(
        selectedVerification._id,
        rejectionReason,
        notes || undefined
      );

      if (response.success) {
        showToast('Verification rejected', 'success');
        setShowRejectModal(false);
        setShowModal(false);
        setRejectionReason('');
        setNotes('');
        setSelectedVerification(null);
        loadVerifications();
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to reject verification', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser || (!currentUser.isAdmin && currentUser.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="text-primary-orange" size={32} />
                ID Verification Review
              </h1>
              <p className="text-gray-600 mt-2">Review and approve/reject user ID verifications</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({verifications.filter(v => v.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Verifications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <p className="text-gray-600 mt-4 text-lg">No {filter === 'all' ? '' : filter} verifications found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {verifications.map((verification) => (
              <div key={verification._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {getStatusBadge(verification.status)}
                      <span className="text-sm text-gray-500">
                        Submitted: {formatDate(verification.submittedAt)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                        <User size={20} />
                        {verification.userId.firstName} {verification.userId.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">{verification.userId.email}</p>
                      {verification.userId.phone && (
                        <p className="text-gray-600 text-sm">Phone: {verification.userId.phone}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Document Type:</span>{' '}
                        {verification.documentType?.replace('_', ' ').toUpperCase() || 'N/A'}
                      </p>
                    </div>

                    {verification.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">
                          <span className="font-semibold">Rejection Reason:</span>{' '}
                          {verification.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {verification.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowApproveModal(true);
                          }}
                          className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          <CheckCircle size={18} className="inline mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowRejectModal(true);
                          }}
                          className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          <XCircle size={18} className="inline mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleViewDetails(verification._id)}
                      className="btn btn-primary px-4 py-2 rounded-lg"
                    >
                      <Eye size={18} className="inline mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVerification(null);
        }}
        title="Verification Details"
      >
        {selectedVerification && (
          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">User Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-semibold">Name:</span> {selectedVerification.userId.firstName} {selectedVerification.userId.lastName}</p>
                <p><span className="font-semibold">Email:</span> {selectedVerification.userId.email}</p>
                {selectedVerification.userId.phone && (
                  <p><span className="font-semibold">Phone:</span> {selectedVerification.userId.phone}</p>
                )}
                <p><span className="font-semibold">Document Type:</span> {selectedVerification.documentType?.replace('_', ' ').toUpperCase()}</p>
                <p><span className="font-semibold">Status:</span> {getStatusBadge(selectedVerification.status)}</p>
                <p><span className="font-semibold">Submitted:</span> {formatDate(selectedVerification.submittedAt)}</p>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedVerification.frontImage && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Front of ID</p>
                    <img
                      src={selectedVerification.frontImage}
                      alt="Front of ID"
                      className="w-full rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                {selectedVerification.backImage && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Back of ID</p>
                    <img
                      src={selectedVerification.backImage}
                      alt="Back of ID"
                      className="w-full rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                {selectedVerification.selfieImage && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Selfie with ID</p>
                    <img
                      src={selectedVerification.selfieImage}
                      alt="Selfie"
                      className="w-full rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                {selectedVerification.drivingLicenseImage && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Driving License</p>
                    <img
                      src={selectedVerification.drivingLicenseImage}
                      alt="Driving License"
                      className="w-full rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {selectedVerification.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowApproveModal(true);
                  }}
                  className="btn bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <CheckCircle size={18} className="inline mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowRejectModal(true);
                  }}
                  className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  <XCircle size={18} className="inline mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setNotes('');
        }}
        title="Approve Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to approve this verification for{' '}
            <strong>{selectedVerification?.userId.firstName} {selectedVerification?.userId.lastName}</strong>?
          </p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              rows={3}
              placeholder="Add any notes about this approval..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowApproveModal(false);
                setNotes('');
              }}
              className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="btn bg-green-600 hover:bg-green-700 text-white flex-1"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Approve'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
          setNotes('');
        }}
        title="Reject Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to reject this verification for{' '}
            <strong>{selectedVerification?.userId.firstName} {selectedVerification?.userId.lastName}</strong>?
          </p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              rows={3}
              placeholder="Please provide a reason for rejection (this will be shown to the user)..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional, Internal)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              rows={2}
              placeholder="Internal notes (not shown to user)..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setNotes('');
              }}
              className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminVerifications;

