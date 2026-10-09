type ErrorStateProps = {
  message: string
  retryAt?: Date
  onRetry: () => void
}

function formatRetryAt(retryAt: Date | undefined): string | undefined {
  if (!retryAt) return undefined
  return retryAt.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

export default function ErrorState({ message, retryAt, onRetry }: ErrorStateProps) {
  const formattedRetryAt = formatRetryAt(retryAt)

  return (
    <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <p className="font-medium text-red-800">{message}</p>
      {formattedRetryAt && <p className="mt-2 text-sm text-red-700">Наступна спроба після {formattedRetryAt}.</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-11 rounded-lg border border-red-300 bg-white px-4 py-2 font-medium text-red-800 hover:bg-red-100"
      >
        Спробувати ще раз
      </button>
    </section>
  )
}
