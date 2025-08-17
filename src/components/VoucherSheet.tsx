"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VoucherData } from "@/types";
import { Download, Timer } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import { useState } from "react";

interface VoucherSheetProps {
  data: VoucherData;
}

export function VoucherSheet({ data }: VoucherSheetProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const displayTimestamp = new Date(data.timestamp).toLocaleString();

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const page_width = pdf.internal.pageSize.getWidth();
    const margin = 40;
    const content_width = page_width - margin * 2;
    let y = 60;

    // --- Header ---
    const logoUrl = "https://btrc.gov.bd/sites/default/files/files/btrc.portal.gov.bd/photogallery/a82db2da_653d_4ea2_82e5_897191bbe41a/2022-02-24-10-49-481544b315bc833f6001cc31eae5d20e.png";
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data === 'string') {
        pdf.addImage(base64data, "PNG", margin, y, 60, 60);

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Voucher Sheet", margin + 70, y + 25);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Order successfully created.", margin + 70, y + 40);

        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("BTRC DATA HUB", page_width - margin, y + 25, { align: "right" });
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text("Official Data Service Portal", page_width - margin, y + 40, { align: "right" });
        
        y += 80;
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, page_width - margin, y);
        y += 20;

        // --- Body ---
        const addField = (label: string, value: string) => {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(label, margin, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(value, page_width / 2, y, { align: "left" });
          y += 20;
        };
        
        addField("Order ID:", data.orderId);
        addField("Timestamp:", displayTimestamp);
        addField("Service:", data.service);
        addField("Target Number:", data.inputValue);
        if(data.operator) addField("Operator:", data.operator);
        if(data.timeDuration) addField("Time Duration:", data.timeDuration);
        if(data.paymentTotal) addField("Payment Total:", `৳${data.paymentTotal}`);
        if(data.deliveryTime) addField("Manual Delivery Time:", data.deliveryTime);
        y += 10;
        pdf.setLineDashPattern([2, 2], 0);
        pdf.line(margin, y, page_width - margin, y);
        pdf.setLineDashPattern([], 0);
        y += 20;

        // --- Service Info ---
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Service Information", margin, y);
        y += 20;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Standard Time:", margin, y);
        pdf.setFont("helvetica", "bold");
        pdf.text("0900 hours to 2200 hours", margin + 80, y);
        y += 50;

        // --- Footer ---
        pdf.setFontSize(8);
        pdf.text(
          "This is a system-generated voucher and does not require a signature.",
          page_width / 2,
          y,
          { align: "center" }
        );
        
        pdf.save(`voucher-${data.orderId}.pdf`);
        setIsDownloading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading logo file:", error);
        setIsDownloading(false);
    }
  };

  return (
    <div>
      <div id="voucher-to-print">
        <Card className="w-full max-w-2xl mx-auto bg-card text-card-foreground shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-4 mb-4">
                     <Logo className="w-16 h-16" />
                     <div>
                       <CardTitle className="font-headline text-accent text-2xl">
                         Voucher Sheet
                       </CardTitle>
                       <CardDescription className="pt-1">Order successfully created.</CardDescription>
                     </div>
                   </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-primary">BTRC DATA HUB</p>
                    <p className="text-xs text-muted-foreground">Official Data Service Portal</p>
                </div>
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
          <CardFooter className="pt-6">
             <p className="text-xs text-muted-foreground text-center w-full">This is a system-generated voucher and does not require a signature.</p>
          </CardFooter>
        </Card>
      </div>
      <div className="no-print">
        <Button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full mt-4">
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
