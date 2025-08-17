"use client";

import { useState, useEffect } from "react";
import { ServiceForm } from "@/components/ServiceForm";
import { VoucherSheet } from "@/components/VoucherSheet";
import { Progress } from "@/components/ui/progress";
import { generateVoucher } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { VoucherData, ServiceName, OperatorName, TimeDuration } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NetworkStatusAnimation } from "@/components/NetworkStatusAnimation";

interface FormValues {
  service: ServiceName;
  inputValue: string;
  operator?: OperatorName;
  timeDuration?: TimeDuration;
  paymentTotal?: string;
  deliveryTime?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [error, setError] = useState<{ message: string; suggestions?: string[] } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setProgress(10);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);
  
  const resetState = () => {
    setVoucherData(null);
    setError(null);
    setIsLoading(false);
    setProgress(0);
  };

  const handleGenerate = async (data: FormValues) => {
    setIsLoading(true);
    setVoucherData(null);
    setError(null);
    
    const result = await generateVoucher(
        data.service, 
        data.inputValue, 
        data.operator, 
        data.timeDuration, 
        data.paymentTotal,
        data.deliveryTime
    );

    setProgress(100);

    if (result.error) {
      setError({ message: result.error, suggestions: result.suggestions });
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.voucherData) {
      setVoucherData(result.voucherData);
      toast({
        title: "Success!",
        description: `Voucher ${result.voucherData.orderId} generated successfully.`,
      });
    }
    
    setTimeout(() => {
        setIsLoading(false);
    }, 500);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
       <NetworkStatusAnimation />
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10 flex flex-col items-center">
           <Logo className="h-24 w-24 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-wider">
            BTRC DATA HUB
          </h1>
          <p className="text-muted-foreground mt-2">
            Official Data Service Portal.
          </p>
        </div>

        <div className="bg-card/50 border border-border/50 shadow-2xl rounded-lg p-6 sm:p-8 backdrop-blur-sm min-h-[300px] flex flex-col justify-center">
          { !isLoading && !voucherData && !error && (
            <ServiceForm onSubmit={handleGenerate} isLoading={isLoading} />
          )}

          {isLoading && (
            <div className="text-center space-y-4">
              <p className="text-accent font-semibold animate-pulse">Executing request...</p>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">Order in progress, please wait.</p>
            </div>
          )}
          
          <div className="transition-opacity duration-500 ease-in-out">
            {!isLoading && error && (
              <div className="space-y-4 text-center">
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Operation Failed</AlertTitle>
                      <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                  {error.suggestions && error.suggestions.length > 0 && (
                      <div className="mt-4 text-left">
                          <h4 className="font-semibold mb-2 text-primary">Suggestions:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {error.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                      </div>
                  )}
                  <Button onClick={resetState} variant="outline" className="w-full mt-4">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
              </div>
            )}

            {voucherData && !isLoading && (
              <div className="space-y-6">
                  <VoucherSheet data={voucherData} />
                  <Button onClick={resetState} variant="outline" className="w-full no-print">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Generate Another Voucher
                  </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
