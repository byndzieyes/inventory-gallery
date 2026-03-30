import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi, type InventoryItem } from '../services/inventoryApi';
import InventoryTable from '../components/inventory/InventoryTable';

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await inventoryApi.getInventory();
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Error loading inventory items: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: number) => alert(`Viewing item #${id}`);
  const handleEdit = (id: number) => alert(`Editing item #${id}`);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryApi.deleteItem(id);
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        alert(`Error deleting item #${id}: ${err}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your inventory items</p>
        </div>
        <Link
          to="/admin/create"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm inline-block"
        >
          Add New
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500 animate-pulse font-medium">Loading inventory data...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center font-medium">
          {error}
        </div>
      ) : (
        <InventoryTable items={items} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
