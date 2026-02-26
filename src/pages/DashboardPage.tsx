import { useState } from 'react';
import { Wallet, Package, ShoppingCart, TrendingUp, ArrowUpCircle, Send, AlertCircle, CheckCircle, X } from 'lucide-react';
import { User } from '../types';

interface DashboardPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onDepositRequest: (amount: number) => void;
}

export function DashboardPage({ user, onNavigate, onDepositRequest }: DashboardPageProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (amount > 0) {
      onDepositRequest(amount);
      setDepositAmount('');
      setDepositSuccess(true);
      setTimeout(() => {
        setShowDepositModal(false);
        setDepositSuccess(false);
      }, 2000);
    }
  };

  const stats = [
    { label: 'Total Balance', value: `$${user.balance.toLocaleString()}`, icon: Wallet, gradient: 'from-emerald-500 to-green-500' },
    { label: 'Active Listings', value: '2', icon: Package, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Total Sales', value: '5', icon: TrendingUp, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Total Purchases', value: '3', icon: ShoppingCart, gradient: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-purple rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user.username}</span>! 👋
        </h1>
        <p className="text-white/60">Manage your trades and balance from your personal dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Add Balance</h3>
          </div>
          <p className="text-white/60 text-sm mb-4">
            Send in-game currency to <span className="text-purple-400 font-semibold">DonutBankBot</span> and request a deposit.
          </p>
          <button
            onClick={() => setShowDepositModal(true)}
            className="btn-success w-full"
          >
            📥 Request Deposit
          </button>
        </div>

        {/* Quick Trade */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('listings')}
              className="btn-secondary text-sm"
            >
              📦 Marketplace
            </button>
            <button
              onClick={() => onNavigate('create-listing')}
              className="btn-secondary text-sm"
            >
              ➕ New Listing
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📖 How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Deposit', desc: 'Send currency to bot in-game' },
            { step: '2', title: 'List Item', desc: 'Create a listing for your item' },
            { step: '3', title: 'Secure Purchase', desc: 'Funds held in escrow' },
            { step: '4', title: 'Delivery', desc: 'Admin confirms, funds released' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 glass rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-2">
                {item.step}
              </div>
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-white/50 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            {depositSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Request Submitted!</h3>
                <p className="text-white/60 mt-2">Your balance will be added once admin confirms.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Deposit Request</h3>
                  <button onClick={() => setShowDepositModal(false)} className="text-white/50 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="glass-purple rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-purple-300 font-medium mb-2">How to deposit:</p>
                      <ol className="list-decimal list-inside space-y-1 text-white/70 text-sm">
                        <li>Join the Minecraft server</li>
                        <li>Find <strong className="text-purple-400">DonutBankBot</strong></li>
                        <li>Use <code className="bg-black/30 px-1 rounded">/pay DonutBankBot [amount]</code></li>
                        <li>Enter the amount below and submit</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Amount Sent
                  </label>
                  <div className="relative">
                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="input-dark pl-12"
                      placeholder="e.g., 10000"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    className="btn-success flex-1"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
