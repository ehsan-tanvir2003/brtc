"use client";

import { Server, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const UplinkIndicator = () => (
  <div className="flex items-center gap-1">
    <ArrowUp className="h-3 w-3 text-green-400 animate-pulse" />
    <span className="text-xs font-mono text-green-400">UPLINK</span>
  </div>
);

const DownlinkIndicator = () => (
  <div className="flex items-center gap-1">
    <ArrowDown className="h-3 w-3 text-blue-400 animate-pulse" />
    <span className="text-xs font-mono text-blue-400">DOWNLINK</span>
  </div>
);

const AnimatedBar = ({ className }: { className?: string }) => (
  <div className={cn("w-1 h-3 bg-primary/50", className)} />
);

export function NetworkStatusAnimation() {
  return (
    <>
      {/* Top-left animation */}
      <div className="fixed top-4 left-4 flex flex-col items-start gap-2 p-2 rounded-lg bg-card/50 border border-border/30 backdrop-blur-sm z-50 pointer-events-none">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <p className="text-xs font-mono font-bold text-primary">BTRC-SRV-01</p>
        </div>
        <div className="w-full h-px bg-border/50" />
        <UplinkIndicator />
        <DownlinkIndicator />
        <div className="flex items-center gap-2 mt-1">
          <div className="w-32 h-2 bg-input rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[75%] animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* Top-right animation */}
      <div className="fixed top-4 right-4 flex flex-col items-end gap-2 p-2 rounded-lg bg-card/50 border border-border/30 backdrop-blur-sm z-50 pointer-events-none">
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono font-bold text-accent">SECURE-256-AES</p>
          <ShieldCheck className="h-4 w-4 text-accent" />
        </div>
        <div className="w-full h-px bg-border/50" />
        <div className="flex items-end gap-0.5 h-6">
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0s]" />
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0.1s]" />
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0.2s]" />
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0.3s]" />
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0.4s]" />
          <AnimatedBar className="animate-[bar-wave_1s_ease-in-out_infinite_0.5s]" />
        </div>
         <p className="text-xs font-mono text-muted-foreground">RTT: 12ms</p>
      </div>
    </>
  );
}
