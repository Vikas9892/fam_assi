type CompassIconProps = {
  className?: string
}

export function CompassIcon({ className = 'size-5' }: CompassIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polygon points="16,8 14,14 8,16 10,10" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  )
}
