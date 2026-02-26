import { useState } from 'react';
import { Cookie, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onRegister, onNavigate }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await onRegister(username, email, password);
    if (!result.success) {
      setError(result.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card rounded-3xl p-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl mb-5 shadow-lg shadow-purple-500/30">
            <Cookie className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60 text-base">Join DonutTrade for secure trading</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Username Field */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-white/90">Minecraft Username</label>
              <p className="text-xs text-white/45 mt-1">Use the exact nickname you play with on the server.</p>
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-dark pl-12 pr-4"
                placeholder="In-game nickname"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-white/90">Email Address</label>
              <p className="text-xs text-white/45 mt-1">Used for login and important notifications.</p>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark pl-12 pr-4"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-white/90">Password</label>
              <p className="text-xs text-white/45 mt-1">Minimum 6 characters. Use a strong, unique password.</p>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-12 pr-4"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-white/90">Confirm Password</label>
              <p className="text-xs text-white/45 mt-1">Re-enter the same password to confirm.</p>
            </div>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-dark pl-12 pr-4"
                placeholder="Repeat your password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
