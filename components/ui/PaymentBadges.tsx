// Card-scheme + processor logos required for NETOPIA Payments acceptance.
// Rendered on a white chip because the brand marks are designed for light
// backgrounds, so the band looks identical on both the dark and light theme.

function VisaMark() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" role="img" aria-label="Visa">
      <text
        x="30"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="19"
        letterSpacing="1"
        fill="#1434CB"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="2 0.5 34 23" className="h-6 w-auto" role="img" aria-label="Mastercard">
      <circle cx="15" cy="12" r="11" fill="#EB001B" />
      <circle cx="23" cy="12" r="11" fill="#F79E1B" />
      <path d="M19 1.75A11 11 0 0 1 19 22.25A11 11 0 0 1 19 1.75Z" fill="#FF5F00" />
    </svg>
  );
}

/** White chip with the accepted-card and processor logos. */
export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3.5 rounded-md bg-white px-4 py-2.5 shadow-sm ${className}`}
    >
      <VisaMark />
      <span className="h-6 w-px bg-black/10" aria-hidden="true" />
      <MastercardMark />
      <span className="h-6 w-px bg-black/10" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/legal/netopia.svg" alt="NETOPIA Payments" className="h-5 w-auto" />
    </div>
  );
}
