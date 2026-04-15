'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { CreditPackage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';

const emptyForm = { name: '', credits: '', price: '' };

export default function PackagesPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await apiFetch<CreditPackage[]>('/credit-packages');
    setPackages(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/credit-packages', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          credits: Number(form.credits),
          price: Number(form.price),
        }),
      });
      setForm(emptyForm);
      load();
    } catch {
      setError('No se pudo crear el paquete');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit(id: number) {
    try {
      await apiFetch(`/credit-packages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editForm.name,
          credits: Number(editForm.credits),
          price: Number(editForm.price),
        }),
      });
      setEditingId(null);
      load();
    } catch {
      setError('No se pudo actualizar el paquete');
    }
  }

  async function handleToggleActive(pkg: CreditPackage) {
    await apiFetch(`/credit-packages/${pkg.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !pkg.isActive }),
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este paquete?')) return;
    await apiFetch(`/credit-packages/${id}`, { method: 'DELETE' });
    load();
  }

  function startEdit(pkg: CreditPackage) {
    setEditingId(pkg.id);
    setEditForm({ name: pkg.name, credits: String(pkg.credits), price: String(pkg.price) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paquetes de créditos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configura los paquetes que las empresas pueden adquirir
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nuevo paquete</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Nombre del paquete</Label>
              <Input
                placeholder="ej. Paquete Básico"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Créditos incluidos</Label>
              <Input
                type="number"
                min="1"
                placeholder="ej. 10"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Precio (Bs.)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="ej. 300"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-3 flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4 mr-1" />
                {loading ? 'Guardando...' : 'Crear paquete'}
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
              <TableHead>Créditos</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Precio por crédito</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay paquetes registrados
                </TableCell>
              </TableRow>
            )}
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                {editingId === pkg.id ? (
                  <>
                    <TableCell>
                      <Input
                        className="h-8 text-sm"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 text-sm w-20"
                        type="number"
                        min="1"
                        value={editForm.credits}
                        onChange={(e) => setEditForm({ ...editForm, credits: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 text-sm w-24"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleSaveEdit(pkg.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.credits} créditos</TableCell>
                    <TableCell>Bs. {Number(pkg.price).toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      Bs. {(Number(pkg.price) / pkg.credits).toFixed(2)} / crédito
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleActive(pkg)}>
                        <Badge variant={pkg.isActive ? 'success' : 'muted'}>
                          {pkg.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(pkg)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(pkg.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
