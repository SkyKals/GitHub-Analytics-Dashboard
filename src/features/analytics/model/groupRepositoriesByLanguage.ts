import type { GitHubRepository } from '../../repositories/model/GitHubRepository'

export type LanguageDatum = {
  language: string
  count: number
}

const UNKNOWN_LANGUAGE = 'Не вказано'

export function groupRepositoriesByLanguage(
  repositories: readonly Pick<GitHubRepository, 'language'>[],
): LanguageDatum[] {
  const counts = new Map<string, number>()

  for (const repository of repositories) {
    const language = repository.language.trim() || UNKNOWN_LANGUAGE
    counts.set(language, (counts.get(language) ?? 0) + 1)
  }

  return Array.from(counts, ([language, count]) => ({ language, count }))
    .sort((left, right) => left.language.localeCompare(right.language, 'uk-UA'))
}
