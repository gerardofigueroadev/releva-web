'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User, Role, Company } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', companyId: '' });
  const [error, setError] = useState('');

  async function load() {
    const [u, r, c] = await Promise.all([
      apiFetch<User[]>('/users'),
      apiFetch<Role[]>('/roles'),
      apiFetch<Company[]>('/companies'),
    ]);
    setUsers(u); setRoles(r); setCompanies(c);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ ...form, roleId: Number(form.roleId), companyId: Number(form.companyId) }),
      });
      setForm({ name: '', email: '', password: '', roleId: '', companyId: '' });
      load();
    } catch {
      setError('Failed to create user');
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
    if (!confirm('Delete this user?')) return;
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm">
            <option value="">Select...</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Company</label>
          <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required className="w-full border rounded px-3 py-2 text-sm">
            <option value="">Select...</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Create user</button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Company</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">{u.role?.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.company?.name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(u)} className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
