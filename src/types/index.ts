// ============================================
// DONUT TRADE - DATABASE SCHEMA (TypeScript)
// ============================================

// USERS Table
export interface User {
  id: string;
  username: string; // In-game Minecraft username
  email: string;
  password: string; // Hashed password
  role: 'user' | 'admin';
  balance: number; // Site balance (in-game currency)
  createdAt: Date;
  updatedAt: Date;
}

// LISTINGS Table
export interface Listing {
  id: string;
  sellerId: string; // References User.id
  sellerUsername: string;
  title: string;
  description: string;
  itemType: 'spawner' | 'tools' | 'armour' | 'farm' | 'stash' | 'other';
  itemName: string; // e.g., "Creeper Spawner"
  quantity: number;
  price: number; // Price in in-game currency
  status: 'active' | 'pending' | 'sold' | 'cancelled';
  imageUrl?: string; // Main listing image
  images?: string[]; // Multiple images (gallery)
  featured?: boolean; // Featured/Premium listing
  vitrin?: boolean; // Showcase listing
  createdAt: Date;
  updatedAt: Date;
}

// TRANSACTIONS (Escrow) Table
export interface Transaction {
  id: string;
  listingId: string; // References Listing.id
  buyerId: string; // References User.id
  sellerId: string; // References User.id
  buyerUsername: string;
  sellerUsername: string;
  itemName: string;
  amount: number; // Transaction amount
  status: 'escrow' | 'completed' | 'cancelled' | 'disputed';
  adminId?: string; // Admin who approved the transaction
  adminNote?: string;
  createdAt: Date;
  completedAt?: Date;
}

// BALANCE_HISTORY Table
export interface BalanceHistory {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale' | 'refund';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  adminId?: string;
  createdAt: Date;
}

// DEPOSIT_REQUESTS Table
export interface DepositRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: Date;
  processedAt?: Date;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
