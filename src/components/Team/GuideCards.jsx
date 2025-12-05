import guides from '../../data/guides';
import './Team.css';

const GuideCards = () => {
  return (
    <section id="about" className="team section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Our Team</span>
          <h2 className="section-title">Expert Local Guides</h2>
          <div className="divider"></div>
          <p className="section-description">
            Meet our experienced guides who bring local expertise, passion, 
            and safety to every adventure.
          </p>
        </div>

        <div className="guides-grid">
          {guides.map((guide, index) => (
            <div 
              key={guide.id} 
              className="guide-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="guide-image">
                <img src={guide.image} alt={guide.name} loading="lazy" />
                <div className="guide-overlay">
                  <div className="guide-languages">
                    {guide.languages.slice(0, 3).map((lang, i) => (
                      <span key={i} className="language-tag">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="guide-content">
                <h3 className="guide-name">{guide.name}</h3>
                <span className="guide-specialty">{guide.specialty}</span>
                
                <div className="guide-experience">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{guide.experience} experience</span>
                </div>
                
                <p className="guide-bio">{guide.bio}</p>
                
                <div className="guide-certifications">
                  {guide.certifications.slice(0, 2).map((cert, i) => (
                    <span key={i} className="cert-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-us">
          <div className="why-content">
            <h3>Why Travel With Us?</h3>
            <p>
              With over a decade of experience in Gilgit Baltistan tourism, we pride ourselves 
              on providing authentic, safe, and unforgettable adventures.
            </p>
          </div>
          <div className="why-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h4>Safety First</h4>
                <p>Certified guides and emergency protocols</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h4>Local Expertise</h4>
                <p>Guides born and raised in Gilgit Baltistan</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h4>Small Groups</h4>
                <p>Personalized attention and authentic experiences</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                  <path d="M12 18V6"/>
                </svg>
              </div>
              <div>
                <h4>Best Value</h4>
                <p>Competitive pricing without compromising quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideCards;
