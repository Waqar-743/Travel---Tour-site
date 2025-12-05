import './Packages.css';

const PackageCard = ({ package: pkg, index, onViewDetails, onBookNow }) => {
  const getDifficultyClass = (difficulty) => {
    const level = difficulty.toLowerCase();
    if (level.includes('easy')) return 'badge-easy';
    if (level.includes('hard')) return 'badge-hard';
    return 'badge-moderate';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="package-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="package-image">
        <img src={pkg.image} alt={pkg.name} loading="lazy" />
        <div className="package-image-overlay">
          <span className={`difficulty-badge ${getDifficultyClass(pkg.difficulty)}`}>
            {pkg.difficulty}
          </span>
        </div>
      </div>
      
      <div className="package-content">
        <div className="package-header">
          <h3 className="package-title">{pkg.name}</h3>
          <div className="package-meta">
            <span className="package-duration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {pkg.duration}
            </span>
            <span className="package-group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {pkg.groupSize}
            </span>
          </div>
        </div>

        <div className="package-highlights">
          <h4>Highlights:</h4>
          <ul>
            {pkg.highlights.slice(0, 3).map((highlight, i) => (
              <li key={i}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="package-footer">
          <div className="package-price">
            <span className="price-label">Starting from</span>
            <span className="price-value">{formatPrice(pkg.price)}</span>
            <span className="price-per">/person</span>
          </div>
          <div className="package-actions">
            <button onClick={onViewDetails} className="btn-view-details">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Details
            </button>
            <button onClick={onBookNow} className="btn-book-now">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M9 16l2 2 4-4"/>
              </svg>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
