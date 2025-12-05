import { useState } from 'react';
import { galleryImages, galleryCategories } from '../../data/gallery';
import Lightbox from './Lightbox';
import './Gallery.css';

const PhotoGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section id="gallery" className="gallery section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Gallery</span>
          <h2 className="section-title">Captured Moments</h2>
          <div className="divider"></div>
          <p className="section-description">
            Explore the stunning landscapes and memorable moments from 
            our adventures across Gilgit Baltistan.
          </p>
        </div>

        {/* Category Filter */}
        <div className="gallery-filters">
          {galleryCategories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => openLightbox(index)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img 
                src={image.thumbnail} 
                alt={image.title}
                loading="lazy"
              />
              <div className="gallery-overlay">
                <div className="gallery-info">
                  <h4>{image.title}</h4>
                  <span>{image.location}</span>
                </div>
                <div className="gallery-zoom">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
};

export default PhotoGallery;
