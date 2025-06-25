export const SaveMessagingTemplateIcon: React.FC<React.SVGAttributes<{}>> = (
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
    <g id="save_messaging_template_icon" data-name="save messaging template icon">
      {/* Message bubble */}
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />

      {/* Save symbol (floppy disk) inside */}
      <rect x="13" y="7" width="6" height="5" rx="1" />
      <line x1="15" y1="7" x2="15" y2="12" />
    </g>
  </svg>
);
