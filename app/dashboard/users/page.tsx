'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User, Role, Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', companyId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ ...form, roleId: Number(form.roleId), companyId: Number(form.companyId) }),
      });
      setForm({ name: '', email: '', password: '', roleId: '', companyId: '' });
      load();
    } catch {
      setError('No se pudo crear el usuario');
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nuevo usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input
                placeholder="Juan Pérez"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                placeholder="correo@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contraseña</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.roleId} onValueChange={(v) => setForm({ ...form, roleId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Empresa</Label>
              <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4 mr-1" />
                {loading ? 'Guardando...' : 'Crear usuario'}
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="capitalize">{u.role?.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.company?.name}</TableCell>
                <TableCell>
                  <button onClick={() => handleToggle(u)}>
                    <Badge variant={u.isActive ? 'success' : 'muted'}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
