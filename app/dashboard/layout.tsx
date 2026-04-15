'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">Releva</div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700 text-sm">Inicio</Link>
          <Link href="/dashboard/users" className="block px-3 py-2 rounded hover:bg-gray-700 text-sm">Usuarios</Link>
          <Link href="/dashboard/roles" className="block px-3 py-2 rounded hover:bg-gray-700 text-sm">Roles</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">{user.name}</p>
          <p className="text-xs text-gray-500 mb-3">{user.role}</p>
          <button onClick={() => { logout(); router.push('/login'); }} className="text-xs text-red-400 hover:text-red-300">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
