import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

type LanguageFilterProps = {
  languages: readonly string[]
  value: string
  onChange: (language: string) => void
}

export default function LanguageFilter({ languages, value, onChange }: LanguageFilterProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const options = ['', ...languages]
  const selectedIndex = Math.max(0, options.indexOf(value))
  const selectedLabel = value === '' ? 'Усі' : value

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const openMenu = () => {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  const selectOption = (index: number) => {
    onChange(options[index] ?? '')
    setActiveIndex(index)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      openMenu()
      return
    }
    if (!open) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + options.length) % options.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(activeIndex)
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-52">
      <span className="block text-sm font-medium text-slate-900">Мова програмування</span>
      <button
        type="button"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className="mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-slate-900 shadow-sm transition hover:border-slate-400 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={18} aria-hidden="true" className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Мова програмування"
          className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5"
        >
          {options.map((option, index) => {
            const isSelected = option === value
            const isActive = index === activeIndex
            return (
              <button
                key={option || 'all'}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectOption(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>{option || 'Усі'}</span>
                {isSelected && <Check size={16} aria-hidden="true" className="text-blue-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
