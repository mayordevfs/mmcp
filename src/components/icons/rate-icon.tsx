export const RateIcon: React.FC<React.SVGAttributes<{}>> = (
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
    <g id="rate_icon" data-name="rate icon">
      {/* Circle border */}
      <circle cx="12" cy="12" r="10" />
      
      {/* Star in center */}
      <path d="M12 7.5l1.76 3.56 3.94.57-2.85 2.78.67 3.91L12 16.75l-3.52 1.85.67-3.91L6.3 11.63l3.94-.57L12 7.5z" />
    </g>
  </svg>
);
