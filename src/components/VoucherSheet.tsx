"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VoucherData } from "@/types";
import { Download, Timer } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { useState, useEffect } from "react";

interface VoucherSheetProps {
  data: VoucherData;
}

export function VoucherSheet({ data }: VoucherSheetProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayTimestamp, setDisplayTimestamp] = useState("");
  
  useEffect(() => {
    // Format timestamp on client to avoid hydration mismatch
    setDisplayTimestamp(new Date(data.timestamp).toLocaleString());
  }, [data.timestamp]);

  const handleDownloadPdf = async () => {
    const voucherElement = document.getElementById("voucher-to-print");
    if (!voucherElement) return;
  
    setIsDownloading(true);
  
    try {
      const canvas = await html2canvas(voucherElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
            const clonedVoucher = clonedDoc.getElementById('voucher-to-print');
            if(clonedVoucher) {
                clonedVoucher.classList.add('pdf-render');
            }
        }
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const canvasAspectRatio = canvasWidth / canvasHeight;
      
      let renderWidth = pdfWidth - 40;
      let renderHeight = renderWidth / canvasAspectRatio;
  
      if (renderHeight > pdfHeight - 40) {
        renderHeight = pdfHeight - 40;
        renderWidth = renderHeight * canvasAspectRatio;
      }
      
      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;
      
      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`voucher-${data.orderId}.pdf`);
  
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
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
                <p className="font-mono">{displayTimestamp || " "}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Service</p>
                <p>{data.service}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Target</p>
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
