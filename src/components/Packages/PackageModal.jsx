import { useEffect, useState } from 'react';
import './Packages.css';

const PackageModal = ({ package: pkg, onClose, onBookNow }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDifficultyClass = (difficulty) => {
    const level = difficulty.toLowerCase();
    if (level.includes('easy')) return 'badge-easy';
    if (level.includes('hard')) return 'badge-hard';
    return 'badge-moderate';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content package-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Modal Header with Image Gallery */}
        <div className="modal-gallery">
          <img 
            src={pkg.gallery?.[activeImageIndex] || pkg.image} 
            alt={pkg.name}
            className="modal-main-image"
          />
          <div className="modal-gallery-overlay">
            <div className="modal-package-info">
              <span className={`difficulty-badge ${getDifficultyClass(pkg.difficulty)}`}>
                {pkg.difficulty}
              </span>
              <h2 className="modal-title">{pkg.name}</h2>
              <div className="modal-meta">
                <span>{pkg.duration}</span>
                <span>•</span>
                <span>{pkg.groupSize}</span>
                <span>•</span>
                <span>{pkg.bestSeason}</span>
              </div>
            </div>
          </div>
          {pkg.gallery && pkg.gallery.length > 1 && (
            <div className="modal-thumbnails">
              {pkg.gallery.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={img} alt={`${pkg.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Tabs */}
          <div className="modal-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button 
              className={`tab ${activeTab === 'includes' ? 'active' : ''}`}
              onClick={() => setActiveTab('includes')}
            >
              What's Included
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <p className="package-description">{pkg.description}</p>
                
                <div className="highlights-section">
                  <h4>Package Highlights</h4>
                  <div className="highlights-grid">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={index} className="highlight-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {pkg.whatToBring && (
                  <div className="bring-section">
                    <h4>What to Bring</h4>
                    <ul className="bring-list">
                      {pkg.whatToBring.map((item, index) => (
                        <li key={index}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2"/>
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                            <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                            <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="itinerary-content">
                <div className="itinerary-timeline">
                  {pkg.itinerary.map((day, index) => (
                    <div key={index} className="itinerary-day">
                      <div className="day-marker">
                        <span className="day-number">Day {day.day}</span>
                        <div className="day-line"></div>
                      </div>
                      <div className="day-content">
                        <h4>{day.title}</h4>
                        <p>{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'includes' && (
              <div className="includes-content">
                <div className="includes-grid">
                  <div className="includes-section">
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      What's Included
                    </h4>
                    <ul>
                      {pkg.included?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="not-includes-section">
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Not Included
                    </h4>
                    <ul>
                      {pkg.notIncluded?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="modal-price">
              <span className="price-label">Starting from</span>
              <span className="price-value">{formatPrice(pkg.price)}</span>
              <span className="price-per">/person</span>
            </div>
            <button onClick={onBookNow} className="btn-inquire">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Now
              <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageModal;
