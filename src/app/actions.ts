"use server";

import { validateVoucherSheet } from "@/ai/flows/validate-voucher-sheet";
import type { ServiceName, VoucherData, GenerationResult } from "@/types";

function generateDummyReport(service: ServiceName, inputValue: string): Record<string, any> {
    switch (service) {
        case "NID to All Number":
            return {
                "Target NID": inputValue,
                "Linked Numbers": ["+88017********1", "+88018********2", "+88019********3"],
                "Owner Name": "John Doe",
            };
        case "Mobile Number to NID":
            return {
                "Target Number": inputValue,
                "NID Number": "1990123456789",
                "Owner Name": "Jane Smith",
                "Address": "123 Main St, Dhaka",
            };
        case "CDR (Call Logs)":
             return {
                "Target Number": inputValue,
                "Total Calls": Math.floor(Math.random() * 100) + 50,
                "Total Duration": `${Math.floor(Math.random() * 500) + 100} minutes`,
                "Last Call": new Date(Date.now() - Math.random() * 1e10).toLocaleDateString(),
            };
        case "Location Tracking":
            return {
                "Target ID": inputValue,
                "Latitude": (23.8103 + (Math.random() - 0.5) * 0.1).toFixed(6),
                "Longitude": (90.4125 + (Math.random() - 0.5) * 0.1).toFixed(6),
                "Last Updated": new Date().toISOString(),
            };
        default:
            return {
                "Account": inputValue,
                "Balance": `৳${(Math.random() * 10000).toFixed(2)}`,
                "Status": "Active",
                "Recent Transactions": Math.floor(Math.random() * 20) + 5,
            };
    }
}

export async function generateVoucher(
  service: ServiceName,
  inputValue: string
): Promise<GenerationResult> {
  const orderId = `IQDATA3421${Date.now()}`;
  const timestamp = new Date().toISOString();

  const preliminaryVoucher = {
    orderId,
    service,
    input: inputValue,
    status: 'pending',
    timestamp,
  };

  const userInput = {
    service,
    inputValue,
  };

  try {
    const validationResult = await validateVoucherSheet({
      voucherSheetData: JSON.stringify(preliminaryVoucher),
      userInputData: JSON.stringify(userInput),
    });

    if (!validationResult.isValid || validationResult.errors.length > 0) {
      console.error("AI Validation Failed:", validationResult.errors);
      return {
        error: `Validation failed: ${validationResult.errors.join(', ')}`,
        suggestions: validationResult.suggestions,
      };
    }

    // Use corrected data from AI if available
    const correctedInput = JSON.parse(validationResult.correctedUserInputData);
    const finalInputValue = correctedInput.inputValue || inputValue;
    const finalService = correctedInput.service || service;
    
    // Simulate service execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    const voucherData: VoucherData = {
      orderId,
      service: finalService,
      inputValue: finalInputValue,
      timestamp,
      status: "Success",
      report: generateDummyReport(finalService, finalInputValue),
    };

    return { voucherData };

  } catch (e: any) {
    console.error("Error generating voucher:", e);
    return {
      error: "An unexpected error occurred during voucher generation.",
    };
  }
}
