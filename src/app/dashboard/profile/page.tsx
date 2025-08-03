
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, UserCircle2, Mail, KeyRound, Save, Phone } from 'lucide-react';
import { useUser } from '@/context/UserContext';

async function updateUserProfileServerAction(userId: string, data: { currentPassword?: string, newPassword?: string }) {
  console.log("Updating profile (mocked server action) for user:", userId, "Data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (data.newPassword && (!data.currentPassword || data.currentPassword !== "password123")) {
     return { success: false, message: "Incorrect current password." };
  }
  return { success: true, message: "Password updated successfully (mocked)." };
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number }) => (
  <div className="flex items-start space-x-3 py-2">
    <Icon className="h-5 w-5 text-muted-foreground mt-1" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsUpdatingPassword(true);
    
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
        setIsUpdatingPassword(false);
        return;
      }
      if (!currentPassword) {
        toast({ title: 'Error', description: 'Current password is required to set a new password.', variant: 'destructive' });
        setIsUpdatingPassword(false);
        return;
      }
    } else {
        toast({ title: 'Info', description: 'No new password entered.'});
        setIsUpdatingPassword(false);
        return;
    }

    const result = await updateUserProfileServerAction(user.email, { currentPassword, newPassword });
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
    setIsUpdatingPassword(false);
  };
  
  if (isUserLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!user) {
     return <p className="text-center text-destructive">Could not load profile data. Please log in again.</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <UserCircle2 className="mr-3 h-8 w-8" /> Profile Management
          </CardTitle>
          <CardDescription>View your account details and manage your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-xl">Account Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem icon={Mail} label="Email Address" value={user?.email} />
                    <DetailItem icon={Phone} label="Phone Number" value={user?.phoneNumber} />
                </CardContent>
            </Card>
            
            <Card className="p-4 bg-background border-primary/20">
                <CardTitle className="text-lg mb-4 font-headline flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/>Change Password</CardTitle>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                        id="currentPassword" 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="Enter your current password" 
                        disabled={isUpdatingPassword}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Enter new password (min. 8 characters)" 
                        disabled={isUpdatingPassword}
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                        <Input 
                        id="confirmNewPassword" 
                        type="password" 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        placeholder="Confirm new password" 
                        disabled={isUpdatingPassword}
                        />
                    </div>
                     <Button type="submit" disabled={isUpdatingPassword} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                        {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" />Update Password</>}
                    </Button>
                </form>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
