
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">EcoTrace</h1>
        <p className="text-gray-600">Track your carbon footprint, make a difference.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your email" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your password" required />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">Don't have an account? <button onClick={onSwitchToRegister} className="text-green-500 hover:text-green-600 font-medium">Sign up</button></p>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 text-center"><strong>Demo:</strong> Use any email and a password with 6+ characters.</p>
      </div>
    </div>
  );
};

const RegisterForm: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(email, password, name);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Join EcoTrace</h1>
        <p className="text-gray-600">Start your sustainability journey today.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your full name" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your email" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="6+ characters" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Confirm your password" required />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-600">Already have an account? <button onClick={onSwitchToLogin} className="text-green-500 hover:text-green-600 font-medium">Sign in</button></p>
      </div>
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-4">
      {isRegister ? (
        <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </div>
  );
};

export default AuthScreen;
