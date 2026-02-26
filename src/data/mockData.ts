import { User, Listing, Transaction, DepositRequest } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'Kebapseverim_',
    email: 'admin@donuttrade.com',
    password: '123',
    role: 'admin',
    balance: 999999,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'DiamondKing',
    email: 'diamond@test.com',
    password: '123456',
    role: 'user',
    balance: 50000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'CreeperSlayer',
    email: 'creeper@test.com',
    password: '123456',
    role: 'user',
    balance: 25000,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
];

// Mock Listings with images
export const mockListings: Listing[] = [
  {
    id: '1',
    sellerId: '2',
    sellerUsername: 'DiamondKing',
    title: 'Creeper Spawner - Rare Find!',
    description: 'Barely used Creeper Spawner. Perfect for gunpowder farming. Fast delivery guaranteed!',
    itemType: 'spawner',
    itemName: 'Creeper Spawner',
    quantity: 1,
    price: 15000,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1627856014759-0852292495e9?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sellerId: '3',
    sellerUsername: 'CreeperSlayer',
    title: '32x Diamond Blocks',
    description: 'Total of 32 Diamond Blocks. Selling all at once.',
    itemType: 'stash',
    itemName: 'Diamond Block',
    quantity: 32,
    price: 8000,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    sellerId: '2',
    sellerUsername: 'DiamondKing',
    title: 'Netherite Sword - Max Enchants',
    description: 'Sharpness V, Fire Aspect II, Looting III, Unbreaking III, Mending. Perfect sword!',
    itemType: 'tools',
    itemName: 'Netherite Sword',
    quantity: 1,
    price: 12000,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae9f0294?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    sellerId: '3',
    sellerUsername: 'CreeperSlayer',
    title: 'Zombie Spawner',
    description: 'Perfect for XP farming. Coordinates will be provided to buyer.',
    itemType: 'spawner',
    itemName: 'Zombie Spawner',
    quantity: 1,
    price: 10000,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1627856014759-0852292495e9?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date(),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    listingId: '5',
    buyerId: '3',
    sellerId: '2',
    buyerUsername: 'CreeperSlayer',
    sellerUsername: 'DiamondKing',
    itemName: 'Skeleton Spawner',
    amount: 12000,
    status: 'completed',
    adminId: '1',
    createdAt: new Date('2024-02-20'),
    completedAt: new Date('2024-02-21'),
  },
];

// Mock Deposit Requests
export const mockDepositRequests: DepositRequest[] = [
  {
    id: '1',
    userId: '3',
    username: 'CreeperSlayer',
    amount: 10000,
    status: 'pending',
    createdAt: new Date(),
  },
];
