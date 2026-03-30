import { type InventoryItem } from '../../services/inventoryApi';

interface InventoryTableProps {
  items: InventoryItem[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function InventoryTable({ items, onView, onEdit, onDelete }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-slate-900">Empty</h3>
        <p className="text-slate-500 mt-1">No inventory items to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Photo</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                {item.photo ? (
                  <img
                    src={`http://localhost:3000${item.photo}`}
                    alt={item.inventory_name}
                    className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                    None
                  </div>
                )}
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">{item.inventory_name}</td>
              <td className="px-6 py-4 max-w-xs truncate">{item.description || '—'}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onView(item.id)}
                  className="px-3 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md font-medium transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(item.id)}
                  className="px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
