export const MonitoringIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
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
    {/* Monitor Frame */}
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    
    {/* Heartbeat waveform line */}
    <polyline points="4 10 7 10 8 7 10 13 12 10 14 12 16 8 17 10 20 10" />

    {/* Monitor stand */}
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
