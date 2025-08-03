
'use client';

import * as React from 'react';
import { useState, useEffect, useTransition } from 'react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getNumberForService, checkSms, cancelOrder, getServices } from '@/actions/otpActions';
import { SERVICE_ICONS_MAP } from '@/lib/constants';
import { Loader2, Copy, AlertCircle, CheckCircle, Clock, KeyRound, Phone, Ban, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/service';

type OtpStatus = 'idle' | 'requesting' | 'waiting_for_sms' | 'sms_received' | 'error' | 'cancelled';
interface OrderDetails {
  id: number;
  number: string;
  cost: number;
}

const OTP_CHECK_INTERVAL = 5000; // 5 seconds
const OTP_TIMEOUT = 180; // 3 minutes in seconds

export default function OtpPage() {
  const { user, updateCoinsUserContext } = useUser();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState<OtpStatus>('idle');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [smsCode, setSmsCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(OTP_TIMEOUT);

  useEffect(() => {
    async function fetchServices() {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
    }
    fetchServices();
  }, []);
  
  const currentService = services.find(s => s.name === selectedService);

  useEffect(() => {
    if (currentService) {
      setAvailableCountries(currentService.countries);
      setCurrentPrice(currentService.price);
      setSelectedCountry(''); // Reset country selection when service changes
    } else {
      setAvailableCountries([]);
      setCurrentPrice(null);
    }
  }, [selectedService, currentService]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let countdownTimerId: NodeJS.Timeout | null = null;
    
    if (status === 'waiting_for_sms' && orderDetails) {
      setCountdown(OTP_TIMEOUT);
      countdownTimerId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if(countdownTimerId) clearInterval(countdownTimerId);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      intervalId = setInterval(() => {
        const formData = new FormData();
        formData.append('orderId', orderDetails.id.toString());
        
        startTransition(async () => {
          const result = await checkSms(formData);
          if (result.success && result.status === 'RECEIVED' && result.code) {
            setSmsCode(result.code);
            setStatus('sms_received');
          } else if (result.status === 'CANCELED' || result.status === 'TIMEOUT' || result.status === 'BANNED' ) {
            handleOrderFailure(result.status);
          }
        });
      }, OTP_CHECK_INTERVAL);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (countdownTimerId) clearInterval(countdownTimerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orderDetails]);

  const handleTimeout = () => {
    setStatus('error');
    setErrorMessage('OTP request timed out. Please cancel to try and get a refund.');
  };

  const handleOrderFailure = (failureStatus: string) => {
    setStatus('error');
    setErrorMessage(`Order failed with status: ${failureStatus}. Please cancel to try and get a refund.`);
  };

  const resetState = () => {
    setStatus('idle');
    setSelectedService('');
    setSelectedCountry('');
    setOrderDetails(null);
    setSmsCode(null);
    setErrorMessage(null);
    setCountdown(OTP_TIMEOUT);
  };

  const handleGetNumber = () => {
    if (!selectedService || !selectedCountry || !user?.uid) {
      setErrorMessage('Please select a service and country first.');
      setStatus('error');
      return;
    }
    
    setStatus('requesting');
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('service', selectedService);
    formData.append('country', selectedCountry);
    formData.append('uid', user.uid);

    startTransition(async () => {
      const result = await getNumberForService(formData);
      if (result.success && result.order) {
        setOrderDetails(result.order);
        if(result.newCoinBalance !== undefined) {
           updateCoinsUserContext(result.newCoinBalance);
        }
        setStatus('waiting_for_sms');
        toast({ title: "Success", description: "Virtual number acquired successfully!" });
      } else {
        setErrorMessage(result.message || 'An unknown error occurred.');
        setStatus('error');
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleCancelOrder = () => {
    if (!orderDetails || !user?.uid) return;

    setStatus('requesting');
    const formData = new FormData();
    formData.append('orderId', orderDetails.id.toString());
    formData.append('uid', user.uid);
    formData.append('cost', orderDetails.cost.toString());

    startTransition(async () => {
        const result = await cancelOrder(formData);
        if(result.success && result.newCoinBalance !== undefined) {
            updateCoinsUserContext(result.newCoinBalance);
            toast({ title: "Success", description: result.message });
            setStatus('cancelled');
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
            setStatus('error');
            setErrorMessage(result.message);
        }
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Success", description: `${label} copied to clipboard.` });
  };
  
  const ServiceIcon = SERVICE_ICONS_MAP[selectedService] || SERVICE_ICONS_MAP['Default'];

  const renderContent = () => {
    switch(status) {
      case 'idle':
      case 'error':
      case 'cancelled':
        const isError = status === 'error';
        const isCancelled = status === 'cancelled';
        return (
          <div className="w-full max-w-sm mx-auto space-y-4">
            { (isError || isCancelled) && (
              <div className={cn("text-center space-y-4 p-4 rounded-lg border mb-4", isError ? "bg-destructive/10 border-destructive/20" : "bg-muted/50 border-muted/80")}>
                {isError ? <AlertCircle className="h-10 w-10 text-destructive mx-auto" /> : <Ban className="h-10 w-10 text-muted-foreground mx-auto" />}
                <h3 className={cn("text-xl font-headline", isError ? "text-destructive" : "text-muted-foreground")}>
                    {isError ? 'An Error Occurred' : 'Order Cancelled'}
                </h3>
                <p className={cn("text-sm", isError ? "text-destructive/90" : "text-muted-foreground")}>{errorMessage || 'The order has been successfully cancelled.'}</p>
                 { isError && orderDetails && <Button onClick={handleCancelOrder} variant="destructive" disabled={isPending}>Cancel & Try Refund</Button> }
                 { (isCancelled || (isError && !orderDetails)) && <Button onClick={resetState}>Start New Order</Button>}
              </div>
            )}
            <div>
              <Label htmlFor="service-select" className="flex items-center mb-1"><ServiceIcon className="mr-2 h-4 w-4" />Service</Label>
              <Select onValueChange={setSelectedService} value={selectedService}>
                <SelectTrigger id="service-select">
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {services.length > 0 ? services.map(service => (
                    <SelectItem value={service.name} key={service.id}>
                      <div className="flex items-center">
                        <span className="mr-2 h-4 w-4 text-muted-foreground">{React.createElement(SERVICE_ICONS_MAP[service.name] || SERVICE_ICONS_MAP['Default'])}</span>
                        {service.name}
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Loading services...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
                <Label htmlFor="country-select" className="flex items-center mb-1"><Globe className="mr-2 h-4 w-4" />Country</Label>
                 <Select onValueChange={setSelectedCountry} value={selectedCountry} disabled={!selectedService}>
                    <SelectTrigger id="country-select">
                        <SelectValue placeholder="Select a country..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCountries.map(country => (
                            <SelectItem value={country} key={country}>
                                <span className="capitalize">{country}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGetNumber} disabled={!selectedService || !selectedCountry || isPending || !user} className="w-full bg-primary text-primary-foreground">
              <KeyRound className="mr-2 h-4 w-4" /> Get Virtual Number {currentPrice != null && `(Cost: ${currentPrice} Coins)`}
            </Button>
          </div>
        );

      case 'requesting':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-semibold">Processing your request...</p>
            <p className="text-sm">Please wait a moment.</p>
          </div>
        );
      
      case 'waiting_for_sms':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center justify-center"><Phone className="mr-2"/>Your Virtual Number</h3>
            <div className="flex items-center justify-center space-x-2 bg-muted p-3 rounded-md">
              <span className="text-2xl font-mono tracking-wider">{orderDetails?.number}</span>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(orderDetails!.number, 'Virtual Number')}><Copy className="h-5 w-5"/></Button>
            </div>
            <p className="text-sm text-muted-foreground">Use this number on the <span className="font-bold text-primary">{selectedService}</span> website/app to request an OTP.</p>
            <div className="pt-4 space-y-2">
                <h4 className="font-semibold flex items-center justify-center"><Clock className="mr-2 h-5 w-5 text-accent"/>Waiting for SMS...</h4>
                <p className="text-4xl font-mono text-accent">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">We are automatically checking for new messages.</p>
            </div>
            <div className="pt-4">
                <Button onClick={handleCancelOrder} variant="destructive" disabled={isPending}>
                  <Ban className="mr-2 h-4 w-4"/> Cancel Order & Refund Coins
                </Button>
            </div>
          </div>
        );
      
       case 'sms_received':
        return (
          <div className="text-center space-y-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-2xl font-headline text-green-600">OTP Received!</h3>
            <p>Your verification code for <span className="font-bold">{selectedService}</span> is:</p>
            <div className="flex items-center justify-center space-x-2 bg-muted p-3 rounded-md">
              <span className="text-3xl font-mono tracking-widest text-primary">{smsCode}</span>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(smsCode!, 'OTP Code')}><Copy className="h-6 w-6"/></Button>
            </div>
             <p className="text-xs text-muted-foreground">Order for {orderDetails?.number} is now complete.</p>
            <Button onClick={resetState} className="mt-4">Start New Order</Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Get Virtual Number</CardTitle>
          <CardDescription>Acquire a temporary virtual number to receive a one-time password for various online services.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="w-full">
            {renderContent()}
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                Numbers are temporary and for one-time use. Do not use them for creating permanent accounts. Misuse may result in an account ban.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
