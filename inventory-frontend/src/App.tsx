import { Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminInventory from './pages/AdminInventory';
import AdminInventoryCreate from './pages/AdminInventoryCreate';
import AdminInventoryEdit from './pages/AdminInventoryEdit';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-emerald-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl tracking-tight">Online Warehouse</div>
            <div className="flex gap-4">
              <Link to="/gallery" className="hover:bg-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">
                Gallery
              </Link>
              <Link to="/admin" className="hover:bg-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/gallery" replace />} />

          <Route path="/admin" element={<AdminInventory />} />
          <Route path="/admin/create" element={<AdminInventoryCreate />} />
          <Route path="/admin/edit/:id" element={<AdminInventoryEdit />} />

          <Route path="/gallery" element={<div className="text-2xl font-bold">Lab 8</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
