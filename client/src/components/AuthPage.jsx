import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push('At least 6 characters');
    if (password.length > 20) errors.push('Maximum 20 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter (A-Z)');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter (a-z)');
    if (!/[0-9]/.test(password)) errors.push('One number (0-9)');
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password on signup
    if (!isLogin) {
      if (!validatePassword(formData.password)) {
        setLoading(false);
        setError('Please fix the password requirements below');
        return;
      }
      if (!formData.email) {
        setLoading(false);
        setError('Email is required');
        return;
      }
    }

    if (!formData.username || !formData.password) {
      setLoading(false);
      setError('Username and password are required');
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await axios.post(endpoint, formData);
      if (response.data.success) {
        onAuthSuccess(response.data.user, response.data.token);
        navigate(response.data.user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = formData.password.length === 0 || passwordErrors.length === 0;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-gray-900 shadow-2xl border border-gray-800 p-6 sm:p-10 rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Sign in to access your TechZone account' : 'Join the most advanced tech community'}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-center text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                required
                autoComplete="off"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                maxLength={20}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-700 ${
                  !isPasswordValid ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-800 focus:ring-blue-500/50 focus:border-blue-500/50'
                }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              
              {/* Password Requirements - shown during signup */}
              {!isLogin && formData.password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: 'At least 6 characters', test: formData.password.length >= 6 },
                    { label: 'Maximum 20 characters', test: formData.password.length <= 20 },
                    { label: 'One uppercase letter (A-Z)', test: /[A-Z]/.test(formData.password) },
                    { label: 'One lowercase letter (a-z)', test: /[a-z]/.test(formData.password) },
                    { label: 'One number (0-9)', test: /[0-9]/.test(formData.password) },
                  ].map((rule, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-all ${rule.test ? 'text-emerald-400' : 'text-gray-600'}`}>
                      <svg className={`h-3.5 w-3.5 shrink-0 ${rule.test ? 'text-emerald-400' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {rule.test ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                        )}
                      </svg>
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!isLogin && !isPasswordValid && formData.password.length > 0)}
            className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Register Now'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setPasswordErrors([]); }}
              className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
