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
