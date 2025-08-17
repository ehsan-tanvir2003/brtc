
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VoucherData } from "@/types";
import { FileText } from "lucide-react";
import { ServiceIcon } from "./ServiceIcon";

interface VoucherSheetProps {
  data: VoucherData;
}

// Helper to format values safely on the client
const formatClientValue = (key: string, value: any) => {
    if (value === null || typeof value === 'undefined') return 'N/A';
    try {
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('timestamp') || key.toLowerCase().includes('updated') || key.toLowerCase().includes('call')) {
             const date = new Date(value);
             // Check if date is valid before formatting
             return isNaN(date.getTime()) ? String(value) : date.toLocaleString();
        }
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        if (Array.isArray(value)) {
            return value.join(', ');
        }
    } catch (e) {
        // Fallback for any formatting error
        return String(value);
    }
    return String(value);
};


const renderReport = (report: Record<string, any>, isClient: boolean) => {
  return (
    <ul className="space-y-2 font-mono text-sm">
      {Object.entries(report).map(([key, value]) => {
        const displayValue = isClient ? formatClientValue(key, value) : String(value);

        return (
          <li key={key} className="flex flex-wrap justify-between border-b border-dashed border-border/50 pb-2">
            <span className="capitalize text-muted-foreground mr-2">{key.replace(/_/g, " ")}:</span>
            <span className="text-accent text-right break-all">{displayValue}</span>
          </li>
        );
      })}
    </ul>
  );
};

export function VoucherSheet({ data }: VoucherSheetProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formattedTimestamp = isClient ? new Date(data.timestamp).toLocaleString() : data.timestamp;

  return (
    <div id="voucher-to-print" className="voucher-print-area">
      <Card className="w-full max-w-2xl mx-auto bg-transparent border-none shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-accent flex items-center gap-2">
                    <FileText />
                    Voucher Sheet
                </CardTitle>
                <CardDescription className="pt-2">Order successfully completed.</CardDescription>
              </div>
              <ServiceIcon service={data.service} className="w-10 h-10 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-mono text-primary">{data.orderId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Timestamp</p>
              <p className="font-mono">{formattedTimestamp}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Service</p>
              <p>{data.service}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Input Value</p>
              <p className="font-mono break-all">{data.inputValue}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Success Report</h3>
            {renderReport(data.report, isClient)}
          </div>
        </CardContent>
        <CardFooter className="no-print pt-6">
        </CardFooter>
      </Card>
    </div>
  );
}
