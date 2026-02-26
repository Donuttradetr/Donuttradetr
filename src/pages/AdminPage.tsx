import { useState } from 'react';
import { ShieldCheck, Users, Clock, CheckCircle, XCircle, Wallet, ArrowRight, RefreshCw } from 'lucide-react';
import { User, Transaction, DepositRequest } from '../types';

interface AdminPageProps {
  users: User[];
  transactions: Transaction[];
  depositRequests: DepositRequest[];
  onCompleteTransaction: (transactionId: string, adminId: string) => void;
  onCancelTransaction: (transactionId: string) => void;
  onApproveDeposit: (requestId: string) => void;
  onRejectDeposit: (requestId: string) => void;
  onRefresh: () => void;
  currentUser: User;
}

export function AdminPage({
  users,
  transactions,
  depositRequests,
  onCompleteTransaction,
  onCancelTransaction,
  onApproveDeposit,
  onRejectDeposit,
  onRefresh,
  currentUser,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'deposits' | 'users'>('transactions');

  const pendingTransactions = transactions.filter(t => t.status === 'escrow');
  const pendingDeposits = depositRequests.filter(d => d.status === 'pending');

  const tabs = [
    { id: 'transactions', label: 'Escrow Queue', count: pendingTransactions.length },
    { id: 'deposits', label: 'Deposit Requests', count: pendingDeposits.length },
    { id: 'users', label: 'All Users', count: users.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/60">Manage transactions and approvals</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="glass-card p-3 rounded-xl hover:bg-white/10 transition"
        >
          <RefreshCw className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-amber-500">
          <p className="text-white/50 text-sm">Pending Escrow</p>
          <p className="text-3xl font-bold text-white">{pendingTransactions.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border-l-4 border-emerald-500">
          <p className="text-white/50 text-sm">Deposit Requests</p>
          <p className="text-3xl font-bold text-white">{pendingDeposits.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border-l-4 border-blue-500">
          <p className="text-white/50 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-4 px-6 font-medium transition relative ${
                activeTab === tab.id
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {pendingTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white/60">No pending transactions</p>
                </div>
              ) : (
                pendingTransactions.map(transaction => (
                  <div key={transaction.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{transaction.itemName}</p>
                          <p className="text-sm text-white/50">
                            ${transaction.amount.toLocaleString()} in escrow
                          </p>
                        </div>
                      </div>
                      <span className="badge-escrow">Awaiting Delivery</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm glass rounded-lg p-3 mb-4">
                      <div>
                        <span className="text-white/50">Seller:</span>
                        <span className="font-medium text-white ml-1">{transaction.sellerUsername}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30" />
                      <div>
                        <span className="text-white/50">Buyer:</span>
                        <span className="font-medium text-white ml-1">{transaction.buyerUsername}</span>
                      </div>
                    </div>

                    <div className="glass-purple rounded-lg p-3 mb-4">
                      <p className="text-sm text-purple-300">
                        📋 <strong>Action Required:</strong> Collect item from {transaction.sellerUsername} and deliver to {transaction.buyerUsername} in-game.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onCancelTransaction(transaction.id)}
                        className="btn-danger flex-1 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel & Refund
                      </button>
                      <button
                        onClick={() => onCompleteTransaction(transaction.id, currentUser.id)}
                        className="btn-success flex-1 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Deposits Tab */}
          {activeTab === 'deposits' && (
            <div className="space-y-4">
              {pendingDeposits.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white/60">No pending deposit requests</p>
                </div>
              ) : (
                pendingDeposits.map(deposit => (
                  <div key={deposit.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{deposit.username}</p>
                          <p className="text-sm text-white/50">
                            {new Date(deposit.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400">
                        +${deposit.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="glass-purple rounded-lg p-3 mb-4">
                      <p className="text-sm text-amber-300">
                        ⚠️ Verify that you received ${deposit.amount.toLocaleString()} from {deposit.username} in-game.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onRejectDeposit(deposit.id)}
                        className="btn-danger flex-1"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveDeposit(deposit.id)}
                        className="btn-success flex-1"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Users className={`w-5 h-5 ${
                        user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-white flex items-center gap-2">
                        {user.username}
                        {user.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/30">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-white/50">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">${user.balance.toLocaleString()}</p>
                    <p className="text-xs text-white/40">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
