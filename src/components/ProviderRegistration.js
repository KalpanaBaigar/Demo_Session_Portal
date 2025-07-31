import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Building, 
  MapPin, 
  GraduationCap,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import './ProviderRegistration.css';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  medicalLicense: yup.string().required('Medical license number is required'),
  specialization: yup.string().required('Specialization is required'),
  yearsExperience: yup.number()
    .min(0, 'Years of experience must be 0 or greater')
    .max(50, 'Years of experience cannot exceed 50')
    .required('Years of experience is required'),
  qualifications: yup.string().required('Medical qualifications are required'),
  clinicName: yup.string().required('Clinic/Hospital name is required'),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('ZIP code is required'),
  practiceType: yup.string().required('Practice type is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  termsAccepted: yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const specializations = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Internal Medicine',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Oncology',
  'Emergency Medicine',
  'Family Medicine',
  'Obstetrics & Gynecology',
  'Radiology',
  'Anesthesiology',
  'Pathology',
  'General Surgery',
  'Other'
];

const practiceTypes = [
  'Private Practice',
  'Hospital',
  'Clinic',
  'Urgent Care',
  'Specialty Center',
  'Academic Medical Center',
  'Government Facility',
  'Other'
];

const ProviderRegistration = ({ onSwitchToLogin, onBackToSelector, onRegistrationSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null); // eslint-disable-line no-unused-vars
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const watchedPassword = watch('password', '');

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    return strength;
  };

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchedPassword));
  }, [watchedPassword]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['medicalLicense', 'specialization', 'yearsExperience', 'qualifications'];
      case 3:
        return ['clinicName', 'street', 'city', 'state', 'zipCode', 'practiceType'];
      case 4:
        return ['password', 'confirmPassword', 'termsAccepted'];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      
      // Call the registration success callback with user data
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess({
            id: 'provider-new',
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            type: 'provider',
            specialization: data.specialization
          });
        }, 3000); // Give user time to see success message
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Professional Information';
      case 3: return 'Practice Information';
      case 4: return 'Account Security';
      default: return '';
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <User size={20} />;
      case 2: return <Stethoscope size={20} />;
      case 3: return <Building size={20} />;
      case 4: return <Shield size={20} />;
      default: return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="registration-success">
        <div className="success-content">
          <CheckCircle size={64} className="success-icon" />
          <h2>Registration Successful!</h2>
          <p>Thank you for registering as a healthcare provider.</p>
          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li>Check your email for verification link</li>
              <li>Complete your profile setup</li>
              <li>Wait for account approval (1-2 business days)</li>
            </ul>
          </div>
          <button 
            className="btn-primary"
            onClick={() => {
              if (onRegistrationSuccess) {
                onRegistrationSuccess({
                  id: 'provider-new',
                  name: 'New Provider',
                  email: 'provider@example.com',
                  type: 'provider',
                  specialization: 'General Practice'
                });
              }
            }}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-registration">
      <div className="registration-container">
        <header className="registration-header">
          <div className="header-content">
            <Stethoscope size={32} className="header-icon" />
            <h1>Provider Registration</h1>
            <p>Join our network of healthcare professionals</p>
          </div>
        </header>

        <div className="progress-bar">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <span className="step-label">{getStepTitle(step)}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          {currentStep === 1 && (
            <div className="form-step">
              <div className="step-header">
                {getStepIcon(1)}
                <h2>{getStepTitle(1)}</h2>
              </div>
              
              <div className="photo-upload-section">
                <label className="photo-upload-label">Profile Photo</label>
                <div className="photo-upload-area">
                  {photoPreview ? (
                    <div className="photo-preview">
                      <img src={photoPreview} alt="Profile preview" />
                      <button 
                        type="button" 
                        className="remove-photo"
                        onClick={removePhoto}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={32} />
                      <p>Click to upload photo</p>
                      <span>JPG, PNG up to 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <div className="input-wrapper">
                    <User size={20} className="input-icon" />
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.firstName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <div className="input-wrapper">
                    <User size={20} className="input-icon" />
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <div className="input-wrapper">
                  <Phone size={20} className="input-icon" />
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <div className="step-header">
                {getStepIcon(2)}
                <h2>{getStepTitle(2)}</h2>
              </div>

              <div className="form-group">
                <label htmlFor="medicalLicense">Medical License Number *</label>
                <div className="input-wrapper">
                  <Shield size={20} className="input-icon" />
                  <input
                    id="medicalLicense"
                    type="text"
                    {...register('medicalLicense')}
                    placeholder="Enter your medical license number"
                  />
                </div>
                {errors.medicalLicense && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.medicalLicense.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="specialization">Specialization *</label>
                <div className="input-wrapper">
                  <Stethoscope size={20} className="input-icon" />
                  <select id="specialization" {...register('specialization')}>
                    <option value="">Select your specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                {errors.specialization && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.specialization.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="yearsExperience">Years of Experience *</label>
                <div className="input-wrapper">
                  <GraduationCap size={20} className="input-icon" />
                  <input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    max="50"
                    {...register('yearsExperience')}
                    placeholder="Enter years of experience"
                  />
                </div>
                {errors.yearsExperience && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.yearsExperience.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="qualifications">Medical Qualifications *</label>
                <div className="input-wrapper">
                  <GraduationCap size={20} className="input-icon" />
                  <textarea
                    id="qualifications"
                    {...register('qualifications')}
                    placeholder="Enter your medical degrees and qualifications"
                    rows="3"
                  />
                </div>
                {errors.qualifications && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.qualifications.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <div className="step-header">
                {getStepIcon(3)}
                <h2>{getStepTitle(3)}</h2>
              </div>

              <div className="form-group">
                <label htmlFor="clinicName">Clinic/Hospital Name *</label>
                <div className="input-wrapper">
                  <Building size={20} className="input-icon" />
                  <input
                    id="clinicName"
                    type="text"
                    {...register('clinicName')}
                    placeholder="Enter clinic or hospital name"
                  />
                </div>
                {errors.clinicName && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.clinicName.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <div className="input-wrapper">
                  <MapPin size={20} className="input-icon" />
                  <input
                    id="street"
                    type="text"
                    {...register('street')}
                    placeholder="Enter street address"
                  />
                </div>
                {errors.street && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.street.message}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <div className="input-wrapper">
                    <MapPin size={20} className="input-icon" />
                    <input
                      id="city"
                      type="text"
                      {...register('city')}
                      placeholder="Enter city"
                    />
                  </div>
                  {errors.city && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.city.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <div className="input-wrapper">
                    <MapPin size={20} className="input-icon" />
                    <input
                      id="state"
                      type="text"
                      {...register('state')}
                      placeholder="Enter state"
                    />
                  </div>
                  {errors.state && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.state.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <div className="input-wrapper">
                    <MapPin size={20} className="input-icon" />
                    <input
                      id="zipCode"
                      type="text"
                      {...register('zipCode')}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  {errors.zipCode && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.zipCode.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="practiceType">Practice Type *</label>
                  <div className="input-wrapper">
                    <Building size={20} className="input-icon" />
                    <select id="practiceType" {...register('practiceType')}>
                      <option value="">Select practice type</option>
                      {practiceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  {errors.practiceType && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.practiceType.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <div className="step-header">
                {getStepIcon(4)}
                <h2>{getStepTitle(4)}</h2>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <Shield size={20} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill strength-${passwordStrength}`}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Fair'}
                    {passwordStrength === 3 && 'Good'}
                    {passwordStrength === 4 && 'Strong'}
                    {passwordStrength === 5 && 'Very Strong'}
                  </span>
                </div>
                {errors.password && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="input-wrapper">
                  <Shield size={20} className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('termsAccepted')}
                  />
                  <span className="checkmark"></span>
                  I agree to the{' '}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Privacy Policy
                  </button>
                </label>
                {errors.termsAccepted && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.termsAccepted.message}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <footer className="registration-footer">
          <p>Already have an account? <button type="button" className="footer-link" onClick={onSwitchToLogin}>Sign in here</button></p>
          <p><button type="button" className="footer-link" onClick={onBackToSelector}>Back to Menu</button> • Need help? Contact support at <a href="mailto:support@healthfirst.com">support@healthfirst.com</a></p>
        </footer>
      </div>

      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Terms and Conditions</h3>
              <button 
                className="modal-close"
                onClick={() => setShowTermsModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <h4>Provider Registration Terms</h4>
              <p>By registering as a healthcare provider, you agree to:</p>
              <ul>
                <li>Provide accurate and truthful information</li>
                <li>Maintain valid medical licenses and credentials</li>
                <li>Comply with all applicable healthcare regulations</li>
                <li>Protect patient privacy and confidentiality</li>
                <li>Use the platform in accordance with our policies</li>
              </ul>
              <h4>Privacy Policy</h4>
              <p>We collect and process your information to:</p>
              <ul>
                <li>Verify your credentials and qualifications</li>
                <li>Provide healthcare services to patients</li>
                <li>Communicate important updates and information</li>
                <li>Improve our platform and services</li>
              </ul>
              <p>Your data is protected and will not be shared without your consent.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRegistration; 