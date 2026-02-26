import { useState } from 'react';
import { Cookie, Mail, Lock, AlertCircle, Crown, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await onLogin(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card rounded-3xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl mb-5 shadow-lg shadow-purple-500/30">
            <Cookie className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/60 text-base">Sign in to your DonutTrade account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90">
              Email Address
            </label>
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
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-12 pr-4"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary w-full mt-8"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Test Accounts */}
        <div className="mt-6 p-5 glass rounded-xl border border-purple-500/20">
          <p className="text-sm text-purple-300 font-bold mb-4 flex items-center gap-2">
            🧪 Demo Test Accounts
          </p>
          
          {/* Admin Account */}
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">Admin Account</span>
            </div>
            <p className="text-xs text-white/70 ml-6">
              <span className="text-white/90">Email:</span> admin@donuttrade.com
            </p>
            <p className="text-xs text-white/70 ml-6">
              <span className="text-white/90">Password:</span> 123
            </p>
          </div>
          
          {/* User Account */}
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold text-sm">Player Account</span>
            </div>
            <p className="text-xs text-white/70 ml-6">
              <span className="text-white/90">Email:</span> diamond@test.com
            </p>
            <p className="text-xs text-white/70 ml-6">
              <span className="text-white/90">Password:</span> 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
