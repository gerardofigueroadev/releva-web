'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, Building2, Users, ShieldCheck, LogOut, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/companies', label: 'Empresas', icon: Building2 },
  { href: '/dashboard/users', label: 'Usuarios', icon: Users },
  { href: '/dashboard/roles', label: 'Roles', icon: ShieldCheck },
  { href: '/dashboard/packages', label: 'Paquetes', icon: Coins },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white',
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <span className="text-lg font-bold text-white">Releva</span>
      </div>
      <NavLinks />
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-gray-300 font-medium truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 mb-3 capitalize">{user?.role}</p>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  function handleSignOut() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex w-56 flex-col bg-gray-900 fixed inset-y-0 left-0 z-30">
        <SidebarContent onSignOut={handleSignOut} />
      </aside>

      {/* Sidebar móvil */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-40 bg-gray-900 text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SidebarContent onSignOut={() => { setOpen(false); handleSignOut(); }} />
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <main className="flex-1 md:ml-56 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
