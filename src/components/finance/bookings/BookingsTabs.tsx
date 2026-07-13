import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BookingTab, WaitingSubFilter } from '../../../types'
import Toggle from '../../ui/Toggle'

const WAITING_SUB_OPTIONS: WaitingSubFilter[] = ['All', 'Pending', 'Approved', 'Rejected']

function WaitingSubDropdown({ value, onChange }: { value: WaitingSubFilter; onChange: (v: WaitingSubFilter) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative ml-3 self-center">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
      >
        {value}
        <ChevronDown size={12} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-32 overflow-hidden">
          {WAITING_SUB_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                value === opt ? 'text-[#7C3AED] font-medium bg-violet-50' : 'text-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface BookingsTabsProps {
  tab: BookingTab
  onTabChange: (t: BookingTab) => void
  waitingSub: WaitingSubFilter
  onWaitingSubChange: (s: WaitingSubFilter) => void
  showIncomplete: boolean
  onShowIncompleteChange: (v: boolean) => void
  total: number
}

export default function BookingsTabs({
  tab, onTabChange, waitingSub, onWaitingSubChange,
  showIncomplete, onShowIncompleteChange, total,
}: BookingsTabsProps) {
  return (
    <div className="flex items-center justify-between px-6 border-b border-gray-200 bg-white">
      {/* Tabs */}
      <div className="flex items-center gap-6">
        {(['bookings', 'deleted', 'waiting'] as BookingTab[]).map(t => {
          const labels: Record<BookingTab, string> = {
            bookings: 'Bookings',
            deleted: 'Deleted',
            waiting: 'Waiting for Approval',
          }
          const active = tab === t
          return (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`px-7 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {labels[t]}
            </button>
          )
        })}

        {tab === 'waiting' && (
          <WaitingSubDropdown value={waitingSub} onChange={onWaitingSubChange} />
        )}
      </div>

      {/* Right: toggle + total badge */}
      <div className="flex items-center gap-4 py-3">
        <Toggle
          checked={showIncomplete}
          onChange={onShowIncompleteChange}
          label="Show Incomplete Bookings"
        />
        <span className="border border-amber-400 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 whitespace-nowrap">
          Total {total}
        </span>
      </div>
    </div>
  )
}
