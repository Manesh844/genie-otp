'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/context/UserContext';
import CoinIcon from '@/components/common/CoinIcon';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface AccountStat {
  metric: string;
  value: string | number;
  unit?: string;
  action?: React.ReactNode;
}

export default function DashboardOverviewPage() {
  const { user, isUserLoading } = useUser();

  const numbersPurchasedToday = 0;
  const rechargeLifetime = 0;
  const numbersPurchasedLifetime = 0;
  const referralBalance = 0;

  const accountStats: AccountStat[] = [
    { metric: "Available Balance", value: user?.coins ?? 0, unit: "coins" },
    { metric: "Numbers Purchased (Session)", value: numbersPurchasedToday },
    { metric: "Recharge (Lifetime)", value: rechargeLifetime, unit: "coins" },
    { metric: "Numbers Purchased (Lifetime)", value: numbersPurchasedLifetime },
    { metric: "Referral Balance", value: referralBalance, unit: "coins" },
    {
      metric: "Need a Virtual Number?",
      value: "",
      action: (
        <Button size="sm" className="bg-primary hover:bg-primary/80 text-primary-foreground">
          <Link href="/dashboard/otp">Get Number</Link>
        </Button>
      )
    },
  ];

  if (isUserLoading && !user) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg bg-card/50">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Account Overview</CardTitle>
          {user && <CardDescription>Welcome back, {user.firstName || user.email}!</CardDescription>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountStats.map((stat) => (
                <TableRow key={stat.metric}>
                  <TableCell className="font-medium text-muted-foreground">{stat.metric}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">
                    {stat.action ? stat.action : (
                      <>
                        {stat.metric === "Available Balance" ? <CoinIcon className="h-4 w-4 inline-block mr-1 mb-0.5" /> : null}
                        {stat.value} {stat.unit && <span className="text-xs text-muted-foreground ml-1">{stat.unit}</span>}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle className="text-xl font-headline">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline">
                <Link href="/dashboard/otp">Get Virtual Number</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/dashboard/recharge">Recharge Coins</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/dashboard/transactions">View Transactions</Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/dashboard/profile">Manage Profile</Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/referral">Referral Program</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
