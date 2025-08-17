export const serviceOptions = [
  'NID to All Number',
  'Mobile Number to NID',
  'CDR (Call Logs)',
  'Location Tracking',
  'IMEI to All Numbers',
  'Nagad Info',
  'Nagad Statement',
  'Bkash Info',
  'Bkash Statement',
] as const;

export type ServiceName = (typeof serviceOptions)[number];

export interface VoucherData {
  orderId: string;
  service: ServiceName;
  inputValue: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  report: Record<string, any>;
}

export interface GenerationResult {
  voucherData?: VoucherData;
  error?: string;
  suggestions?: string[];
}
