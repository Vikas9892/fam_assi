import { CategoryIcon } from './icons/CategoryIcon'
import { CompassIcon } from './icons/CompassIcon'
import type { VisualTheme } from '../lib/images'
import type { StopCategory } from '../lib/schema'

type VisualPlaceholderProps = {
  theme: VisualTheme
  label: string
  category?: StopCategory
  size?: 'hero' | 'stop'
}

export function VisualPlaceholder({
  theme,
  label,
  category,
  size = 'stop',
}: VisualPlaceholderProps) {
  const isHero = size === 'hero'

  return (
    <div
      aria-hidden="true"
      className={`visual-placeholder relative overflow-hidden bg-gradient-to-br ${theme.gradient} ${
        isHero ? 'aspect-[5/2] min-h-40 w-full sm:aspect-[3/1]' : 'aspect-[5/2] w-full sm:aspect-[3/1]'
      }`}
    >
      <div className="visual-grid absolute inset-0 opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/50 via-transparent to-white/5" />

      {isHero ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <CompassIcon className="size-16 text-white/15 sm:size-24" />
        </div>
      ) : category ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <CategoryIcon category={category} className="size-10 text-white/20 sm:size-12" />
        </div>
      ) : null}

      {!isHero && (
        <span className="absolute bottom-3 right-4 font-display text-3xl font-semibold text-white/15">
          {theme.accent}
        </span>
      )}

      <span className="sr-only">{label} — decorative visual placeholder, not a photograph</span>
    </div>
  )
}
