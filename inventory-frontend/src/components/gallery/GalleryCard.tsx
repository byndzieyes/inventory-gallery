import { type InventoryItem } from '../../services/inventoryApi';
import { Link } from 'react-router-dom';

interface GalleryCardProps {
  item: InventoryItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export default function GalleryCard({ item, isFavorite, onToggleFavorite }: GalleryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        {item.photo ? (
          <img
            src={`http://localhost:3000${item.photo}`}
            alt={item.inventory_name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-6xl opacity-20">None</div>
        )}

        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <span className="text-rose-500 text-xl drop-shadow-sm">❤️</span>
          ) : (
            <span className="text-slate-300 text-xl hover:text-rose-400 transition-colors">🤍</span>
          )}
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{item.inventory_name}</h3>
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
          {item.description || 'No description available.'}
        </p>

        <Link
          to={`/gallery/${item.id}`}
          className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors mt-auto text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
