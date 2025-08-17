import * as React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path
          id="circlePath"
          d="
            M 100, 100
            m -75, 0
            a 75,75 0 1,1 150,0
            a 75,75 0 1,1 -150,0
          "
        />
      </defs>
      <g>
        {/* Green vertical bars */}
        <path
          d="M100 30 V170"
          stroke="#008000"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M85 35 V165"
          stroke="#008000"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M115 35 V165"
          stroke="#008000"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M70 45 V155"
          stroke="#008000"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M130 45 V155"
          stroke="#008000"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M60 55 V145"
          stroke="#008000"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M140 55 V145"
          stroke="#008000"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* BTRC Text */}
        <rect x="65" y="85" width="70" height="30" fill="white" />
        <text
          x="100"
          y="108"
          fill="red"
          fontSize="28"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          BTRC
        </text>

        {/* Circular Text */}
        <text
          fill="red"
          fontSize="18"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          <textPath href="#circlePath" startOffset="5%">
            বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন
          </textPath>
        </text>
      </g>
    </svg>
  );
}
