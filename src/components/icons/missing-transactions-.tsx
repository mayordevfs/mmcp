export const MissingTransactionsIcon: React.FC<React.SVGAttributes<{}>> = (
  props
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <g id="missing_transactions_icon" data-name="missing transactions icon">
      {/* Document */}
      <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <polyline points="16 4 16 8 20 8" />

      {/* Dashed lines (representing missing entries) */}
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="12" y1="12" x2="14" y2="12" />

      {/* Question mark */}
      <path d="M12 16a1.5 1.5 0 1 0-1.5-1.5" />
      <circle cx="12" cy="18.5" r="0.5" fill="currentColor" />
    </g>
  </svg>
);
