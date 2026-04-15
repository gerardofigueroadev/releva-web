'use client';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bienvenido, {user?.name}</h1>
      <p className="text-gray-500">Rol: {user?.role}</p>
    </div>
  );
}
