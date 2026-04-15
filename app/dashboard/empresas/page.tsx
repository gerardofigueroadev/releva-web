'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Empresa } from '@/lib/types';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState({ nombre: '', ruc: '', plan: 'trial' });
  const [error, setError] = useState('');

  async function load() {
    const data = await apiFetch<Empresa[]>('/empresas');
    setEmpresas(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/empresas', { method: 'POST', body: JSON.stringify(form) });
      setForm({ nombre: '', ruc: '', plan: 'trial' });
      load();
    } catch {
      setError('Error al crear la empresa');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta empresa?')) return;
    await apiFetch(`/empresas/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Empresas</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RUC</label>
          <input value={form.ruc} onChange={(e) => setForm({ ...form, ruc: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="border rounded px-3 py-2 text-sm">
            <option value="trial">Trial</option>
            <option value="basico">Básico</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Crear</button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">RUC</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-3 font-medium">{e.nombre}</td>
                <td className="px-4 py-3 text-gray-500">{e.ruc || '—'}</td>
                <td className="px-4 py-3 capitalize">{e.plan}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${e.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {e.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
