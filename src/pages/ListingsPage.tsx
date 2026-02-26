import { useState } from 'react';
import { Search, Filter, Tag, Clock, ShoppingCart, Eye, TrendingUp, ShieldCheck } from 'lucide-react';
import { Listing, User } from '../types';

interface ListingsPageProps {
  listings: Listing[];
  user: User;
  onPurchase: (listing: Listing) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
}

// Unified listing categories with meaningful emojis
const itemTypeLabels: Record<string, { label: string; emoji: string }> = {
  spawner: { label: 'Spawner', emoji: '💀' }, // mob spawners
  tools: { label: 'Tools', emoji: '🛠️' }, // pickaxe / sword / tools
  armour: { label: 'Armour', emoji: '🛡️' }, // armor sets
  farm: { label: 'Farm', emoji: '🌾' }, // farming items
  stash: { label: 'Stash', emoji: '📦' }, // bulk / blocks / valuables
  other: { label: 'Other', emoji: '✨' },
};

export function ListingsPage({ listings, user, onPurchase, onRefresh }: ListingsPageProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showTrustedOnly, setShowTrustedOnly] = useState(false);

  const activeListings = listings.filter(l => l.status === 'active' && l.sellerId !== user.id);

  const filteredListings = activeListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.itemName.toLowerCase().includes(search.toLowerCase()) ||
      listing.sellerUsername.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || listing.itemType === filterType;
    const matchesPrice = (!priceMin || listing.price >= parseInt(priceMin)) &&
      (!priceMax || listing.price <= parseInt(priceMax));
    return matchesSearch && matchesType && matchesPrice;
  });

  // Category counts
  const categoryCounts = {
    all: activeListings.length,
    spawner: activeListings.filter(l => l.itemType === 'spawner').length,
    tools: activeListings.filter(l => l.itemType === 'tools').length,
    armour: activeListings.filter(l => l.itemType === 'armour').length,
    farm: activeListings.filter(l => l.itemType === 'farm').length,
    stash: activeListings.filter(l => l.itemType === 'stash').length,
    other: activeListings.filter(l => l.itemType === 'other').length,
  };

  const handlePurchase = async (listing: Listing) => {
    const result = await onPurchase(listing);
    setPurchaseResult(result);
    if (result.success) {
      setTimeout(() => {
        setSelectedListing(null);
        setPurchaseResult(null);
        onRefresh();
      }, 2000);
    }
  };

  const getCategoryCount = (type: string) => categoryCounts[type as keyof typeof categoryCounts];

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Categories */}
      <div className="w-64 flex-shrink-0">
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              İlan Tipi
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setFilterType('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-purple-500/20 text-white border border-purple-500/30'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>📋 Tümü</span>
                  <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full">
                    {getCategoryCount('all')}
                  </span>
                </div>
              </button>
              {Object.entries(itemTypeLabels).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    filterType === key
                      ? 'bg-purple-500/20 text-white border border-purple-500/30'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{val.emoji} {val.label}</span>
                    <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full">
                      {getCategoryCount(key)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Price Range */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Fiyat Aralığı
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">En az</span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="0"
                  className="input-dark text-sm w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">En çok</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="999999"
                  className="input-dark text-sm w-full"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Filters */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Filtreleme
            </h3>
            <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={showTrustedOnly}
                onChange={(e) => setShowTrustedOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Yalnızca güvenilir satıcılar
            </label>
          </div>
        </div>
      </div>

      {/* Main Content - Listings Grid */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İlan başlığı ve Satıcı ara..."
                className="input-dark pl-12 w-full"
              />
            </div>
            <button className="btn-primary px-6">
              Ara
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🍩</div>
            <h3 className="text-xl font-semibold text-white">İlan Bulunamadı</h3>
            <p className="text-white/60 mt-2">Arama kriterlerinizi değiştirin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredListings.map(listing => (
              <div
                key={listing.id}
                className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-purple-500/30"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  {listing.featured && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ÖNE ÇIKAN
                    </div>
                  )}
                  {listing.vitrin && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      VİTRİN
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                  {listing.imageUrl ? (
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-7xl transform hover:scale-110 transition-transform">
                      {itemTypeLabels[listing.itemType]?.emoji || '📦'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 relative">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {listing.sellerUsername.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{listing.sellerUsername}</p>
                      <p className="text-white/40 text-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Kullanıcı aktif
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {listing.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/50 line-clamp-2 mb-3">
                    {listing.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{listing.quantity} adet</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 500) + 50} görüntülenme</span>
                    </div>
                  </div>

                  {/* Price & Buy */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span className="text-lg font-bold text-emerald-400">
                        ${listing.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Satın Al
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            {purchaseResult?.success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Satın Alma Başarılı!</h3>
                <p className="text-white/60 mt-2">
                  Fonlar güvenli havuzda bekliyor. Admin teslimatı onaylayacak.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Satın Alma Onayı</h3>
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setPurchaseResult(null);
                    }}
                  >
                    <svg className="w-6 h-6 text-white/50 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {purchaseResult?.error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {purchaseResult.error}
                  </div>
                )}

                <div className="glass rounded-xl p-4 mb-4">
                  {selectedListing.imageUrl && (
                    <img 
                      src={selectedListing.imageUrl} 
                      alt={selectedListing.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {itemTypeLabels[selectedListing.itemType]?.emoji || '📦'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white">{selectedListing.itemName}</h4>
                      <p className="text-sm text-white/50">
                        x{selectedListing.quantity} - {selectedListing.sellerUsername}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/60">Ürün Fiyatı</span>
                    <span className="font-semibold text-white">
                      ${selectedListing.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Bakiyeniz</span>
                    <span className="font-semibold text-emerald-400">
                      ${user.balance.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between">
                    <span className="text-white/60">Satın Alma Sonrası</span>
                    <span
                      className={`font-semibold ${
                        user.balance - selectedListing.price >= 0
                          ? 'text-white'
                          : 'text-red-400'
                      }`}
                    >
                      ${(user.balance - selectedListing.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="glass-purple rounded-xl p-3 mb-4">
                  <p className="text-sm text-purple-300">
                    🔒 Fonlar, admin teslimatı onaylayana kadar escrow'da tutulacaktır.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setPurchaseResult(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handlePurchase(selectedListing)}
                    disabled={user.balance < selectedListing.price}
                    className="btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Onayla
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
