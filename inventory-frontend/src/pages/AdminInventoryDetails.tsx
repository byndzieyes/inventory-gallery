import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryApi, type InventoryItem } from '../services/inventoryApi';

export default function AdminInventoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchItem(parseInt(id));
    }
  }, [id]);

  const fetchItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      const response = await inventoryApi.getItem(itemId);
      setItem(response.data);
    } catch (err) {
      setError(`Error loading item details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500 animate-pulse font-medium">Loading item details...</div>;
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl font-medium border border-rose-200">{error}</div>
        <Link to="/admin" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to Inventory List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Item Details</h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-[60%] bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
          {item.photo ? (
            <div className="w-full h-full p-4 md:p-0 flex items-center justify-center">
              <img
                src={`http://localhost:3000${item.photo}`}
                alt={item.inventory_name}
                className="w-full h-auto max-h-150 md:max-h-175 object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 py-32 w-full">
              <span className="text-8xl mb-6">📷</span>
              <p className="text-lg font-medium">Image not available</p>
            </div>
          )}
        </div>

        <div className="md:w-[40%] p-8 md:p-12 flex flex-col bg-white">
          <h2 className="text-4xl font-black text-slate-950 mb-8 leading-tight tracking-tighter">
            {item.inventory_name}
          </h2>

          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</h3>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
              {item.description ? (
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">{item.description}</p>
              ) : (
                <p className="text-slate-400 italic text-base">Description not added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
