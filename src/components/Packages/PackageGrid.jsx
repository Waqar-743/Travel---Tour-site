import { useState } from 'react';
import packages from '../../data/packages';
import PackageCard from './PackageCard';
import PackageModal from './PackageModal';
import './Packages.css';

const PackageGrid = ({ onBookPackage }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPackage(null);
    document.body.style.overflow = '';
  };

  const handleBookNow = (pkg) => {
    closeModal();
    if (onBookPackage) {
      onBookPackage(pkg);
    }
  };

  return (
    <section id="packages" className="packages section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Our Packages</span>
          <h2 className="section-title">Adventure Awaits</h2>
          <div className="divider"></div>
          <p className="section-description">
            Choose from our carefully curated tour packages designed to give you 
            the ultimate Gilgit Baltistan experience.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <PackageCard 
              key={pkg.id} 
              package={pkg} 
              index={index}
              onViewDetails={() => openModal(pkg)}
              onBookNow={() => handleBookNow(pkg)}
            />
          ))}
        </div>
      </div>

      {selectedPackage && (
        <PackageModal 
          package={selectedPackage} 
          onClose={closeModal}
          onBookNow={() => handleBookNow(selectedPackage)}
        />
      )}
    </section>
  );
};

export default PackageGrid;
