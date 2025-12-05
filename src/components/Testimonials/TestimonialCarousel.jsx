import { useState, useEffect } from 'react';
import testimonials from '../../data/testimonials';
import './Testimonials.css';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`star ${i < rating ? 'star-filled' : 'star-empty'}`}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">What Our Travelers Say</h2>
          <div className="divider"></div>
        </div>

        <div className="testimonial-carousel">
          <button 
            className="carousel-nav carousel-prev" 
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="quote-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094-.56.79-.98 1.634-1.25 2.533-.27.9-.41 1.83-.41 2.79 0 1.01.26 1.91.76 2.69.51.78 1.15 1.38 1.94 1.8.79.42 1.65.63 2.58.63 1.14 0 2.13-.38 2.97-1.14.84-.76 1.26-1.72 1.26-2.9zm9.5 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L18.873 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094-.56.79-.98 1.634-1.25 2.533-.27.9-.41 1.83-.41 2.79 0 1.01.26 1.91.76 2.69.51.78 1.15 1.38 1.94 1.8.79.42 1.65.63 2.58.63 1.14 0 2.13-.38 2.97-1.14.84-.76 1.26-1.72 1.26-2.9z"/>
                      </svg>
                    </div>
                    
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <p className="testimonial-text">"{testimonial.review}"</p>
                    
                    <div className="testimonial-author">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="author-avatar"
                      />
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <p className="author-location">{testimonial.location}</p>
                        <span className="author-package">{testimonial.package}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-nav carousel-next" 
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
