'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Company } from '@/lib/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: '', taxId: '', plan: 'trial' });
  const [error, setError] = useState('');

  async function load() {
    const data = await apiFetch<Company[]>('/companies');
    setCompanies(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/companies', { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: '', taxId: '', plan: 'trial' });
      load();
    } catch {
      setError('Failed to create company');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this company?')) return;
    await apiFetch(`/companies/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Companies</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tax ID</label>
          <input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="border rounded px-3 py-2 text-sm">
            <option value="trial">Trial</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Create</button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Tax ID</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.taxId || '—'}</td>
                <td className="px-4 py-3 capitalize">{c.plan}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
