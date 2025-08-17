'use server';

/**
 * @fileOverview Validates and corrects errors in voucher sheets and user inputs using AI.
 *
 * - validateVoucherSheet - A function that validates and corrects voucher sheets.
 * - ValidateVoucherSheetInput - The input type for the validateVoucherSheet function.
 * - ValidateVoucherSheetOutput - The return type for the validateVoucherSheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateVoucherSheetInputSchema = z.object({
  voucherSheetData: z.string().describe('The voucher sheet data to validate, as a JSON string.'),
  userInputData: z.string().describe('The user input data to validate, as a JSON string.'),
});

export type ValidateVoucherSheetInput = z.infer<typeof ValidateVoucherSheetInputSchema>;

const ValidateVoucherSheetOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the voucher sheet and user input data are valid.'),
  correctedVoucherSheetData: z.string().describe('The corrected voucher sheet data, as a JSON string.'),
  correctedUserInputData: z.string().describe('The corrected user input data, as a JSON string.'),
  errors: z.array(z.string()).describe('A list of errors found in the voucher sheet and user input data.'),
  suggestions: z.array(z.string()).describe('A list of suggestions for correcting the errors.'),
});

export type ValidateVoucherSheetOutput = z.infer<typeof ValidateVoucherSheetOutputSchema>;

export async function validateVoucherSheet(input: ValidateVoucherSheetInput): Promise<ValidateVoucherSheetOutput> {
  return validateVoucherSheetFlow(input);
}

const validateVoucherSheetPrompt = ai.definePrompt({
  name: 'validateVoucherSheetPrompt',
  input: {schema: ValidateVoucherSheetInputSchema},
  output: {schema: ValidateVoucherSheetOutputSchema},
  prompt: `You are an AI assistant specializing in validating and correcting voucher sheets and user inputs for a data service platform.

You will receive voucher sheet data and user input data as JSON strings. Your task is to identify any errors or inconsistencies in the data, correct them, and provide a report of the validation results.

Here are the validation requirements:
1.  Ensure that all required fields are present in both the voucher sheet and user input data.
2.  Verify that the data types of the fields are correct (e.g., numbers are numbers, strings are strings).
3.  Check for any inconsistencies between the voucher sheet data and user input data.
4.  Identify any potential security vulnerabilities in the data.
5.  Suggest corrections for any errors or inconsistencies found.

Voucher Sheet Data: {{{voucherSheetData}}}
User Input Data: {{{userInputData}}}

Based on the validation requirements, please provide the following output in JSON format:
{
  "isValid": true/false,
  "correctedVoucherSheetData": "corrected voucher sheet data as JSON string",
  "correctedUserInputData": "corrected user input data as JSON string",
  "errors": ["list of errors found"],
  "suggestions": ["list of suggestions for correcting the errors"]
}
`,
});

const validateVoucherSheetFlow = ai.defineFlow(
  {
    name: 'validateVoucherSheetFlow',
    inputSchema: ValidateVoucherSheetInputSchema,
    outputSchema: ValidateVoucherSheetOutputSchema,
  },
  async input => {
    try {
      const {output} = await validateVoucherSheetPrompt(input);
      return output!;
    } catch (e) {
      console.error('Error in validateVoucherSheetFlow:', e);
      return {
        isValid: false,
        correctedVoucherSheetData: '{}',
        correctedUserInputData: '{}',
        errors: [String(e)],
        suggestions: [],
      };
    }
  }
);
