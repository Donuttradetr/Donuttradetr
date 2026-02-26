import { useState, useRef } from 'react';
import { Package, Tag, FileText, Hash, CheckCircle, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { User, Listing } from '../types';

interface CreateListingPageProps {
  user: User;
  onCreateListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onNavigate: (page: string) => void;
}

// Unified listing categories
const itemTypes = [
  { value: 'spawner', label: 'Spawner', emoji: '💀' },
  { value: 'tools', label: 'Tools', emoji: '🛠️' },
  { value: 'armour', label: 'Armour', emoji: '🛡️' },
  { value: 'farm', label: 'Farm', emoji: '🌾' },
  { value: 'stash', label: 'Stash', emoji: '📦' },
  { value: 'other', label: 'Other', emoji: '✨' },
] as const;

export function CreateListingPage({ user, onCreateListing, onNavigate }: CreateListingPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<Listing['itemType']>('spawner');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB!');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !itemName || !price) {
      setError('Please fill in all fields!');
      return;
    }

    const priceNum = parseInt(price);
    const quantityNum = parseInt(quantity);

    if (priceNum <= 0) {
      setError('Price must be greater than 0!');
      return;
    }

    onCreateListing({
      sellerId: user.id,
      sellerUsername: user.username,
      title,
      description,
      itemType,
      itemName,
      quantity: quantityNum,
      price: priceNum,
      imageUrl: image || undefined,
    });

    setSuccess(true);
    setTimeout(() => {
      onNavigate('listings');
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Listing Created!</h2>
          <p className="text-white/60">Your item is now live on the marketplace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">➕ Create New Listing</h1>
        <p className="text-white/60">List an item for sale on the marketplace</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Listing Image</label>
            <div className="space-y-3">
              {image ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={image} alt="Listing preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-white/5"
                >
                  <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/80 font-medium mb-1">Click to upload image</p>
                  <p className="text-white/50 text-sm">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Item Category</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {itemTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setItemType(type.value)}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    itemType === type.value
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.emoji}</span>
                  <span className="text-xs font-medium text-white/80">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Item Name</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="input-dark pl-12"
                placeholder="e.g., Creeper Spawner, Netherite Pickaxe"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Listing Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-dark pl-12"
                placeholder="Write an eye-catching title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-dark resize-none"
              placeholder="Describe your item in detail (condition, enchantments, etc.)"
            />
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Quantity</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="input-dark pl-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Price (In-game Currency)
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  className="input-dark pl-12"
                  placeholder="e.g., 15000"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {(title || image) && (
            <div className="glass-purple rounded-xl p-4">
              <p className="text-sm font-medium text-purple-300 mb-3">Preview:</p>
              <div className="bg-white/5 rounded-lg overflow-hidden">
                {image && (
                  <img src={image} alt="Preview" className="w-full h-32 object-cover" />
                )}
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {itemTypes.find(t => t.value === itemType)?.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{title || 'Your Title'}</p>
                      <p className="text-sm text-white/60">
                        {itemName || 'Item Name'} x{quantity}
                      </p>
                      <p className="text-sm font-bold text-purple-400 mt-1">
                        ${price ? parseInt(price).toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-4">
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );
}
