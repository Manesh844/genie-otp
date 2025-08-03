
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { ApiConfig } from '@/types/admin';
import { Edit, Trash2, Loader2, Server } from 'lucide-react';
import { getApiConfigs, addApiConfig } from '@/actions/adminConfigActions';

export default function AdminApiPage() {
  const { toast } = useToast();
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [apiName, setApiName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const fetchApis = async () => {
      setIsLoading(true);
      const fetchedApis = await getApiConfigs();
      setApis(fetchedApis);
      setIsLoading(false);
  }

  useEffect(() => {
    fetchApis();
  }, []);

  const handleAddApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiName || !apiUrl || !apiKey) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    
    startTransition(async () => {
        const formData = new FormData();
        formData.append('name', apiName);
        formData.append('url', apiUrl);
        formData.append('apiKey', apiKey);

        const result = await addApiConfig(formData);

        if (result.success) {
            toast({ title: "Success", description: "API added successfully." });
            // Reset form and refetch
            setApiName('');
            setApiUrl('');
            setApiKey('');
            await fetchApis();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Management</CardTitle>
          <CardDescription>
            Configure the third-party APIs used for providing virtual numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Name</TableHead>
                <TableHead>API URL</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                </TableRow>
              ) : apis.length > 0 ? (
                apis.map((api) => (
                    <TableRow key={api.id}>
                    <TableCell className="font-medium">{api.name}</TableCell>
                    <TableCell>{api.url}</TableCell>
                    <TableCell className="font-mono text-xs">{api.apiKey.substring(0, 4)}...{api.apiKey.slice(-4)}</TableCell>
                    <TableCell className="text-center">
                        <Button variant="ghost" size="icon" title="Edit API (Not Implemented)">
                            <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete API (Not Implemented)">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No APIs configured yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="add-api">
          <AccordionTrigger asChild>
             <Button><Server className="mr-2 h-4 w-4"/>Add a new API</Button>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>New API Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddApi} className="space-y-4">
                  <div>
                    <Label htmlFor="apiName">API Name</Label>
                    <Input id="apiName" value={apiName} onChange={(e) => setApiName(e.target.value)} placeholder="e.g., 5sim.net" disabled={isPending} />
                  </div>
                  <div>
                    <Label htmlFor="apiUrl">API URL</Label>
                    <Input id="apiUrl" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="e.g., http://api1.5sim.net/v1" disabled={isPending} />
                  </div>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter the secret API key" disabled={isPending} />
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Save API
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
