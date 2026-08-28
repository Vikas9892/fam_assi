import type { StopCategory } from '../../lib/schema'

type CategoryIconProps = {
  category: StopCategory
  className?: string
}

export function CategoryIcon({ category, className = 'size-4' }: CategoryIconProps) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (category) {
    case 'food':
      return (
        <svg {...props}>
          <path d="M6 3v8a4 4 0 0 0 8 0V3" />
          <path d="M10 3v18" />
          <path d="M6 11h8" />
          <path d="M18 3v12" />
          <path d="M18 15v6" />
        </svg>
      )
    case 'sight':
      return (
        <svg {...props}>
          <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'activity':
      return (
        <svg {...props}>
          <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
          <path d="M5 19l2-2" />
          <path d="M19 19l-2-2" />
        </svg>
      )
    case 'transport':
      return (
        <svg {...props}>
          <rect x="3" y="8" width="18" height="9" rx="2" />
          <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>
      )
    case 'rest':
      return (
        <svg {...props}>
          <path d="M8 3v10" />
          <path d="M6 3v4a2 2 0 0 0 4 0V3" />
          <path d="M14 3v18" />
          <path d="M18 7H14" />
          <path d="M18 11H14" />
        </svg>
      )
  }
}

export const CATEGORY_LABELS: Record<StopCategory, string> = {
  food: 'Food',
  sight: 'Sights',
  activity: 'Activities',
  transport: 'Transport',
  rest: 'Rest',
}
