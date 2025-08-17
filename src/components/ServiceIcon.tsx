import { Fingerprint, Smartphone, FileText, MapPin, Hash, WalletCards, LucideProps } from 'lucide-react';
import type { ServiceName } from '@/types';

interface ServiceIconProps extends LucideProps {
  service: ServiceName;
}

export function ServiceIcon({ service, ...props }: ServiceIconProps) {
  switch (service) {
    case 'NID to All Number':
    case 'Mobile Number to NID':
      return <Fingerprint {...props} />;
    case 'IMEI to All Numbers':
      return <Smartphone {...props} />;
    case 'CDR (Call Logs)':
      return <FileText {...props} />;
    case 'Location Tracking':
      return <MapPin {...props} />;
    case 'Nagad Info':
    case 'Nagad Statement':
    case 'Bkash Info':
    case 'Bkash Statement':
      return <WalletCards {...props} />;
    default:
      return <Hash {...props} />;
  }
}
