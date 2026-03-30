import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryApi, type InventoryItem } from '../services/inventoryApi';

export default function AdminInventoryEdit() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingText, setIsUpdatingText] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (id) fetchItem(parseInt(id));
  }, [id]);

  const fetchItem = async (itemId: number) => {
    try {
      const response = await inventoryApi.getItem(itemId);
      setItem(response.data);
      setName(response.data.inventory_name);
      setDescription(response.data.description || '');
    } catch (err) {
      setMessage({ type: 'error', text: `Error loading item: ${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim() || !id) return;

    try {
      setIsUpdatingText(true);
      await inventoryApi.updateText(parseInt(id), {
        inventory_name: name.trim(),
        description: description.trim(),
      });
      setMessage({ type: 'success', text: 'Text updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Error updating text: ${err}` });
    } finally {
      setIsUpdatingText(false);
    }
  };

  const handlePhotoUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!file || !id) return;

    try {
      setIsUpdatingPhoto(true);
      const formData = new FormData();
      formData.append('photo', file);

      const response = await inventoryApi.updatePhoto(parseInt(id), formData);
      setItem(response.data);
      setFile(null);
      setMessage({ type: 'success', text: 'Photo updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Error updating photo: ${err}` });
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!item) return <div className="text-center py-12 text-rose-600">Item not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Editing: {item.inventory_name}</h1>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            {item.photo ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-center">
                <img
                  src={`http://localhost:3000${item.photo}`}
                  alt="Current"
                  className="w-full h-auto max-h-100 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                None
              </div>
            )}
          </div>
          <form onSubmit={handlePhotoUpdate} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer"
            />
            <button
              type="submit"
              disabled={!file || isUpdatingPhoto}
              className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isUpdatingPhoto ? 'Updating...' : 'Update Photo'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Text Information</h2>
          <form onSubmit={handleTextUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
              />
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingText}
                className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isUpdatingText ? 'Updating...' : 'Save Text'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
