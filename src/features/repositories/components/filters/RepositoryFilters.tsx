import { useId } from 'react'
import { Controller } from 'react-hook-form'
import useRepositoryFiltersContext from '../../../../app/providers/useRepositoryFiltersContext'
import { repositoryLanguages } from '../../model/RepositoryQuery'

const fieldClassName = 'mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none'

export default function RepositoryFilters() {
  const { control, errors, resetFilters: onReset } = useRepositoryFiltersContext()
  const searchId = useId()
  const languageId = useId()
  const minStarsId = useId()

  return (
    <section aria-label="Фільтри репозиторіїв" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Фільтри репозиторіїв</h2>
          <p className="mt-1 text-sm text-slate-600">Зміни буде застосовано після короткої паузи.</p>
        </div>
        <button type="button" onClick={onReset} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-800 hover:bg-slate-50">
          Скинути фільтри
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor={searchId} className="block text-sm font-medium text-slate-900">Назва репозиторію</label>
          <Controller
            control={control}
            name="search"
            rules={{ validate: (value) => !/[:<>]/.test(value) || 'Не використовуйте qualifiers GitHub у назві.' }}
            render={({ field }) => <input {...field} id={searchId} type="search" autoComplete="off" className={fieldClassName} aria-invalid={errors.search ? 'true' : undefined} aria-describedby={errors.search ? `${searchId}-error` : undefined} />}
          />
          {errors.search && <p id={`${searchId}-error`} className="mt-1 text-sm text-red-700">{errors.search.message}</p>}
        </div>

        <div>
          <label htmlFor={languageId} className="block text-sm font-medium text-slate-900">Мова програмування</label>
          <Controller
            control={control}
            name="language"
            rules={{ validate: (value) => value === '' || repositoryLanguages.includes(value as (typeof repositoryLanguages)[number]) || 'Оберіть мову зі списку.' }}
            render={({ field }) => (
              <select {...field} id={languageId} className={fieldClassName} aria-invalid={errors.language ? 'true' : undefined} aria-describedby={errors.language ? `${languageId}-error` : undefined}>
                <option value="">Усі</option>
                {repositoryLanguages.map((language) => <option key={language} value={language}>{language}</option>)}
              </select>
            )}
          />
          {errors.language && <p id={`${languageId}-error`} className="mt-1 text-sm text-red-700">{errors.language.message}</p>}
        </div>

        <div>
          <label htmlFor={minStarsId} className="block text-sm font-medium text-slate-900">Мінімум зірок</label>
          <Controller
            control={control}
            name="minStars"
            rules={{ validate: (value) => value === '' || (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))) || 'Введіть невід’ємне ціле безпечне число.' }}
            render={({ field }) => <input {...field} id={minStarsId} type="text" inputMode="numeric" className={fieldClassName} aria-invalid={errors.minStars ? 'true' : undefined} aria-describedby={errors.minStars ? `${minStarsId}-error` : undefined} />}
          />
          {errors.minStars && <p id={`${minStarsId}-error`} className="mt-1 text-sm text-red-700">{errors.minStars.message}</p>}
        </div>
      </div>
    </section>
  )
}
