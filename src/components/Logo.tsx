import * as React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://btrc.gov.bd/sites/default/files/files/btrc.portal.gov.bd/photogallery/a82db2da_653d_4ea2_82e5_897191bbe41a/2022-02-24-10-49-481544b315bc833f6001cc31eae5d20e.png"
      alt="BTRC Logo"
      className={className}
      width={200}
      height={200}
      priority
    />
  );
}
