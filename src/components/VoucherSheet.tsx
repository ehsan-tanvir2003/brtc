"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VoucherData } from "@/types";
import { FileText, Clock, Timer } from "lucide-react";
import { ServiceIcon } from "./ServiceIcon";

interface VoucherSheetProps {
  data: VoucherData;
}

export function VoucherSheet({ data }: VoucherSheetProps) {
  const displayTimestamp = new Date(data.timestamp).toLocaleString();

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
                <CardDescription className="pt-2">Order successfully created.</CardDescription>
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
              <p className="font-mono">{displayTimestamp}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Service</p>
              <p>{data.service}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Target Number</p>
              <p className="font-mono break-all">{data.inputValue}</p>
            </div>
            {data.operator && (
              <div className="space-y-1">
                <p className="text-muted-foreground">Operator</p>
                <p>{data.operator}</p>
              </div>
            )}
            {data.timeDuration && (
              <div className="space-y-1">
                <p className="text-muted-foreground">Time Duration</p>
                <p>{data.timeDuration}</p>
              </div>
            )}
            {data.paymentTotal && (
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Payment Total</p>
                    <p className="font-mono">৳{data.paymentTotal}</p>
                 </div>
            )}
            {data.deliveryTime && (
                <div className="space-y-1">
                    <p className="text-muted-foreground">Manual Delivery Time</p>
                    <p>{data.deliveryTime}</p>
                </div>
            )}
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Service Information</h3>
             <ul className="space-y-2 font-mono text-sm">
                <li className="flex justify-between border-b border-dashed border-border/50 pb-2">
                    <span className="capitalize text-muted-foreground flex items-center gap-2"><Timer/>Standard Time:</span>
                    <span className="text-accent">0900 hours to 2200 hours</span>
                </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="no-print pt-6">
        </CardFooter>
      </Card>
    </div>
  );
}
