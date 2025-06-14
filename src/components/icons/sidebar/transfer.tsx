export const MasterListIcon: React.FC<React.SVGAttributes<{}>> = (
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
    <g id="master_list_icon" data-name="master list icon">
      {/* Document shape */}
      <path d="M4 4h16v16H4z" />

      {/* Bullet points */}
      <circle cx="7" cy="8" r="1" />
      <circle cx="7" cy="12" r="1" />
      <circle cx="7" cy="16" r="1" />

      {/* List lines */}
      <line x1="10" y1="8" x2="17" y2="8" />
      <line x1="10" y1="12" x2="17" y2="12" />
      <line x1="10" y1="16" x2="17" y2="16" />
    </g>
  </svg>
);
