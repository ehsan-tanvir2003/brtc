"use server";

import type { ServiceName, VoucherData, GenerationResult, OperatorName, TimeDuration } from "@/types";

function generateRandomOrderId(): string {
  const prefix = "IQDATA";
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${randomPart}`;
}

export async function generateVoucher(
  service: ServiceName,
  inputValue: string,
  operator?: OperatorName,
  timeDuration?: TimeDuration,
  paymentTotal?: string,
  deliveryTime?: string
): Promise<GenerationResult> {
  try {
    const orderId = generateRandomOrderId();
    const timestamp = new Date().toISOString();

    // Simulate network delay and processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const voucherData: VoucherData = {
      orderId,
      service,
      inputValue,
      timestamp,
      status: "Success",
      report: { "Target Number": inputValue }, // Simplified report
      operator,
      timeDuration,
      paymentTotal,
      deliveryTime,
    };

    return { voucherData };

  } catch (e: any) {
    console.error("Error generating voucher:", e);
    return {
      error: "An unexpected error occurred during voucher generation.",
    };
  }
}
