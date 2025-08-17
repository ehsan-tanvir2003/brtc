"use client";

import { useState, useEffect } from "react";
import { ServiceForm } from "@/components/ServiceForm";
import { VoucherSheet } from "@/components/VoucherSheet";
import { Progress } from "@/components/ui/progress";
import { generateVoucher } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { VoucherData, ServiceName } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormValues {
  service: ServiceName;
  inputValue: string;
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
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 400);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

   useEffect(() => {
    if (voucherData?.report) {
        const newReport = { ...voucherData.report };
        let updated = false;
        switch (voucherData.service) {
            case "CDR (Call Logs)":
                newReport["Total Calls"] = Math.floor(Math.random() * 100) + 50;
                newReport["Total Duration"] = `${Math.floor(Math.random() * 500) + 100} minutes`;
                newReport["Last Call"] = new Date(Date.now() - Math.random() * 1e10).toLocaleDateString();
                updated = true;
                break;
            case "Location Tracking":
                newReport["Latitude"] = (23.8103 + (Math.random() - 0.5) * 0.1).toFixed(6);
                newReport["Longitude"] = (90.4125 + (Math.random() - 0.5) * 0.1).toFixed(6);
                newReport["Last Updated"] = new Date().toISOString();
                updated = true;
                break;
            case "Nagad Info":
            case "Nagad Statement":
            case "Bkash Info":
            case "Bkash Statement":
            case "IMEI to All Numbers":
                newReport["Balance"] = `৳${(Math.random() * 10000).toFixed(2)}`;
                newReport["Recent Transactions"] = Math.floor(Math.random() * 20) + 5;
                updated = true;
                break;
        }

        if(updated) {
            setVoucherData(prev => prev ? ({ ...prev, report: newReport }) : null);
        }
    }
  }, [voucherData?.service, voucherData?.report]);
  
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
    
    const result = await generateVoucher(data.service, data.inputValue);

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
        setProgress(0);
    }, 500);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-wider">
            Phantom Intel Toolkit
          </h1>
          <p className="text-muted-foreground mt-2">
            Your advanced data service portal.
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

            {!isLoading && voucherData && (
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
