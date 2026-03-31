import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryApi, type InventoryItem } from '../services/inventoryApi';

export default function GalleryDetails() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      inventoryApi
        .getItem(parseInt(id))
        .then((res) => setItem(res.data))
        .catch(() => setItem(null))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">Loading details...</div>;
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl font-medium border border-rose-200">Item not found</div>
        <Link to="/gallery" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link
          to="/gallery"
          className="text-slate-400 hover:text-indigo-600 transition-colors font-medium flex items-center gap-2"
        >
          ← Back to gallery
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-[60%] bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-8">
          {item.photo ? (
            <img
              src={`http://localhost:3000${item.photo}`}
              alt={item.inventory_name}
              className="w-full h-auto max-h-125 md:max-h-150 object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 py-32 w-full">
              <p className="text-lg font-medium">Image not found</p>
            </div>
          )}
        </div>

        <div className="md:w-[40%] p-8 md:p-12 flex flex-col bg-white">
          <h1 className="text-4xl font-black text-slate-950 mb-8 leading-tight tracking-tighter">
            {item.inventory_name}
          </h1>

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
