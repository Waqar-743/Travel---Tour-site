import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { packages } from '../../data/packages';
import './Modal.css';

const BookingModal = ({ isOpen, onClose, onOpenAuth, selectedPackage = null }) => {
  const { user, tokens } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    packageId: selectedPackage?.id || '',
    startDate: '',
    endDate: '',
    groupSize: 2,
    fullName: '',
    email: '',
    phone: '',
    country: 'Pakistan',
    experienceLevel: 'intermediate',
    specialRequests: '',
    paymentMethod: 'stripe',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [_error, setError] = useState(null);

  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, packageId: selectedPackage.id }));
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep(1);
      setIsSuccess(false);
      setError(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageSelect = (pkgId) => {
    setFormData(prev => ({ ...prev, packageId: pkgId }));
  };

  const handleSubmit = async () => {
    if (!user) {
      onClose();
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedPkg = packages.find(p => p.id === Number(formData.packageId));
      const days = parseInt(selectedPkg.duration.split(' ')[0]) || 1;
      const returnDate = new Date(formData.startDate);
      returnDate.setDate(returnDate.getDate() + days);

      const response = await fetch('https://travel-tour-site-production.up.railway.app/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access.token}`
        },
        body: JSON.stringify({
          trip: formData.packageId,
          selectedDate: { 
            departureDate: formData.startDate, 
            returnDate: returnDate.toISOString() 
          },
          numberOfTravelers: Number(formData.groupSize),
          contactInfo: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            country: formData.country
          },
          travelers: [{
            fullName: formData.fullName
          }],
          specialRequests: formData.specialRequests,
          paymentMethod: formData.paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }
      
      if (formData.paymentMethod === 'stripe' && data.data.checkoutSession) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.checkoutSession.url;
        return;
      } else if (formData.paymentMethod === 'easypaisa') {
        // In a real app, initiate Easypaisa payment
        console.log('Initiating Easypaisa payment...');
      }

      // Save to localStorage (backup)
      const bookings = JSON.parse(localStorage.getItem('gb_bookings') || '[]');
      const newBooking = {
        ...formData,
        id: data.data.booking ? data.data.booking.confirmationCode : `GB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        package: selectedPkg,
        userId: user.id,
        paymentStatus: 'pending',
        paymentMethod: formData.paymentMethod
      };
      bookings.push(newBooking);
      localStorage.setItem('gb_bookings', JSON.stringify(bookings));
      
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Booking failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === Number(formData.packageId));
  const totalPrice = selectedPkg ? selectedPkg.price * formData.groupSize : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {isSuccess ? (
          <div className="booking-success">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you for your booking. Check your email for details.</p>
            <div className="booking-reference">
              <span>Booking Reference:</span>
              <strong>#GB-{Date.now().toString().slice(-6)}</strong>
            </div>
            <p className="success-note">A member of our team will contact you within 24 hours.</p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="booking-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
              <div className="progress-steps">
                <span className={step >= 1 ? 'active' : ''}>1. Package</span>
                <span className={step >= 2 ? 'active' : ''}>2. Details</span>
                <span className={step >= 3 ? 'active' : ''}>3. Confirm</span>
              </div>
            </div>

            {/* Step 1: Package Selection */}
            {step === 1 && (
              <div className="booking-step">
                <h2>Book Your Adventure</h2>
                <p className="step-subtitle">Choose your package and travel dates</p>

                <div className="package-selection">
                  <label>Select Package</label>
                  <div className="package-options">
                    {packages.map(pkg => (
                      <div 
                        key={pkg.id}
                        className={`package-option ${formData.packageId === pkg.id ? 'selected' : ''}`}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        <img src={pkg.image} alt={pkg.name} />
                        <div className="package-option-info">
                          <h4>{pkg.name}</h4>
                          <span className="duration">{pkg.duration}</span>
                          <span className="price">{formatPrice(pkg.price)}</span>
                        </div>
                        <div className="check-indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Travel Start Date</label>
                    <input 
                      type="date" 
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="groupSize">Group Size</label>
                    <input 
                      type="number" 
                      id="groupSize"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={onClose}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={() => setStep(2)}
                    disabled={!formData.packageId}
                  >
                    Continue to Details
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Traveler Details */}
            {step === 2 && (
              <div className="booking-step">
                <h2>Your Details</h2>
                <p className="step-subtitle">Tell us about yourself</p>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select 
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience Level</label>
                  <div className="radio-group">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <label key={level} className="radio-option">
                        <input 
                          type="radio"
                          name="experienceLevel"
                          value={level}
                          checked={formData.experienceLevel === level}
                          onChange={handleInputChange}
                        />
                        <span className="radio-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests</label>
                  <textarea 
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, mobility needs, or special requirements..."
                    rows="3"
                  />
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={() => setStep(3)}
                    disabled={!formData.fullName || !formData.email || !formData.phone}
                  >
                    Continue to Confirm
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm Booking */}
            {step === 3 && (
              <div className="booking-step">
                <h2>Confirm Booking</h2>
                <p className="step-subtitle">Review your booking details</p>

                {selectedPkg && (
                  <div className="booking-summary">
                    <div className="summary-package">
                      <img src={selectedPkg.image} alt={selectedPkg.name} />
                      <div className="summary-info">
                        <h3>{selectedPkg.name}</h3>
                        <span className="duration">{selectedPkg.duration}</span>
                        <span className="difficulty">{selectedPkg.difficulty}</span>
                      </div>
                    </div>

                    <div className="summary-details">
                      <div className="detail-row">
                        <span>Travel Date:</span>
                        <strong>{formData.startDate || 'To be confirmed'}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Group Size:</span>
                        <strong>{formData.groupSize} {formData.groupSize === 1 ? 'person' : 'people'}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Price per person:</span>
                        <strong>{formatPrice(selectedPkg.price)}</strong>
                      </div>
                      <div className="detail-row total">
                        <span>Total:</span>
                        <strong className="total-price">{formatPrice(totalPrice)}</strong>
                      </div>
                    </div>

                    <div className="traveler-summary">
                      <h4>Traveler Information</h4>
                      <p><strong>{formData.fullName}</strong></p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>

                    <div className="payment-method-selection" style={{ marginTop: '20px' }}>
                      <h4>Payment Method</h4>
                      <div className="radio-group" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={formData.paymentMethod === 'stripe'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-label">Stripe (Credit Card)</span>
                        </label>
                        <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="radio"
                            name="paymentMethod"
                            value="easypaisa"
                            checked={formData.paymentMethod === 'easypaisa'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-label">Easypaisa</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>
                  <button 
                    className="btn-primary btn-submit" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
