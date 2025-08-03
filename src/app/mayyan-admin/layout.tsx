
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Logo from '@/components/common/Logo';
import {
  Users,
  History,
  Settings,
  LayoutDashboard,
  LogOut,
  KeyRound,
  Globe,
  PlusCircle,
  Server,
} from 'lucide-react';

const AdminNavContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    // On the client-side, check if the user is authenticated.
    // This is a simple check; a real app would verify a secure token with the server.
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.replace('/mayyan-admin');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/mayyan-admin');
  };

  const menuItems = [
    { href: '/mayyan-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/mayyan-admin/users', label: 'Users', icon: Users },
    { href: '/mayyan-admin/history', label: 'Transaction History', icon: History },
    { href: '/mayyan-admin/api', label: 'API Management', icon: Server },
    { href: '/mayyan-admin/country', label: 'Country Management', icon: Globe },
    { href: '/mayyan-admin/social-media', label: 'Service Management', icon: PlusCircle },
    { href: '/mayyan-admin/settings', label: 'Admin Settings', icon: Settings },
  ];
  
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r shadow-lg">
          <SidebarHeader className="p-4 flex flex-col items-center">
             <div className="group-data-[collapsible=icon]:hidden">
                <Logo />
             </div>
             <div className="group-data-[collapsible=icon]:block hidden mt-2">
                <KeyRound className="h-7 w-7 text-primary" />
             </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, side: 'right' }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
                <SidebarMenuItem>
                     <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Logout', side: 'right' }}>
                        <LogOut className="h-5 w-5 text-destructive" />
                        <span className="group-data-[collapsible=icon]:hidden text-destructive">Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto">
            <div className="p-2 md:p-1 sticky top-0 bg-background/80 backdrop-blur-sm z-10 md:hidden border-b mb-2">
                 <SidebarTrigger />
            </div>
            <div className="p-4 md:p-8">
             {children}
            </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();

    // The login page has its own layout, so we don't wrap it in the admin nav.
    if (pathname === '/mayyan-admin') {
        return <>{children}</>;
    }

    return (
        <AdminNavContent>{children}</AdminNavContent>
    );
}
