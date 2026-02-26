import { Database, Key, Link, Calendar } from 'lucide-react';

export function DatabasePage() {
  const tables = [
    {
      name: 'users',
      description: 'Stores all user accounts and authentication data',
      columns: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY', desc: 'Unique identifier' },
        { name: 'username', type: 'VARCHAR(50)', constraint: 'UNIQUE NOT NULL', desc: 'Minecraft username' },
        { name: 'email', type: 'VARCHAR(255)', constraint: 'UNIQUE NOT NULL', desc: 'User email address' },
        { name: 'password_hash', type: 'VARCHAR(255)', constraint: 'NOT NULL', desc: 'bcrypt hashed password' },
        { name: 'role', type: 'ENUM', constraint: 'DEFAULT "user"', desc: 'user | admin' },
        { name: 'balance', type: 'DECIMAL(15,2)', constraint: 'DEFAULT 0', desc: 'Account balance' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', desc: 'Account creation date' },
        { name: 'updated_at', type: 'TIMESTAMP', constraint: 'ON UPDATE', desc: 'Last modification date' },
      ],
    },
    {
      name: 'listings',
      description: 'Marketplace item listings',
      columns: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY', desc: 'Unique identifier' },
        { name: 'seller_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References users.id' },
        { name: 'title', type: 'VARCHAR(200)', constraint: 'NOT NULL', desc: 'Listing title' },
        { name: 'description', type: 'TEXT', constraint: '', desc: 'Item description' },
        { name: 'item_type', type: 'ENUM', constraint: 'NOT NULL', desc: 'spawner|item|block|tool|armor|other' },
        { name: 'item_name', type: 'VARCHAR(100)', constraint: 'NOT NULL', desc: 'Actual item name' },
        { name: 'quantity', type: 'INTEGER', constraint: 'DEFAULT 1', desc: 'Number of items' },
        { name: 'price', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Listing price' },
        { name: 'status', type: 'ENUM', constraint: 'DEFAULT "active"', desc: 'active|pending|sold|cancelled' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', desc: 'Listing creation date' },
      ],
    },
    {
      name: 'transactions',
      description: 'Escrow transactions between buyers and sellers',
      columns: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY', desc: 'Unique identifier' },
        { name: 'listing_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References listings.id' },
        { name: 'buyer_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References users.id' },
        { name: 'seller_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References users.id' },
        { name: 'amount', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Transaction amount' },
        { name: 'status', type: 'ENUM', constraint: 'DEFAULT "escrow"', desc: 'escrow|completed|cancelled|disputed' },
        { name: 'admin_id', type: 'UUID', constraint: 'NULLABLE FK', desc: 'Admin who processed' },
        { name: 'admin_note', type: 'TEXT', constraint: '', desc: 'Admin notes' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', desc: 'Transaction start' },
        { name: 'completed_at', type: 'TIMESTAMP', constraint: 'NULLABLE', desc: 'Completion timestamp' },
      ],
    },
    {
      name: 'deposit_requests',
      description: 'User deposit requests awaiting admin approval',
      columns: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY', desc: 'Unique identifier' },
        { name: 'user_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References users.id' },
        { name: 'amount', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Deposit amount' },
        { name: 'status', type: 'ENUM', constraint: 'DEFAULT "pending"', desc: 'pending|approved|rejected' },
        { name: 'admin_note', type: 'TEXT', constraint: '', desc: 'Admin notes' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', desc: 'Request creation' },
        { name: 'processed_at', type: 'TIMESTAMP', constraint: 'NULLABLE', desc: 'Processing timestamp' },
      ],
    },
    {
      name: 'balance_history',
      description: 'Complete audit log of all balance changes',
      columns: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY', desc: 'Unique identifier' },
        { name: 'user_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'References users.id' },
        { name: 'type', type: 'ENUM', constraint: 'NOT NULL', desc: 'deposit|withdrawal|purchase|sale|refund' },
        { name: 'amount', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Change amount' },
        { name: 'balance_before', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Balance before change' },
        { name: 'balance_after', type: 'DECIMAL(15,2)', constraint: 'NOT NULL', desc: 'Balance after change' },
        { name: 'description', type: 'TEXT', constraint: '', desc: 'Change description' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', desc: 'Change timestamp' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">🗄️ Database Schema</h1>
        <p className="text-white/60">PostgreSQL database structure and relationships</p>
      </div>

      {/* ER Diagram Overview */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-purple-400" />
          Entity Relationships
        </h2>
        <div className="glass rounded-xl p-4 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │  LISTINGS   │       │TRANSACTIONS │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ seller_id   │       │ listing_id  │──────►│ LISTINGS │
│ username    │       │ id (PK)     │◄──────│ id (PK)     │
│ email       │       │ title       │       │ buyer_id    │──────►│ USERS    │
│ password    │       │ item_type   │       │ seller_id   │──────►│ USERS    │
│ role        │       │ price       │       │ admin_id    │──────►│ USERS    │
│ balance     │       │ status      │       │ status      │
└─────────────┘       └─────────────┘       └─────────────┘
      │                                            │
      │         ┌─────────────────┐               │
      │         │ DEPOSIT_REQUESTS│               │
      │         ├─────────────────┤               │
      └────────►│ user_id (FK)    │               │
                │ id (PK)         │               │
                │ amount          │               │
                │ status          │               │
                └─────────────────┘               │
                                                  │
                ┌─────────────────┐               │
                │ BALANCE_HISTORY │◄──────────────┘
                ├─────────────────┤
                │ user_id (FK)    │
                │ type            │
                │ amount          │
                └─────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Table Definitions */}
      {tables.map((table, i) => (
        <div key={i} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white font-mono">{table.name}</h3>
              <p className="text-white/60 text-sm">{table.description}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/50 border-b border-white/10">
                  <th className="text-left py-3 px-4">Column</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Constraints</th>
                  <th className="text-left py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col, j) => (
                  <tr key={j} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 font-mono text-purple-300 flex items-center gap-2">
                      {col.constraint.includes('PRIMARY') && <Key className="w-4 h-4 text-amber-400" />}
                      {col.constraint.includes('FOREIGN') && <Link className="w-4 h-4 text-blue-400" />}
                      {col.name.includes('_at') && <Calendar className="w-4 h-4 text-emerald-400" />}
                      {col.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-white/60">{col.type}</td>
                    <td className="py-3 px-4">
                      {col.constraint && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          col.constraint.includes('PRIMARY') ? 'bg-amber-500/20 text-amber-300' :
                          col.constraint.includes('FOREIGN') ? 'bg-blue-500/20 text-blue-300' :
                          col.constraint.includes('UNIQUE') ? 'bg-purple-500/20 text-purple-300' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {col.constraint}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white/60">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* SQL Creation Script */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">📝 Prisma Schema (Recommended)</h3>
        <div className="glass rounded-xl p-4 font-mono text-xs text-white/80 overflow-x-auto">
          <pre>{`// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(USER)
  balance      Decimal  @default(0) @db.Decimal(15, 2)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  listings     Listing[]
  purchases    Transaction[] @relation("buyer")
  sales        Transaction[] @relation("seller")
  deposits     DepositRequest[]
  balanceLog   BalanceHistory[]

  @@map("users")
}

model Listing {
  id          String   @id @default(uuid())
  seller      User     @relation(fields: [sellerId], references: [id])
  sellerId    String   @map("seller_id")
  title       String   @db.VarChar(200)
  description String?  @db.Text
  itemType    ItemType @map("item_type")
  itemName    String   @map("item_name") @db.VarChar(100)
  quantity    Int      @default(1)
  price       Decimal  @db.Decimal(15, 2)
  status      ListingStatus @default(ACTIVE)
  createdAt   DateTime @default(now()) @map("created_at")

  transactions Transaction[]

  @@map("listings")
}

enum Role {
  USER
  ADMIN
}

enum ItemType {
  SPAWNER
  ITEM
  BLOCK
  TOOL
  ARMOR
  OTHER
}

enum ListingStatus {
  ACTIVE
  PENDING
  SOLD
  CANCELLED
}`}</pre>
        </div>
      </div>
    </div>
  );
}
