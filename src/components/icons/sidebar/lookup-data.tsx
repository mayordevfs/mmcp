export const LookupDataIcon: React.FC<React.SVGAttributes<{}>> = (
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
    <g id="lookup_data_icon" data-name="lookup data icon">
      {/* Table/Grid representation */}
      <rect x="3" y="3" width="10" height="10" rx="1" />
      <line x1="3" y1="7" x2="13" y2="7" />
      <line x1="3" y1="11" x2="13" y2="11" />
      <line x1="7" y1="3" x2="7" y2="13" />

      {/* Lookup/Magnifying glass */}
      <circle cx="17" cy="17" r="3" />
      <line x1="19.2" y1="19.2" x2="21" y2="21" />
    </g>
  </svg>
);
