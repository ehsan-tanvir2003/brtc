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
                "Total Calls": 0, // Placeholder
                "Total Duration": `0 minutes`, // Placeholder
                "Last Call": "N/A", // Placeholder
            };
        case "Location Tracking":
            return {
                "Target ID": inputValue,
                "Latitude": "0.000000", // Placeholder
                "Longitude": "0.000000", // Placeholder
                "Last Updated": "N/A", // Placeholder
            };
        default:
            return {
                "Account": inputValue,
                "Balance": `৳0.00`, // Placeholder
                "Status": "Active",
                "Recent Transactions": 0, // Placeholder
            };
    }
}

function generateRandomOrderId(): string {
  const prefix = "IQDATA";
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${randomPart}`;
}

export async function generateVoucher(
  service: ServiceName,
  inputValue: string
): Promise<GenerationResult> {
  const orderId = generateRandomOrderId();
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

    if (!validationResult.isValid || (validationResult.errors && validationResult.errors.length > 0)) {
      console.error("AI Validation Failed:", validationResult.errors);
      const errorMessage = validationResult.errors?.length > 0
        ? `Validation failed: ${validationResult.errors.join(', ')}`
        : "AI validation returned invalid.";
      return {
        error: errorMessage,
        suggestions: validationResult.suggestions,
      };
    }

    // Use corrected data from AI if available, otherwise use original
    const correctedVoucherData = validationResult.correctedVoucherSheetData ? JSON.parse(validationResult.correctedVoucherSheetData) : {};
    const correctedInputData = validationResult.correctedUserInputData ? JSON.parse(validationResult.correctedUserInputData) : {};

    const finalInputValue = correctedInputData.inputValue || inputValue;
    const finalService = correctedInputData.service || service;
    
    // Simulate service execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    const voucherData: VoucherData = {
      orderId: correctedVoucherData.orderId || orderId,
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
