import { useState, useEffect } from 'react';
import { inventoryApi, type InventoryItem } from '../services/inventoryApi';
import GalleryCard from '../components/gallery/GalleryCard';

export default function Gallery() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchItems();

    const savedFavorites = localStorage.getItem('inventory_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error reading favorites from localStorage', e);
      }
    }
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await inventoryApi.getInventory();
      setItems(response.data);
    } catch (err) {
      setError(`Error loading inventory items: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      let newFavorites;
      if (prev.includes(id)) {
        newFavorites = prev.filter((favId) => favId !== id);
      } else {
        newFavorites = [...prev, id];
      }

      localStorage.setItem('inventory_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (isLoading)
    return <div className="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">Loading gallery...</div>;
  if (error) return <div className="text-center py-20 text-rose-600 font-medium">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Gallery</h1>
          <p className="text-slate-500 mt-2">Choose the best and add to favorites.</p>
        </div>

        <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 flex items-center gap-2">
          <span className="text-rose-500">❤️</span>
          <span className="font-medium text-rose-700">Favorites: {favorites.length}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mt-4">Sorry, no items available</h3>
          <p className="text-slate-500 mt-2">The administrator has not added any inventory to the warehouse yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
