export type RequestState = 'loading' | 'error' | 'empty' | 'success'

export function getRequestState(input: {
  loading: boolean
  error: unknown | null
  repositoryCount: number
}): RequestState {
  if (input.loading) return 'loading'
  if (input.error) return 'error'
  if (input.repositoryCount === 0) return 'empty'
  return 'success'
}

export type DashboardRequestState = RequestState | 'invalid' | 'debouncing'

export function getDashboardRequestState(input: {
  valid: boolean
  debouncing: boolean
  status: 'idle' | 'loading' | 'success' | 'error'
  count: number
}): DashboardRequestState {
  if (!input.valid) return 'invalid'
  if (input.debouncing) return 'debouncing'
  if (input.status === 'error') return 'error'
  if (input.status !== 'success') return 'loading'
  return input.count === 0 ? 'empty' : 'success'
}
