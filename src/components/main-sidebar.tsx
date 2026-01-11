'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import {
  LayoutDashboard,
  Siren,
  Phone,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create-alert', label: 'Create Alert', icon: Siren },
  { href: '/emergency-contacts', label: 'Contacts', icon: Phone },
  { href: '/profile', label: 'Profile', icon: User },
];

const adminMenuItem = { href: '/admin', label: 'Admin', icon: Shield };

export function MainSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {user?.role === 'admin' && (
            <SidebarMenuItem>
              <Link href={adminMenuItem.href}>
                <SidebarMenuButton
                  isActive={isActive(adminMenuItem.href)}
                  tooltip={{ children: adminMenuItem.label }}
                >
                  <adminMenuItem.icon />
                  <span>{adminMenuItem.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2 p-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
