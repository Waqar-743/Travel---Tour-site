import { useState } from 'react';
import destinations from '../../data/destinations';
import './Destinations.css';

const DestinationCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 3 && month <= 5) return 'summer'; // Apr-Jun
    if (month >= 6 && month <= 8) return 'monsoon'; // Jul-Sep
    return 'winter'; // Oct-Mar
  };

  const currentSeason = getCurrentSeason();

  return (
    <section id="destinations" className="destinations section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Explore</span>
          <h2 className="section-title">Top Destinations</h2>
          <div className="divider"></div>
          <p className="section-description">
            Discover the most breathtaking locations in Gilgit Baltistan, 
            from snow-capped peaks to serene valleys.
          </p>
        </div>

        {/* Season Info Banner */}
        <div className="season-banner">
          <div className="season-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>
          <div className="season-info">
            <span className="season-label">Current Season</span>
            <span className="season-name">{currentSeason === 'summer' ? '☀️ Summer (Best Time!)' : currentSeason === 'monsoon' ? '🌧️ Monsoon Season' : '❄️ Winter Season'}</span>
          </div>
          <div className="season-tip">
            {currentSeason === 'summer' 
              ? 'Perfect weather for trekking and sightseeing!' 
              : currentSeason === 'monsoon' 
              ? 'Pack rain gear and enjoy lush green valleys!' 
              : 'Experience magical snow-covered landscapes!'}
          </div>
        </div>

        <div className="destinations-grid">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className={`destination-card ${hoveredCard === destination.id ? 'hovered' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="destination-image">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  loading="lazy"
                />
                <div className="destination-overlay">
                  <span className="destination-badge">{destination.bestTime}</span>
                  <span className="altitude-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
                    </svg>
                    {destination.altitude}
                  </span>
                </div>

                {/* Weather Widget on Hover */}
                <div className="weather-widget">
                  <div className="weather-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1A2.5 2.5 0 0 0 14.5 8h1A2.5 2.5 0 0 0 18 5.5v-1A2.5 2.5 0 0 0 15.5 2h-1z"/>
                      <path d="M2 13a10 10 0 0 0 18.8 4.5"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Weather Guide
                  </div>
                  <div className="weather-seasons">
                    <div className="weather-season">
                      <span className="season-label">☀️ Summer</span>
                      <span className="season-temp">{destination.weather.summer.temp}</span>
                      <span className="season-condition">{destination.weather.summer.condition}</span>
                    </div>
                    <div className="weather-season">
                      <span className="season-label">🌧️ Monsoon</span>
                      <span className="season-temp">{destination.weather.monsoon.temp}</span>
                      <span className="season-condition">{destination.weather.monsoon.condition}</span>
                    </div>
                    <div className="weather-season">
                      <span className="season-label">❄️ Winter</span>
                      <span className="season-temp">{destination.weather.winter.temp}</span>
                      <span className="season-condition">{destination.weather.winter.condition}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-name">{destination.name}</h3>
                <p className="destination-description">{destination.description}</p>
                
                {/* Activities */}
                <div className="destination-activities">
                  {destination.activities?.slice(0, 3).map((activity, i) => (
                    <span key={i} className="activity-tag">
                      {activity}
                    </span>
                  ))}
                </div>

                <div className="destination-highlights">
                  {destination.highlights.slice(0, 3).map((highlight, i) => (
                    <span key={i} className="highlight-tag">
                      {highlight}
                    </span>
                  ))}
                </div>
                <a href="#packages" className="destination-link">
                  Explore Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationCards;
