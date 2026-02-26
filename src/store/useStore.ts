import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Listing, Transaction, DepositRequest } from '../types';

interface StoreState {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Listings
  listings: Listing[];
  loadListings: () => Promise<void>;
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateListingStatus: (id: string, status: Listing['status']) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  // Transactions
  transactions: Transaction[];
  loadTransactions: () => Promise<void>;
  createTransaction: (listing: Listing, buyerId: string, buyerUsername: string) => Promise<{ success: boolean; error?: string }>;
  completeTransaction: (transactionId: string, adminId: string) => Promise<void>;
  cancelTransaction: (transactionId: string) => Promise<void>;

  // Deposits
  deposits: DepositRequest[];
  loadDeposits: () => Promise<void>;
  createDepositRequest: (userId: string, username: string, amount: number) => Promise<void>;
  approveDeposit: (requestId: string) => Promise<void>;
  rejectDeposit: (requestId: string) => Promise<void>;

  // Users
  users: User[];
  loadUsers: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  // Auth State
  currentUser: null,

  // Listings State
  listings: [],

  // Transactions State
  transactions: [],

  // Deposits State
  deposits: [],

  // Users State
  users: [],

  // ==================== AUTH ====================
  login: async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid email or password!' };
      }

      const user: User = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at),
      };

      set({ currentUser: user });
      localStorage.setItem('donut_current_user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed!' };
    }
  },

  register: async (username, email, password) => {
    try {
      // Check if user exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${email},username.eq.${username}`)
        .single();

      if (existing) {
        return { success: false, error: 'Email or username already taken!' };
      }

      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password, role: 'user', balance: 0 }])
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Registration failed!' };
      }

      const user: User = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at),
      };

      set({ currentUser: user });
      localStorage.setItem('donut_current_user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed!' };
    }
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('donut_current_user');
  },

  // ==================== LISTINGS ====================
  loadListings: async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const listings: Listing[] = data.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at || item.created_at),
        }));
        set({ listings });
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  },

  createListing: async (listingData) => {
    try {
      const newListing = {
        ...listingData,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select()
        .single();

      if (error) {
        console.error('Error creating listing:', error);
        return;
      }

      const listing: Listing = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at),
      };

      // Immediately update local state
      set((state) => ({
        listings: [listing, ...state.listings],
      }));

      console.log('Listing created:', listing);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  },

  updateListingStatus: async (id, status) => {
    try {
      await supabase
        .from('listings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      set((state) => ({
        listings: state.listings.map((l) =>
          l.id === id ? { ...l, status } : l
        ),
      }));
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  },

  deleteListing: async (id) => {
    try {
      await supabase.from('listings').delete().eq('id', id);

      set((state) => ({
        listings: state.listings.filter((l) => l.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  },

  // ==================== TRANSACTIONS ====================
  loadTransactions: async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const transactions: Transaction[] = data.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at),
          completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
        }));
        set({ transactions });
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  },

  createTransaction: async (listing, buyerId, buyerUsername) => {
    try {
      // Check buyer balance
      const { data: buyer } = await supabase
        .from('users')
        .select('balance')
        .eq('id', buyerId)
        .single();

      if (!buyer || buyer.balance < listing.price) {
        return { success: false, error: 'Insufficient balance!' };
      }

      // Deduct balance
      await supabase.rpc('decrement_balance', {
        user_id: buyerId,
        amount: listing.price,
      });

      // Create transaction
      const newTransaction = {
        listing_id: listing.id,
        buyer_id: buyerId,
        seller_id: listing.sellerId,
        buyer_username: buyerUsername,
        seller_username: listing.sellerUsername,
        item_name: listing.itemName,
        amount: listing.price,
        status: 'escrow',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Transaction failed!' };
      }

      const transaction: Transaction = {
        ...data,
        createdAt: new Date(data.created_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      };

      // Update listing status
      await supabase
        .from('listings')
        .update({ status: 'pending' })
        .eq('id', listing.id);

      // Update local state
      set((state) => ({
        transactions: [transaction, ...state.transactions],
        listings: state.listings.map((l) =>
          l.id === listing.id ? { ...l, status: 'pending' } : l
        ),
      }));

      return { success: true };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { success: false, error: 'Transaction failed!' };
    }
  },

  completeTransaction: async (transactionId, adminId) => {
    try {
      const { data: transaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (!transaction) return;

      // Add money to seller
      await supabase.rpc('increment_balance', {
        user_id: transaction.seller_id,
        amount: transaction.amount,
      });

      // Update transaction
      await supabase
        .from('transactions')
        .update({ status: 'completed', admin_id: adminId })
        .eq('id', transactionId);

      // Update listing
      await supabase
        .from('listings')
        .update({ status: 'sold' })
        .eq('id', transaction.listing_id);

      // Update local state
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transactionId ? { ...t, status: 'completed' } : t
        ),
        listings: state.listings.map((l) =>
          l.id === transaction.listing_id ? { ...l, status: 'sold' } : l
        ),
      }));
    } catch (error) {
      console.error('Error completing transaction:', error);
    }
  },

  cancelTransaction: async (transactionId) => {
    try {
      const { data: transaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (!transaction) return;

      // Refund buyer
      await supabase.rpc('increment_balance', {
        user_id: transaction.buyer_id,
        amount: transaction.amount,
      });

      // Update transaction
      await supabase
        .from('transactions')
        .update({ status: 'cancelled' })
        .eq('id', transactionId);

      // Reactivate listing
      await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', transaction.listing_id);

      // Update local state
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transactionId ? { ...t, status: 'cancelled' } : t
        ),
        listings: state.listings.map((l) =>
          l.id === transaction.listing_id ? { ...l, status: 'active' } : l
        ),
      }));
    } catch (error) {
      console.error('Error cancelling transaction:', error);
    }
  },

  // ==================== DEPOSITS ====================
  loadDeposits: async () => {
    try {
      const { data, error } = await supabase
        .from('deposit_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const deposits: DepositRequest[] = data.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at),
          processedAt: item.processed_at ? new Date(item.processed_at) : undefined,
        }));
        set({ deposits });
      }
    } catch (error) {
      console.error('Error loading deposits:', error);
    }
  },

  createDepositRequest: async (userId, username, amount) => {
    try {
      const newRequest = {
        user_id: userId,
        username,
        amount,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('deposit_requests')
        .insert([newRequest])
        .select()
        .single();

      if (!error && data) {
        const request: DepositRequest = {
          ...data,
          createdAt: new Date(data.created_at),
          processedAt: data.processed_at ? new Date(data.processed_at) : undefined,
        };
        set((state) => ({
          deposits: [request, ...state.deposits],
        }));
      }
    } catch (error) {
      console.error('Error creating deposit request:', error);
    }
  },

  approveDeposit: async (requestId) => {
    try {
      const { data: request } = await supabase
        .from('deposit_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) return;

      // Add balance to user
      await supabase.rpc('increment_balance', {
        user_id: request.user_id,
        amount: request.amount,
      });

      // Update request
      await supabase
        .from('deposit_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      // Update local state
      set((state) => ({
        deposits: state.deposits.map((d) =>
          d.id === requestId ? { ...d, status: 'approved' } : d
        ),
      }));
    } catch (error) {
      console.error('Error approving deposit:', error);
    }
  },

  rejectDeposit: async (requestId) => {
    try {
      await supabase
        .from('deposit_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      set((state) => ({
        deposits: state.deposits.map((d) =>
          d.id === requestId ? { ...d, status: 'rejected' } : d
        ),
      }));
    } catch (error) {
      console.error('Error rejecting deposit:', error);
    }
  },

  // ==================== USERS ====================
  loadUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (!error && data) {
        const users: User[] = data.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at || item.created_at),
        }));
        set({ users });
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  },
}));

// ==================== REAL-TIME SUBSCRIPTIONS ====================
// This runs once when the app loads
if (typeof window !== 'undefined') {
  const channel = supabase.channel('public:all');

  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
    console.log('Listings changed:', payload);
    useStore.getState().loadListings();
  });

  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
    console.log('Transactions changed:', payload);
    useStore.getState().loadTransactions();
  });

  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'deposit_requests' }, (payload) => {
    console.log('Deposits changed:', payload);
    useStore.getState().loadDeposits();
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Real-time sync active!');
    }
  });
}
