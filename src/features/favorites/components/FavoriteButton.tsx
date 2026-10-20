import { Heart } from 'lucide-react'
import { useDashboardStore } from '../../../store/useDashboardStore'

type FavoriteButtonProps = {
  repositoryId: number
}

export default function FavoriteButton({ repositoryId }: FavoriteButtonProps) {
  const isFavorite = useDashboardStore((state) => state.favoriteIds.includes(repositoryId))
  const toggleFavorite = useDashboardStore((state) => state.toggleFavorite)
  const label = isFavorite ? 'Видалити з обраного' : 'Додати до обраного'

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(repositoryId)}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Heart aria-hidden="true" className="size-5" fill={isFavorite ? 'currentColor' : 'none'} />
      <span>{label}</span>
    </button>
  )
}
