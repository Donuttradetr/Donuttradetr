import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ListingsPage } from './pages/ListingsPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { MyTransactionsPage } from './pages/MyTransactionsPage';
import { AdminPage } from './pages/AdminPage';
import { BotPage } from './pages/BotPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { DatabasePage } from './pages/DatabasePage';
import { useStore } from './store/useStore';
import { Listing } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Use the new Zustand store
  const { 
    currentUser: user, 
    login, 
    register, 
    logout,
    listings,
    createListing,
    loadListings,
    transactions,
    createTransaction,
    completeTransaction,
    cancelTransaction,
    loadTransactions,
    deposits,
    createDepositRequest,
    approveDeposit,
    rejectDeposit,
    loadDeposits,
    users,
    loadUsers
  } = useStore();

  // Load data on mount
  useEffect(() => {
    loadListings();
    loadTransactions();
    loadDeposits();
    loadUsers();
    
    // Check for saved user
    const savedUser = localStorage.getItem('donut_current_user');
    if (savedUser) {
      // Just verify it exists, don't use it directly
      try {
        JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('donut_current_user');
      }
    }
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await login(email, password);
    if (result.success) {
      setCurrentPage('dashboard');
      loadListings();
      loadTransactions();
      loadDeposits();
      loadUsers();
    }
    return result;
  };

  const handleRegister = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await register(username, email, password);
    if (result.success) {
      setCurrentPage('dashboard');
      loadListings();
      loadTransactions();
      loadDeposits();
      loadUsers();
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
  };

  const handleDepositRequest = async (amount: number) => {
    if (user) {
      await createDepositRequest(user.id, user.username, amount);
      loadDeposits();
    }
  };

  const handlePurchase = async (listing: Listing): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'You must be logged in!' };
    const result = await createTransaction(listing, user.id, user.username);
    if (result.success) {
      loadListings();
      loadTransactions();
    }
    return result;
  };

  const handleRefreshAll = () => {
    loadListings();
    loadTransactions();
    loadDeposits();
    loadUsers();
  };

  const handleCompleteTransaction = async (transactionId: string, adminId: string) => {
    await completeTransaction(transactionId, adminId);
    handleRefreshAll();
  };

  const handleCancelTransaction = async (transactionId: string) => {
    await cancelTransaction(transactionId);
    handleRefreshAll();
  };

  const handleApproveDeposit = async (requestId: string) => {
    await approveDeposit(requestId);
    handleRefreshAll();
  };

  const handleRejectDeposit = async (requestId: string) => {
    await rejectDeposit(requestId);
    handleRefreshAll();
  };

  const handleCreateListing = async (listingData: any) => {
    await createListing({
      ...listingData,
      sellerId: user?.id || '',
      sellerUsername: user?.username || '',
    });
    loadListings();
    handleNavigate('listings');
  };

  const renderPage = () => {
    // Public pages
    if (!user) {
      switch (currentPage) {
        case 'login':
          return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
        case 'register':
          return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    // Authenticated pages
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage 
            user={user} 
            onNavigate={handleNavigate}
            onDepositRequest={handleDepositRequest}
          />
        );
      case 'listings':
        return (
          <ListingsPage 
            listings={listings}
            user={user}
            onPurchase={handlePurchase}
            onRefresh={handleRefreshAll}
          />
        );
      case 'create-listing':
        return (
          <CreateListingPage 
            user={user}
            onCreateListing={handleCreateListing}
            onNavigate={handleNavigate}
          />
        );
      case 'my-transactions':
        return (
          <MyTransactionsPage 
            transactions={transactions}
            listings={listings}
            user={user}
          />
        );
      case 'architecture':
        return <ArchitecturePage />;
      case 'database':
        return <DatabasePage />;
      case 'bot':
        return <BotPage />;
      case 'admin':
        if (user.role !== 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
        return (
          <AdminPage 
            users={users}
            transactions={transactions}
            depositRequests={deposits}
            onCompleteTransaction={handleCompleteTransaction}
            onCancelTransaction={handleCancelTransaction}
            onApproveDeposit={handleApproveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onRefresh={handleRefreshAll}
            currentUser={user}
          />
        );
      default:
        return (
          <DashboardPage 
            user={user} 
            onNavigate={handleNavigate}
            onDepositRequest={handleDepositRequest}
          />
        );
    }
  };

  return (
    <Layout 
      user={user} 
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
