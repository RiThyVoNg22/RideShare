import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { verificationAPI, uploadAPI } from '../services/api';
import Modal from '../components/Modal';
import { 
  Shield, Upload, X, CheckCircle, Clock, 
  Camera, AlertCircle
} from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
}

const VerifyID: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState({
    idType: '',
    idFront: null as UploadedFile | null,
    idBack: null as UploadedFile | null,
    selfieWithId: null as UploadedFile | null,
    drivingLicense: null as UploadedFile | null,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    // Show driving license field if user wants to list vehicles
    if (currentUser.accountType === 'list' || currentUser.accountType === 'both') {
      // Field will be shown in the form
    }
  }, [currentUser, navigate]);

  const handleFileSelect = (file: File, field: keyof typeof formData) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload JPG, PNG, or PDF', 'error');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size too large. Maximum size is 5MB', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        [field]: {
          file,
          preview: event.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idType) {
      showToast('Please select an ID type', 'warning');
      return;
    }

    if (!formData.idFront) {
      showToast('Please upload the front of your ID', 'warning');
      return;
    }

    if (!formData.idBack) {
      showToast('Please upload the back of your ID', 'warning');
      return;
    }

    if (!formData.selfieWithId) {
      showToast('Please upload a selfie holding your ID', 'warning');
      return;
    }

    // Check if driving license is recommended
    if ((currentUser?.accountType === 'list' || currentUser?.accountType === 'both') && !formData.drivingLicense) {
      const proceed = window.confirm('Driving license is recommended for listing vehicles. Continue without it?');
      if (!proceed) return;
    }

    try {
      setLoading(true);
      setUploading(true);
      setUploadProgress(0);

      // Upload all images
      const filesToUpload = [
        { file: formData.idFront.file, name: 'idFront' },
        { file: formData.idBack.file, name: 'idBack' },
        { file: formData.selfieWithId.file, name: 'selfieWithId' },
        formData.drivingLicense ? { file: formData.drivingLicense.file, name: 'drivingLicense' } : null,
      ].filter(Boolean) as Array<{ file: File; name: string }>;

      const uploadedUrls: Record<string, string> = {};
      let uploadedCount = 0;

      for (const { file, name } of filesToUpload) {
        try {
          const response = await uploadAPI.uploadImage(file);
          // Handle different response formats and convert relative URLs to absolute
          let url = response.url || response.image?.url || response.image || 
                   (response.image && typeof response.image === 'string' ? response.image : null);
          if (!url) {
            throw new Error('No URL returned from upload');
          }
          // Convert relative URL to absolute if needed
          if (url.startsWith('/uploads/')) {
            url = `http://localhost:5001${url}`;
          }
          uploadedUrls[name] = url;
          uploadedCount++;
          setUploadProgress((uploadedCount / filesToUpload.length) * 100);
        } catch (error: any) {
          throw new Error(`Failed to upload ${name}: ${error.message}`);
        }
      }

      // Submit verification
      const verificationResponse = await verificationAPI.submitVerification({
        documentType: formData.idType,
        frontImage: uploadedUrls.idFront,
        backImage: uploadedUrls.idBack,
        selfieImage: uploadedUrls.selfieWithId,
        drivingLicenseImage: uploadedUrls.drivingLicense,
      });

      if (!verificationResponse.success) {
        throw new Error(verificationResponse.message || 'Failed to submit verification');
      }

      setUploading(false);
      setLoading(false);
      setShowSuccessModal(true);
      showToast('Verification submitted successfully!', 'success');
    } catch (error: any) {
      setUploading(false);
      setLoading(false);
      showToast(error.message || 'Failed to submit verification', 'error');
    }
  };

  const handleSkip = async () => {
    if (!window.confirm('Are you sure you want to skip ID verification? You can verify later from your profile.')) {
      return;
    }

    try {
      await verificationAPI.skipVerification();
      showToast('You can verify your ID later from your profile', 'info');
      navigate('/');
    } catch (error: any) {
      showToast(error.message || 'Failed to skip verification', 'error');
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleContinue}
        title="Verification Submitted!"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Documents Submitted Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Your documents have been submitted successfully. We'll review them within 24-48 hours and notify you via email.
          </p>
          <button
            onClick={handleContinue}
            className="btn btn-primary w-full"
          >
            Continue to Dashboard
          </button>
        </div>
      </Modal>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">Account Created</div>
                  <div className="text-sm text-gray-600">✓ Completed</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-primary-orange mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">ID Verification</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-500">Complete</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Card */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-orange" />
              </div>
              <h1 className="text-3xl font-bold text-primary-blue mb-2">Verify Your Identity</h1>
              <p className="text-gray-600">To ensure platform security, please upload your government-issued ID</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID Type Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Select ID Type *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none"
                >
                  <option value="">Choose ID type</option>
                  <option value="national-id">National ID Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving-license">Driving License</option>
                </select>
              </div>

              {/* ID Front Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Front of ID *</label>
                <FileUploadArea
                  file={formData.idFront}
                  onFileSelect={(file) => handleFileSelect(file, 'idFront')}
                  onRemove={() => removeFile('idFront')}
                  accept="image/*"
                />
              </div>

              {/* ID Back Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Back of ID *</label>
                <FileUploadArea
                  file={formData.idBack}
                  onFileSelect={(file) => handleFileSelect(file, 'idBack')}
                  onRemove={() => removeFile('idBack')}
                  accept="image/*"
                />
              </div>

              {/* Selfie Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Selfie Holding ID *</label>
                <FileUploadArea
                  file={formData.selfieWithId}
                  onFileSelect={(file) => handleFileSelect(file, 'selfieWithId')}
                  onRemove={() => removeFile('selfieWithId')}
                  accept="image/*"
                  icon={<Camera className="w-8 h-8" />}
                  description="Take or upload a selfie holding your ID"
                />
              </div>

              {/* Driving License (Optional) */}
              {(currentUser.accountType === 'list' || currentUser.accountType === 'both') && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Driving License (Optional)
                    <span className="text-xs text-gray-500 ml-2">Recommended for listing vehicles</span>
                  </label>
                  <FileUploadArea
                    file={formData.drivingLicense}
                    onFileSelect={(file) => handleFileSelect(file, 'drivingLicense')}
                    onRemove={() => removeFile('drivingLicense')}
                    accept="image/*"
                  />
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">Uploading documents...</span>
                    <span className="text-sm text-blue-700">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-primary-orange h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Guidelines */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Guidelines for ID Verification
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Ensure all text on the ID is clearly readable</li>
                  <li>ID should be valid and not expired</li>
                  <li>Photos should be well-lit without glare</li>
                  <li>Your face should be clearly visible in the selfie</li>
                  <li>Documents will be reviewed within 24-48 hours</li>
                </ul>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Your Privacy is Protected</h4>
                  <p className="text-sm text-green-700">
                    All documents are encrypted and stored securely. We only use them for verification purposes.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn btn-outline flex-1"
                  disabled={loading || uploading}
                >
                  <Clock className="w-4 h-4" />
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={loading || uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// File Upload Area Component
interface FileUploadAreaProps {
  file: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  icon?: React.ReactNode;
  description?: string;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  file,
  onFileSelect,
  onRemove,
  accept = 'image/*',
  icon,
  description,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  if (file) {
    return (
      <div className="relative border-2 border-primary-orange rounded-lg p-4 bg-primary-orange/5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={file.preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{file.file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-primary-orange bg-primary-orange/10'
          : 'border-gray-300 hover:border-primary-orange hover:bg-gray-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {icon || <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />}
      <p className="text-gray-600 font-semibold mb-1">
        {description || 'Click to upload or drag and drop'}
      </p>
      <p className="text-sm text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
    </div>
  );
};

export default VerifyID;
