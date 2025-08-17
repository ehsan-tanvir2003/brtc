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

export const operatorOptions = ['Grameenphone', 'Robi', 'Airtel', 'Banglalink', 'Teletalk'] as const;
export type OperatorName = (typeof operatorOptions)[number];

export const timeDurationOptions = ['3 months', '6 months'] as const;
export type TimeDuration = (typeof timeDurationOptions)[number];


export interface VoucherData {
  orderId: string;
  service: ServiceName;
  inputValue: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  report: Record<string, any>;
  operator?: OperatorName;
  timeDuration?: TimeDuration;
  paymentTotal?: string;
  deliveryTime?: string;
}

export interface GenerationResult {
  voucherData?: VoucherData;
  error?: string;
  suggestions?: string[];
}
