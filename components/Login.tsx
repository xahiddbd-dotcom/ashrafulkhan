
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glow-frame-container max-w-md w-full shadow-2xl">
        <div className="glow-frame-animator"></div>
        <div className="glow-frame-inner p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-500 mb-2 uppercase tracking-tighter">Admin Access</h2>
            <p className="text-gray-500 text-sm">Secure Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
            
            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95"
              >
                Login to Dashboard
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="w-full text-gray-500 hover:text-white text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
