'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Role } from '@/lib/types';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const data = await apiFetch<Role[]>('/roles');
    setRoles(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/roles', { method: 'POST', body: JSON.stringify({ name, description }) });
      setName(''); setDescription('');
      load();
    } catch {
      setError('Error al crear el rol');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este rol?')) return;
    await apiFetch(`/roles/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Crear</button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">ID</th>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 text-gray-500">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-gray-500">{r.description || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
