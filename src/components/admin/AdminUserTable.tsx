
'use client';

import { useState, useTransition } from 'react';
import type { UserProfile } from '@/types/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Edit, Loader2 } from 'lucide-react';
import { updateUserCoins } from '@/actions/adminUserActions';

type CoinAction = 'add' | 'subtract';

export function AdminUserTable({ users }: { users: UserProfile[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [coinAction, setCoinAction] = useState<CoinAction>('add');
  const [coinAmount, setCoinAmount] = useState<number>(0);

  const openCoinDialog = (user: UserProfile, action: CoinAction) => {
    setSelectedUser(user);
    setCoinAction(action);
    setCoinAmount(0);
    setIsDialogOpen(true);
  };
  
  const handleEditUser = (userId: string) => alert(`Editing user ${userId} is not yet implemented.`);

  const handleCoinActionSubmit = () => {
    if (!selectedUser || coinAmount === 0 || isNaN(coinAmount)) {
        toast({ title: 'Invalid Amount', description: 'Please enter a valid, non-zero amount.', variant: 'destructive' });
        return;
    }
    
    const amountToApply = coinAction === 'add' ? coinAmount : -coinAmount;

    startTransition(async () => {
        const result = await updateUserCoins(selectedUser.uid, amountToApply);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setIsDialogOpen(false);
            // This is where you would typically re-fetch or update the state
            // For now, Next.js with revalidatePath will handle the refresh.
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{coinAction === 'add' ? 'Add' : 'Subtract'} Coins for {selectedUser?.firstName || selectedUser?.email}</DialogTitle>
            <DialogDescription>
              Enter the amount of coins to {coinAction}. Current balance: {selectedUser?.coins} coins.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="coin-amount">Amount</Label>
            <Input
              id="coin-amount"
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(Number(e.target.value))}
              placeholder="e.g., 100"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCoinActionSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {coinAction === 'add' ? 'Addition' : 'Subtraction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Coins</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/40?u=${user.uid}`} alt="Avatar" />
                    <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-muted-foreground text-sm">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell className="text-center">
                <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">{user.coins}</TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openCoinDialog(user, 'add')} title="Add Coins">
                    <PlusCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openCoinDialog(user, 'subtract')} title="Subtract Coins">
                    <MinusCircle className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.uid)} title="Edit User">
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
            No users have signed up yet.
        </div>
      )}
    </>
  );
}
