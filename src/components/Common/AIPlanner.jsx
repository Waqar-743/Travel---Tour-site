import { useState, useEffect } from 'react';
import { packages } from '../../data/packages';
import './Modal.css';

const AIPlanner = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({
    experience: '',
    duration: '',
    budget: '',
    interests: [],
    season: '',
  });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep(-1);
      setAnswers({ experience: '', duration: '', budget: '', interests: [], season: '' });
      setRecommendations([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const questions = [
    {
      id: 'experience',
      title: "What's your experience level?",
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner', icon: 'beginner', desc: 'First time explorer' },
        { value: 'intermediate', label: 'Intermediate', icon: 'intermediate', desc: 'Some mountain experience' },
        { value: 'advanced', label: 'Advanced', icon: 'advanced', desc: 'Seasoned adventurer' },
      ]
    },
    {
      id: 'duration',
      title: 'How much time do you have?',
      type: 'single',
      options: [
        { value: '2-3', label: '2-3 Days', icon: 'short', desc: 'Quick getaway' },
        { value: '4-5', label: '4-5 Days', icon: 'medium', desc: 'Long weekend' },
        { value: '6-7', label: '6-7 Days', icon: 'week', desc: 'Full week' },
        { value: '8+', label: '8+ Days', icon: 'extended', desc: 'Grand expedition' },
      ]
    },
    {
      id: 'budget',
      title: "What's your budget range?",
      type: 'single',
      options: [
        { value: 'budget', label: 'Budget', icon: 'budget', desc: 'PKR 0 - 40,000' },
        { value: 'standard', label: 'Standard', icon: 'standard', desc: 'PKR 40,000 - 70,000' },
        { value: 'premium', label: 'Premium', icon: 'premium', desc: 'PKR 70,000+' },
      ]
    },
    {
      id: 'interests',
      title: 'What interests you most?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'trekking', label: 'Mountain Trekking', icon: 'trekking' },
        { value: 'culture', label: 'Cultural Experiences', icon: 'culture' },
        { value: 'photography', label: 'Photography', icon: 'photography' },
        { value: 'food', label: 'Local Cuisine', icon: 'food' },
        { value: 'offbeat', label: 'Hidden Gems', icon: 'offbeat' },
        { value: 'adventure', label: 'Adventure Sports', icon: 'adventure' },
      ]
    },
    {
      id: 'season',
      title: 'When do you want to travel?',
      type: 'single',
      options: [
        { value: 'spring', label: 'Spring', icon: 'spring', desc: 'Apr - May' },
        { value: 'summer', label: 'Summer', icon: 'summer', desc: 'Jun - Aug' },
        { value: 'autumn', label: 'Autumn', icon: 'autumn', desc: 'Sep - Oct' },
        { value: 'winter', label: 'Winter', icon: 'winter', desc: 'Nov - Mar' },
        { value: 'flexible', label: 'Flexible', icon: 'flexible', desc: 'Any time works' },
      ]
    },
  ];

  const getIconSVG = (iconName) => {
    const icons = {
      // Experience levels
      beginner: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      ),
      intermediate: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2L4 14h6l-2 8 10-12h-6l2-8z"/>
        </svg>
      ),
      advanced: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
          <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/>
        </svg>
      ),
      // Duration
      short: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      medium: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      week: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M8 14h.01"/>
          <path d="M12 14h.01"/>
          <path d="M16 14h.01"/>
          <path d="M8 18h.01"/>
          <path d="M12 18h.01"/>
          <path d="M16 18h.01"/>
        </svg>
      ),
      extended: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      // Budget
      budget: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      standard: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      premium: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      // Interests
      trekking: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 4v16"/>
          <path d="M17 4v16"/>
          <path d="M19 4H11a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8"/>
          <path d="M3 15l4-4"/>
          <path d="M7 15l-4-4"/>
        </svg>
      ),
      culture: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18"/>
          <path d="M9 8h1"/>
          <path d="M14 8h1"/>
          <path d="M9 12h1"/>
          <path d="M14 12h1"/>
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
        </svg>
      ),
      photography: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
      food: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      ),
      offbeat: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      ),
      adventure: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
      ),
      // Seasons
      spring: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v8"/>
          <path d="m4.93 10.93 1.41 1.41"/>
          <path d="M2 18h2"/>
          <path d="M20 18h2"/>
          <path d="m19.07 10.93-1.41 1.41"/>
          <path d="M22 22H2"/>
          <path d="M16 6 8.5 12.5"/>
          <path d="M9.5 5C5.36 5 2 8.36 2 12.5"/>
          <path d="M14.5 5c4.14 0 7.5 3.36 7.5 7.5"/>
        </svg>
      ),
      summer: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      ),
      autumn: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
      winter: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <path d="m20 16-4-4 4-4"/>
          <path d="m4 8 4 4-4 4"/>
          <path d="m16 4-4 4-4-4"/>
          <path d="m8 20 4-4 4 4"/>
        </svg>
      ),
      flexible: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const calculateRecommendations = () => {
    const scores = packages.map(pkg => {
      let score = 0;
      let reasons = [];

      // Experience matching
      const difficulty = pkg.difficulty.toLowerCase();
      if (answers.experience === 'beginner' && difficulty.includes('easy')) {
        score += 30;
        reasons.push('Perfect for beginners');
      } else if (answers.experience === 'intermediate' && difficulty.includes('moderate')) {
        score += 30;
        reasons.push('Matches your experience level');
      } else if (answers.experience === 'advanced' && difficulty.includes('hard')) {
        score += 30;
        reasons.push('Challenging adventure for experts');
      }

      // Duration matching
      const days = parseInt(pkg.duration);
      if (answers.duration === '2-3' && days <= 3) score += 25;
      else if (answers.duration === '4-5' && days >= 4 && days <= 5) score += 25;
      else if (answers.duration === '6-7' && days >= 6 && days <= 7) score += 25;
      else if (answers.duration === '8+' && days >= 7) score += 25;

      // Budget matching
      if (answers.budget === 'budget' && pkg.price <= 40000) {
        score += 25;
        reasons.push('Within your budget');
      } else if (answers.budget === 'standard' && pkg.price > 40000 && pkg.price <= 70000) {
        score += 25;
        reasons.push('Great value for money');
      } else if (answers.budget === 'premium' && pkg.price > 70000) {
        score += 25;
        reasons.push('Premium experience');
      }

      // Interest matching
      const pkgName = pkg.name.toLowerCase();
      const pkgDesc = pkg.description?.toLowerCase() || '';
      if (answers.interests.includes('culture') && (pkgName.includes('cultural') || pkgName.includes('khaplu'))) {
        score += 15;
        reasons.push('Rich cultural experiences');
      }
      if (answers.interests.includes('trekking') && (pkgName.includes('trek') || pkgName.includes('expedition'))) {
        score += 15;
        reasons.push('Great trekking opportunities');
      }
      if (answers.interests.includes('adventure') && difficulty.includes('hard')) {
        score += 15;
        reasons.push('Thrilling adventure awaits');
      }

      return { ...pkg, score, reasons: reasons.slice(0, 2) };
    });

    const sorted = scores.sort((a, b) => b.score - a.score);
    setRecommendations(sorted.slice(0, 3));
  };

  const handleAnswer = (questionId, value) => {
    if (questions[step].type === 'multiple') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId].includes(value)
          ? prev[questionId].filter(v => v !== value)
          : [...prev[questionId], value]
      }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateRecommendations();
      setStep(questions.length);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentQuestion = questions[step];
  const isAnswered = currentQuestion?.type === 'multiple' 
    ? answers[currentQuestion?.id]?.length > 0 
    : !!answers[currentQuestion?.id];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ai-planner-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Intro Screen */}
        {step === -1 && (
          <div className="ai-intro">
            <div className="ai-intro-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <h2>Find Your Perfect Adventure</h2>
            <p>Answer 5 quick questions to get personalized package recommendations tailored just for you.</p>
            <button className="btn-primary btn-large" onClick={() => setStep(0)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start Planning
            </button>
          </div>
        )}

        {/* Questions */}
        {step >= 0 && step < questions.length && currentQuestion && (
          <div className="ai-question">
            <div className="question-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
              </div>
              <span className="progress-text">Question {step + 1} of {questions.length}</span>
            </div>

            <h2>{currentQuestion.title}</h2>
            {currentQuestion.subtitle && <p className="question-subtitle">{currentQuestion.subtitle}</p>}

            <div className={`options-grid ${currentQuestion.type === 'multiple' ? 'multi-select' : ''}`}>
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  className={`option-card ${
                    currentQuestion.type === 'multiple'
                      ? answers[currentQuestion.id]?.includes(option.value) ? 'selected' : ''
                      : answers[currentQuestion.id] === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                >
                  <span className="option-icon">{getIconSVG(option.icon)}</span>
                  <span className="option-label">{option.label}</span>
                  {option.desc && <span className="option-desc">{option.desc}</span>}
                  <div className="option-check">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="question-actions">
              {step > 0 && (
                <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              )}
              <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!isAnswered}
              >
                {step === questions.length - 1 ? 'Get Recommendations' : 'Continue'}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === questions.length && recommendations.length > 0 && (
          <div className="ai-results">
            <div className="results-header">
              <h2>Your Personalized Recommendations</h2>
              <p>Based on your preferences, here are our top picks for you</p>
            </div>

            <div className="recommendations-list">
              {recommendations.map((pkg, index) => (
                <div key={pkg.id} className="recommendation-card">
                  <div className="rec-badge">
                    {index === 0 && <span className="best-match">Best Match</span>}
                    <span className="match-score">{Math.min(pkg.score + 50, 98)}% match</span>
                  </div>
                  <img src={pkg.image} alt={pkg.name} className="rec-image" />
                  <div className="rec-content">
                    <h3>{pkg.name}</h3>
                    <div className="rec-meta">
                      <span>{pkg.duration}</span>
                      <span className="dot">•</span>
                      <span>{pkg.difficulty}</span>
                    </div>
                    {pkg.reasons.length > 0 && (
                      <div className="rec-reasons">
                        {pkg.reasons.map((reason, i) => (
                          <span key={i} className="reason-tag">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="rec-price">{formatPrice(pkg.price)}</div>
                    <div className="rec-actions">
                      <a href="#packages" className="btn-secondary" onClick={onClose}>View Details</a>
                      <button className="btn-primary" onClick={() => onComplete?.(pkg)}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="results-footer">
              <p>Want something custom?</p>
              <a href="#contact" className="btn-secondary" onClick={onClose}>
                Contact Our Team
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;
