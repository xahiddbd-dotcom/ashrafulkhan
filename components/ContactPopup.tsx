
import React, { useState, useEffect, useRef } from 'react';

interface ContactPopupProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onToggle, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        const trigger = document.getElementById('contactBtn');
        if (trigger && !trigger.contains(event.target as Node)) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Message sent! (Simulation)');
    onClose();
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        
        .contact-scope {
          font-family: 'Poppins', sans-serif;
        }

        .contact-trigger {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #FF512F 0%, #DD2476 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(221, 36, 118, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-trigger:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 15px 35px rgba(221, 36, 118, 0.5);
        }

        .contact-popup {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 350px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.1);
          overflow: hidden;
          transform-origin: bottom right;
          transform: scale(0);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          z-index: 999;
        }

        .contact-popup.active {
          transform: scale(1);
          opacity: 1;
        }

        .popup-header {
          background: linear-gradient(135deg, #FF512F 0%, #DD2476 100%);
          padding: 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .popup-header h3 {
          margin: 0;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 20px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.4);
        }

        .popup-body {
          padding: 20px;
          text-align: left;
        }

        .popup-body p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        .input-group {
          position: relative;
          margin-bottom: 25px;
        }

        .input-group input, 
        .input-group textarea {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 2px solid #ddd;
          outline: none;
          background: transparent;
          font-family: inherit;
          transition: border-color 0.3s;
          font-size: 15px;
          box-sizing: border-box; 
          color: #333;
        }

        .input-group textarea {
          resize: none;
          height: 60px;
        }

        .input-group label {
          position: absolute;
          top: 10px;
          left: 0;
          font-size: 14px;
          color: #999;
          pointer-events: none;
          transition: 0.3s ease;
        }

        /* Floating Label Animation */
        .input-group input:focus ~ label,
        .input-group input:not(:placeholder-shown) ~ label,
        .input-group textarea:focus ~ label,
        .input-group textarea:not(:placeholder-shown) ~ label {
          top: -12px;
          font-size: 12px;
          color: #DD2476;
          font-weight: bold;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-bottom: 2px solid #DD2476;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #FF512F 0%, #DD2476 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .submit-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="contact-scope">
        <button className="contact-trigger" id="contactBtn" onClick={onToggle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <div className={`contact-popup ${isOpen ? 'active' : ''}`} id="contactPopup" ref={popupRef}>
          <div className="popup-header">
            <h3>Let's Talk! 🚀</h3>
            <button className="close-btn" id="closeBtn" onClick={onClose}>&times;</button>
          </div>

          <div className="popup-body">
            <p>Have a question? Drop me a line below.</p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <input 
                  type="text" 
                  id="name"
                  placeholder=" " 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <label htmlFor="name">Your Name</label>
              </div>
              
              <div className="input-group">
                <input 
                  type="email" 
                  id="email"
                  placeholder=" " 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <label htmlFor="email">Email Address</label>
              </div>
              
              <div className="input-group">
                <textarea 
                  id="message"
                  placeholder=" " 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
                <label htmlFor="message">Message</label>
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPopup;
