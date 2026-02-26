import { ReactNode } from 'react';
import { Cookie, LogOut, User, ShieldCheck, Package, History, Plus, Home, LayoutDashboard, Bot, Database } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: ReactNode;
  user: UserType | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Layout({ children, user, currentPage, onNavigate, onLogout }: LayoutProps) {
  const menuItems = user ? [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'listings', label: 'Marketplace', icon: Package },
    { id: 'create-listing', label: 'Create Listing', icon: Plus },
    { id: 'my-transactions', label: 'My Trades', icon: History },
    { id: 'architecture', label: 'Architecture', icon: LayoutDashboard },
    { id: 'database', label: 'DB Schema', icon: Database },
    // Bot Setup only visible to admins
    ...(user.role === 'admin' ? [
      { id: 'bot', label: 'Bot Setup', icon: Bot },
      { id: 'admin', label: 'Admin Panel', icon: ShieldCheck }
    ] : []),
  ] : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-3 hover:opacity-90 transition group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center glow-purple group-hover:scale-105 transition">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">DonutTrade</h1>
                <p className="text-xs text-white/50">Secure Minecraft Escrow</p>
              </div>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="glass-card px-4 py-2 rounded-xl">
                  <p className="text-white/50 text-xs">Balance</p>
                  <p className="text-white font-bold">
                    ${user.balance.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{user.username}</p>
                    <p className="text-white/50 text-xs">
                      {user.role === 'admin' ? '👑 Admin' : '🎮 Player'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="glass-card p-2.5 rounded-xl hover:bg-white/10 transition"
                >
                  <LogOut className="w-5 h-5 text-white/70" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="btn-secondary text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="btn-primary text-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {user && (
          <aside className="w-64 min-h-[calc(100vh-64px)] glass sticky top-16 self-start">
            <nav className="p-4 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-violet-600/80 to-purple-600/80 text-white shadow-lg shadow-purple-500/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 ${!user ? 'max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
