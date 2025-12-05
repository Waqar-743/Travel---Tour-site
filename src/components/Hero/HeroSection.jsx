import { useEffect, useState } from 'react';
import './Hero.css';

const HeroSection = ({ onOpenBooking, onOpenAIPlanner }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=1920&q=90" 
          alt="Majestic mountains of Gilgit Baltistan with Passu Cones"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className={`hero-content ${isLoaded ? 'hero-loaded' : ''}`}>
        <div className="hero-text">
          <span className="hero-badge">✨ Gateway to Paradise on Earth</span>
          <h1 className="hero-title">
            Pack Your Bags,<br />
            Let's Go Somewhere <span className="highlight">Amazing</span>
          </h1>
          <p className="hero-subtitle">
            Journey through ancient valleys, pristine glaciers, and towering peaks. 
            Experience the legendary hospitality of the mountains where adventure meets serenity.
          </p>
          <div className="hero-buttons">
            <button onClick={() => onOpenBooking()} className="btn-primary-hero">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Now
              <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={onOpenAIPlanner} className="btn-secondary-hero btn-ai-hero">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
              AI Trip Planner
            </button>
          </div>
          <div className="hero-cta-hint">
            <span>🎯 Not sure where to start?</span> Try our AI planner for personalized recommendations
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Tours Completed</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">Customer Rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Happy Travelers</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
