
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Coins, ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Transaction History</CardTitle>
        <CardDescription>View your coin credits, debits, and OTP usage history.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No transactions yet. This feature is being updated.</p>
        )}
      </CardContent>
    </Card>
  );
}
