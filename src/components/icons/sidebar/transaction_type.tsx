export const TransactionIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Arrow pointing right */}
    <path d="M3 7h13l-3.5-3.5M16 7l-3.5 3.5" />
    
    {/* Arrow pointing left */}
    <path d="M21 17H8l3.5 3.5M5 17l3.5-3.5" />
  </svg>
);
