import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, RotateCcw, ArrowRight } from 'lucide-react'
import type { FilterState } from '../../../types'
import OwnerFilterModal from './OwnerFilterModal'
import { ALL_OWNERS } from '../../../data/mockData'

interface FilterBarProps {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
  isCalendar?: boolean
  searchType?: string
  onSearchTypeChange?: (t: string) => void
}

function DateRangePicker({ startVal, endVal, onStartChange, onEndChange, label }: {
  startVal: string, endVal: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  label: string
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 block mb-1.5">{label}</label>
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-2.5 py-2 bg-white hover:border-gray-300 transition-colors">
        <input
          type="date"
          value={startVal}
          onChange={e => onStartChange(e.target.value)}
          className="text-sm text-gray-600 outline-none w-28 bg-transparent scheme-light cursor-pointer"
        />
        <ArrowRight size={13} className="text-gray-300 shrink-0" />
        <input
          type="date"
          value={endVal}
          onChange={e => onEndChange(e.target.value)}
          className="text-sm text-gray-600 outline-none w-28 bg-transparent scheme-light cursor-pointer"
        />
      </div>
    </div>
  )
}

const SEARCH_TYPES = ['Booking ID', 'Lead Pax', 'Amount']

export default function FilterBar({ filters, updateFilter, resetFilters, isCalendar, searchType = 'Booking ID', onSearchTypeChange }: FilterBarProps) {
  const [ownerModalOpen, setOwnerModalOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [searchTypeOpen, setSearchTypeOpen] = useState(false)
  const typeRef = useRef<HTMLDivElement>(null)
  const searchTypeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false)
      if (searchTypeRef.current && !searchTypeRef.current.contains(e.target as Node)) setSearchTypeOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const ownerCount = filters.ownerIds.length
  const ownerLabel = ownerCount > 0
    ? ALL_OWNERS.filter(o => filters.ownerIds.includes(o.id)).map(o => o.name).join(', ')
    : ''
  const BOOKING_TYPES = ['All Bookings', 'OS', 'LI']

  return (
    <div>
      <div className="flex items-end gap-3">
        {/* Booking Date */}
        <DateRangePicker
          label="Booking Date"
          startVal={filters.bookingDateStart} endVal={filters.bookingDateEnd}
          onStartChange={v => updateFilter('bookingDateStart', v)}
          onEndChange={v => updateFilter('bookingDateEnd', v)}
        />

        {/* Travel Date */}
        <DateRangePicker
          label="Travel Date"
          startVal={filters.travelDateStart} endVal={filters.travelDateEnd}
          onStartChange={v => updateFilter('travelDateStart', v)}
          onEndChange={v => updateFilter('travelDateEnd', v)}
        />

        {/* Booking Owner */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Booking Owner</label>
          <button
            onClick={() => setOwnerModalOpen(true)}
            className={`flex items-center gap-2 border rounded-xl px-3 py-2 bg-white text-sm min-w-44 transition-colors ${
              ownerCount > 0 ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <span className="flex-1 text-left truncate">
              {ownerLabel || 'Search / Select Owners'}
            </span>
            {ownerCount > 0 && (
              <span className="bg-[#7C3AED] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                {ownerCount}
              </span>
            )}
            <ChevronDown size={14} className="shrink-0 text-gray-400" />
          </button>
        </div>

        {/* Booking Type */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Booking Type</label>
          <div ref={typeRef} className="relative">
            <button
              onClick={() => setTypeOpen(v => !v)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white hover:border-gray-300 text-sm text-gray-700 min-w-29 transition-colors"
            >
              <span className="flex-1 text-left">{filters.bookingType}</span>
              <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform duration-150 ${typeOpen ? 'rotate-180' : ''}`} />
            </button>
            {typeOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full overflow-hidden">
                {BOOKING_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => { updateFilter('bookingType', t); setTypeOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      filters.bookingType === t ? 'text-[#7C3AED] font-medium bg-violet-50' : 'text-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {isCalendar ? (
          <div className="flex-1 min-w-40">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Search</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-white gap-2 w-full">
              <div ref={searchTypeRef} className="relative shrink-0">
                <button
                  onClick={() => setSearchTypeOpen(v => !v)}
                  className="text-sm text-gray-600 pr-2 border-r border-gray-200 flex items-center gap-1"
                >
                  {searchType} <ChevronDown size={12} className={`transition-transform ${searchTypeOpen ? 'rotate-180' : ''}`} />
                </button>
                {searchTypeOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden min-w-28">
                    {SEARCH_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => { onSearchTypeChange?.(t); setSearchTypeOpen(false); updateFilter('search', '') }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${searchType === t ? 'text-[#7C3AED] font-medium' : 'text-gray-700'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                placeholder={`Search by ${searchType}`}
                className="text-sm outline-none flex-1 bg-transparent text-gray-700 placeholder-gray-400 min-w-0"
              />
              <Search size={14} className="text-gray-400 shrink-0" />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-40">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">&nbsp;</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-white gap-2 w-full hover:border-gray-300 transition-colors">
              <input
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                placeholder="Search by ID / Lead Pax / Amount"
                className="text-sm outline-none flex-1 bg-transparent text-gray-700 placeholder-gray-400 min-w-0"
              />
              <Search size={14} className="text-gray-400 shrink-0" />
            </div>
          </div>
        )}

        {/* Reset */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">&nbsp;</label>
          <button
            onClick={resetFilters}
            className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors"
            title="Reset all filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <OwnerFilterModal
        open={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        selectedIds={filters.ownerIds}
        onApply={ids => updateFilter('ownerIds', ids)}
      />
    </div>
  )
}
