import { useState } from 'react';
import './InteractiveMap.css';
import GBMap from '../../assets/Gilgit-Blatistan-Map.png';

const InteractiveMap = () => {
  const [activeLocation, setActiveLocation] = useState(null);

  // Coordinates adjusted to match the Gilgit-Baltistan map image
  // Locations: Ganche (Khaplu), Hunza, Gilgit, Deosai, Shigar (near Skardu)
  const locations = [
    {
      id: 'hunza',
      name: 'Hunza',
      description: 'Heaven on Earth with stunning views of Rakaposhi and ancient forts',
      coordinates: { x: 25, y: 35 },
      highlights: ['Karimabad', 'Baltit Fort', 'Attabad Lake'],
      bestTime: 'Apr - Oct'
    },
    {
      id: 'gilgit',
      name: 'Gilgit',
      description: 'The capital city and starting point for most adventures',
      coordinates: { x: 18, y: 55 },
      highlights: ['Kargah Buddha', 'Naltar Valley', 'Local Bazaar'],
      bestTime: 'Year Round'
    },
    {
      id: 'deosai',
      name: 'Deosai',
      description: 'The Land of Giants - one of the highest plateaus in the world',
      coordinates: { x: 45, y: 72 },
      highlights: ['Deosai National Park', 'Sheosar Lake', 'Brown Bears'],
      bestTime: 'Jun - Sep'
    },
    {
      id: 'shigar',
      name: 'Shigar',
      description: 'Historic valley with beautiful fort and cold desert near Skardu',
      coordinates: { x: 58, y: 58 },
      highlights: ['Shigar Fort', 'Cold Desert', 'Manthal Buddha'],
      bestTime: 'May - Sep'
    },
    {
      id: 'khaplu',
      name: 'Khaplu',
      description: 'Gem of Ganche district - home to the stunning Chaqchan Mosque and palace',
      coordinates: { x: 75, y: 68 },
      highlights: ['Khaplu Palace', 'Chaqchan Mosque', 'Machulo'],
      bestTime: 'Apr - Oct'
    }
  ];

  return (
    <section className="interactive-map section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Explore The Region</span>
          <h2 className="section-title">Discover Gilgit Baltistan</h2>
          <div className="divider"></div>
          <p className="section-description">
            Click on any location to learn more about our featured destinations across this magnificent region.
          </p>
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            {/* Gilgit-Baltistan Map Image */}
            <div className="map-image-container">
              <img 
                src={GBMap} 
                alt="Gilgit Baltistan Map" 
                className="map-image"
              />
            </div>

            {/* Location Markers */}
            {locations.map((location) => (
              <button
                key={location.id}
                className={`map-marker ${activeLocation === location.id ? 'active' : ''}`}
                style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
                onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                aria-label={`View ${location.name}`}
              >
                <div className="marker-pulse"></div>
                <div className="marker-dot">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3" fill="white"/>
                  </svg>
                </div>
                <span className="marker-label">{location.name}</span>
              </button>
            ))}

            {/* Info Card */}
            {activeLocation && (
              <div className="map-info-card">
                {locations.filter(l => l.id === activeLocation).map(location => (
                  <div key={location.id} className="info-card-content">
                    <button 
                      className="info-close" 
                      onClick={() => setActiveLocation(null)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    <div className="info-highlights">
                      {location.highlights.map((h, i) => (
                        <span key={i} className="highlight-chip">{h}</span>
                      ))}
                    </div>
                    <div className="info-footer">
                      <span className="best-time">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Best: {location.bestTime}
                      </span>
                      <a href="#packages" className="info-link">
                        View Tours →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location List */}
          <div className="locations-list">
            <h4 className="list-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Featured Destinations
            </h4>
            <ul>
              {locations.map((location) => (
                <li 
                  key={location.id}
                  className={activeLocation === location.id ? 'active' : ''}
                  onClick={() => setActiveLocation(location.id)}
                >
                  <span className="location-name">{location.name}</span>
                  <span className="location-time">{location.bestTime}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
