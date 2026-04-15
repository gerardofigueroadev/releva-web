'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Coins } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: '', taxId: '', plan: 'trial' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditsTarget, setCreditsTarget] = useState<number | null>(null);
  const [creditsAmount, setCreditsAmount] = useState('');

  async function load() {
    const data = await apiFetch<Company[]>('/companies');
    setCompanies(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/companies', { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: '', taxId: '', plan: 'trial' });
      load();
    } catch {
      setError('No se pudo crear la empresa');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta empresa?')) return;
    await apiFetch(`/companies/${id}`, { method: 'DELETE' });
    load();
  }

  async function handleAddCredits(id: number) {
    const amount = Number(creditsAmount);
    if (!amount || amount < 1) return;
    await apiFetch(`/companies/${id}/credits`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    setCreditsTarget(null);
    setCreditsAmount('');
    load();
  }

  const planLabel: Record<string, string> = { trial: 'Trial', basic: 'Básico', pro: 'Pro' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Empresas</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nueva empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                placeholder="Razón social"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>NIT / CI</Label>
              <Input
                placeholder="Número de identificación"
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Plan</Label>
              <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-3 flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4 mr-1" />
                {loading ? 'Guardando...' : 'Crear empresa'}
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
              <TableHead>NIT / CI</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Créditos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay empresas registradas
                </TableCell>
              </TableRow>
            )}
            {companies.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.taxId || '—'}</TableCell>
                <TableCell>{planLabel[c.plan] ?? c.plan}</TableCell>
                <TableCell>
                  {creditsTarget === c.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder="cantidad"
                        className="h-8 w-24 text-sm"
                        value={creditsAmount}
                        onChange={(e) => setCreditsAmount(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" className="h-8 text-xs" onClick={() => handleAddCredits(c.id)}>
                        Agregar
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setCreditsTarget(null); setCreditsAmount(''); }}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCreditsTarget(c.id)}
                      className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <Coins className="h-3.5 w-3.5 text-amber-500" />
                      {c.credits ?? 0}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={c.isActive ? 'success' : 'muted'}>
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive">
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
