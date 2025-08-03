
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import CoinIcon from '@/components/common/CoinIcon';
import {
  Coins,
  History,
  Gift,
  UserCircle2,
  LogOut,
  Settings,
  Music2,
  Send,
  HelpCircle,
  LayoutDashboard,
  User as UserIcon,
  UserRound,
  FileText,
  Shield,
  KeyRound,
  RefreshCcw,
} from 'lucide-react';
import { UserProvider, useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { refreshUserCoins } from '@/actions/authActions';
import { useRouter } from 'next/navigation';

const DashboardNavContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, isUserLoading, logoutUserContext, updateCoinsUserContext } = useUser();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    logoutUserContext();
    // The UserContext will handle the state change, and the effect above will redirect.
  };

  const handleRefreshCoins = async () => {
    if (!user?.uid) return;

    setIsRefreshing(true);
    try {
      const result = await refreshUserCoins(user.uid);
      if (result.success && result.newCoinBalance !== undefined) {
        updateCoinsUserContext(result.newCoinBalance);
        toast({ title: 'Success', description: `Your coin balance has been refreshed to ${result.newCoinBalance} coins.` });
      } else {
         toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      console.error("Failed to refresh coins:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
      toast({ title: 'Error', description: `Failed to refresh coins: ${errorMessage}`, variant: 'destructive' });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Settings className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/otp', label: 'Virtual Number', icon: KeyRound },
    { href: '/dashboard/recharge', label: 'Recharge Coins', icon: Coins },
    { href: '/dashboard/transactions', label: 'Transactions', icon: History },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCircle2 },
    { href: '/referral', label: 'Referral Program', icon: Gift },
    {
      href: 'https://www.tiktok.com/@uknumberin150rs1?is_from_webapp=1&sender_device=pc',
      label: 'Join TikTok',
      icon: Music2,
      external: true
    },
    {
      href: 'https://t.me/genieOTP',
      label: 'Join Telegram',
      icon: Send,
      external: true
    },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/terms', label: 'Terms of Service', icon: FileText },
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  ];
  
  const GenderAvatar = () => {
    if (user?.gender === 'male') {
      return <UserIcon className="h-8 w-8 text-primary" />;
    } else if (user?.gender === 'female') {
      return <UserRound className="h-8 w-8 text-pink-500" />;
    }
    return <UserCircle2 className="h-8 w-8 text-muted-foreground" />;
  };


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r shadow-lg">
          <SidebarHeader className="p-4 flex flex-col items-center">
             <div className="group-data-[collapsible=icon]:hidden">
                <Logo />
             </div>
             <div className="group-data-[collapsible=icon]:block hidden mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="2" width="18" height="20" rx="2" ry="2" /><path d="M7 2v5l3-3" /><line x1="7" y1="17" x2="17" y2="17" /><line x1="7" y1="13" x2="17" y2="13" /><line x1="7" y1="9" x2="12" y2="9" /></svg>
             </div>
            <div className="mt-4 text-sm text-center group-data-[collapsible=icon]:hidden">
              <Link href="/dashboard/profile" className="flex flex-col items-center group">
                <GenderAvatar />
                <p className="font-semibold mt-1 group-hover:text-primary">{user.firstName || user.email}</p>
              </Link>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <div className="flex items-center space-x-1">
                    <CoinIcon size={16} />
                    <span>{user.coins} Coins</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRefreshCoins} disabled={isRefreshing} className="h-6 w-6">
                    <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {menuItems.map((item) => {
                let currentItemIsActive = pathname === item.href;
                 // Specifically ensure '/dashboard' is only active when exactly '/dashboard'
                if (item.href === '/dashboard') {
                    currentItemIsActive = pathname === '/dashboard';
                } else if (item.href.startsWith('/dashboard/') && pathname.startsWith(item.href)) {
                     // For dashboard sub-routes like /dashboard/otp
                    currentItemIsActive = true;
                } else {
                    currentItemIsActive = pathname === item.href;
                }
                
                return (
                  <SidebarMenuItem key={item.href}>
                    {item.external ? (
                      <SidebarMenuButton tooltip={{ children: item.label, side: 'right' }}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                          <item.icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden ml-2">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <Link href={item.href}>
                        <SidebarMenuButton
                          isActive={currentItemIsActive}
                          tooltip={{ children: item.label, side: 'right' }}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </SidebarMenuItem>
                );
              })}
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardNavContent>{children}</DashboardNavContent>
    </UserProvider>
  );
}
