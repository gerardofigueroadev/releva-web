'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User, Role, Empresa } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', empresaId: '' });
  const [error, setError] = useState('');

  async function load() {
    const [u, r, e] = await Promise.all([
      apiFetch<User[]>('/users'),
      apiFetch<Role[]>('/roles'),
      apiFetch<Empresa[]>('/empresas'),
    ]);
    setUsers(u); setRoles(r); setEmpresas(e);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ ...form, roleId: Number(form.roleId), empresaId: Number(form.empresaId) }),
      });
      setForm({ name: '', email: '', password: '', roleId: '', empresaId: '' });
      load();
    } catch {
      setError('Error al crear el usuario');
    }
  }

  async function handleToggle(user: User) {
    await apiFetch(`/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm">
            <option value="">Seleccionar...</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <select value={form.empresaId} onChange={(e) => setForm({ ...form, empresaId: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm">
            <option value="">Seleccionar...</option>
            {empresas.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Crear usuario</button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Rol</th>
              <th className="text-left px-4 py-3 font-medium">Empresa</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">{u.role?.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.empresa?.nombre}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(u)} className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
