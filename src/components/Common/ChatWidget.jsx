import { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! 👋 Welcome to GB Adventures. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Tell me about packages",
    "How do I book a tour?",
    "Custom package inquiry",
    "Talk to a human",
  ];

  const botResponses = {
    packages: "We have 5 amazing tour packages! 🏔️\n\n• Khaplu Adventure (4 days) - PKR 45,000\n• Skardu Expedition (6 days) - PKR 65,000\n• Khaplu Cultural Journey (3 days) - PKR 35,000\n• Shigar Valley Explorer (5 days) - PKR 55,000\n• Astore High Altitude Trek (7 days) - PKR 85,000\n\nWould you like details about any specific package?",
    book: "Booking is easy! 📅 You can:\n\n1. Click the 'Book Now' button at the top\n2. Use our 'AI Planner' to find your perfect package\n3. Fill out the contact form\n\nWe'll confirm your booking within 24 hours!",
    custom: "Great choice! 🎯 We love creating custom adventures.\n\nPlease share:\n• Your travel dates\n• Group size\n• Interests & preferences\n• Budget range\n\nOur team will craft the perfect itinerary for you!",
    human: "I'll connect you with our team! 📞\n\nYou can reach us at:\n• Phone: +92 300 1234567\n• WhatsApp: +92 300 1234567\n• Email: info@gbadventures.com\n\nOur team responds within minutes during business hours (9 AM - 6 PM PKT).",
    default: "Thanks for your message! 💬\n\nFor detailed inquiries, please fill out our contact form or chat with our team directly.\n\n📞 +92 300 1234567 (WhatsApp available)",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = botResponses.default;

      if (lowerText.includes('package') || lowerText.includes('tour') || lowerText.includes('skardu') || lowerText.includes('hunza')) {
        response = botResponses.packages;
      } else if (lowerText.includes('book') || lowerText.includes('reserve')) {
        response = botResponses.book;
      } else if (lowerText.includes('custom') || lowerText.includes('tailor')) {
        response = botResponses.custom;
      } else if (lowerText.includes('human') || lowerText.includes('agent') || lowerText.includes('call') || lowerText.includes('phone')) {
        response = botResponses.human;
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1200);
  };

  const handleQuickReply = (reply) => {
    handleSend(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        <span className="chat-button-pulse"></span>
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h4>GB Adventures Support</h4>
              <span className="status">
                <span className="status-dot"></span>
                Usually responds in minutes
              </span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button 
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
