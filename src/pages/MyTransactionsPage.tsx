import { Clock, CheckCircle, XCircle, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { Transaction, User, Listing } from '../types';

interface MyTransactionsPageProps {
  transactions: Transaction[];
  listings: Listing[];
  user: User;
}

const statusConfig = {
  escrow: { label: 'In Escrow', color: 'badge-escrow', icon: Clock },
  completed: { label: 'Completed', color: 'badge-completed', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'badge-cancelled', icon: XCircle },
  disputed: { label: 'Disputed', color: 'badge-pending', icon: ShieldCheck },
};

// Helper to pick emoji for listing category
const getListingEmoji = (itemType: Listing['itemType']): string => {
  switch (itemType) {
    case 'spawner':
      return '💀';
    case 'tools':
      return '🛠️';
    case 'armour':
      return '🛡️';
    case 'farm':
      return '🌾';
    case 'stash':
      return '📦';
    case 'other':
    default:
      return '✨';
  }
};

export function MyTransactionsPage({ transactions, listings, user }: MyTransactionsPageProps) {
  const myTransactions = transactions.filter(
    t => t.buyerId === user.id || t.sellerId === user.id
  );

  const myListings = listings.filter(l => l.sellerId === user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📋 My Trades</h1>
        <p className="text-white/60">View your listings and transaction history</p>
      </div>

      {/* My Listings */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          My Listings
        </h2>

        {myListings.length === 0 ? (
          <p className="text-white/50 text-center py-6">You haven't created any listings yet.</p>
        ) : (
          <div className="space-y-3">
            {myListings.map(listing => (
              <div key={listing.id} className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getListingEmoji(listing.itemType)}
                  </span>
                  <div>
                    <p className="font-medium text-white">{listing.title}</p>
                    <p className="text-sm text-white/50">{listing.itemName} x{listing.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-400">
                    ${listing.price.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-lg ${
                      listing.status === 'active'
                        ? 'badge-completed'
                        : listing.status === 'pending'
                        ? 'badge-escrow'
                        : listing.status === 'sold'
                        ? 'badge-pending'
                        : 'badge-cancelled'
                    }`}
                  >
                    {listing.status === 'active'
                      ? 'Active'
                      : listing.status === 'pending'
                      ? 'Pending Sale'
                      : listing.status === 'sold'
                      ? 'Sold'
                      : 'Cancelled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Transaction History
        </h2>

        {myTransactions.length === 0 ? (
          <p className="text-white/50 text-center py-6">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {myTransactions.map(transaction => {
              const isBuyer = transaction.buyerId === user.id;
              const StatusIcon = statusConfig[transaction.status].icon;

              return (
                <div key={transaction.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isBuyer ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                        }`}
                      >
                        {isBuyer ? '🛒' : '💰'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{transaction.itemName}</p>
                        <p className="text-sm text-white/50">
                          {isBuyer ? 'Purchase' : 'Sale'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 ${
                        statusConfig[transaction.status].color
                      }`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig[transaction.status].label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm glass rounded-lg p-3 mb-3">
                    <div>
                      <span className="text-white/50">Seller:</span>
                      <span className="font-medium text-white ml-1">
                        {transaction.sellerUsername}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                    <div>
                      <span className="text-white/50">Buyer:</span>
                      <span className="font-medium text-white ml-1">
                        {transaction.buyerUsername}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-sm text-white/50">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`font-semibold ${
                        isBuyer ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isBuyer ? '-' : '+'}${transaction.amount.toLocaleString()}
                    </span>
                  </div>

                  {transaction.status === 'escrow' && (
                    <div className="mt-3 p-3 glass-purple rounded-lg">
                      <p className="text-sm text-purple-300">
                        ⏳ Waiting for admin to confirm delivery.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
