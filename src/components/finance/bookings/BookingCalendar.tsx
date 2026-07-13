import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plane, Building2, Bus, Globe, FileCheck, Activity, MoreHorizontal, Filter, Calendar } from 'lucide-react'
import Navbar from '../../layout/Navbar'
import Sidebar from '../../layout/Sidebar'
import FinancePills from '../FinancePills'
import FilterBar from './FilterBar'
import { MOCK_BOOKINGS } from '../../../data/mockData'
import type { Booking, FilterState } from '../../../types'

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Flight:           <Plane size={13} className="text-sky-500" />,
  Accommodation:    <Building2 size={13} className="text-violet-500" />,
  Transportation:   <Bus size={13} className="text-purple-500" />,
  Limitless:        <Globe size={13} className="text-indigo-500" />,
  Visa:             <FileCheck size={13} className="text-green-500" />,
  Activity:         <Activity size={13} className="text-orange-500" />,
}

const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-500',
  'On Trip':  'bg-amber-500',
  Upcoming:   'bg-blue-500',
  Cancelled:  'bg-gray-400',
}

function getBookingCalStatus(b: Booking): string {
  const now = new Date()
  if (b.bookingStatus === 'Cancelled') return 'Cancelled'
  if (b.travelDate < now) return 'Completed'
  const diff = (b.travelDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diff <= 2) return 'On Trip'
  return 'Upcoming'
}

const TIME_SLOTS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function fmtDateShort(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

interface CalendarCardProps {
  booking: Booking
  status: string
  onDelete: () => void
}

function CalendarCard({ booking, status, onDelete }: CalendarCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const MENU_ITEMS: [string, string, (() => void)?][] = [
    ['text-green-600',  'You Got',        undefined],
    ['text-red-600',    'You Gave',       undefined],
    ['text-gray-700',   'Reschedule',     undefined],
    ['text-gray-700',   'Change Status',  undefined],
    ['text-blue-600',   'Edit',           undefined],
    ['text-red-600',    'Delete',         () => { setMenuOpen(false); onDelete() }],
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm mb-2 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status] ?? 'bg-gray-400'}`} />
          <span className="text-xs font-semibold text-[#7C3AED] truncate">{booking.id}</span>
          <span className="text-gray-300">|</span>
          {SERVICE_ICONS[booking.service] ?? <MoreHorizontal size={13} />}
          <span className="text-xs text-gray-600 truncate">{booking.serviceLabel}</span>
        </div>
        <div className="relative" ref={ref}>
          <button onClick={() => setMenuOpen(v => !v)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-40 py-1.5 min-w-44 text-sm">
              {MENU_ITEMS.map(([color, label, action]) => (
                <button
                  key={label}
                  onClick={() => { action ? action() : setMenuOpen(false) }}
                  className={`w-full text-left px-4 py-2 ${color} hover:bg-gray-50`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span>🕐 {booking.time ?? '09:00'}</span>
        {booking.route && <span className="text-gray-400">|</span>}
        {booking.route && <span>{booking.route}</span>}
        {!booking.route && booking.serviceLabel && <span>{booking.serviceLabel}</span>}
      </div>
    </div>
  )
}

const DEFAULT_FILTERS: FilterState = {
  bookingDateStart: '', bookingDateEnd: '',
  travelDateStart: '', travelDateEnd: '',
  ownerIds: [], primaryOwnerIds: [], secondaryOwnerIds: [],
  advanceOwnerSearch: false,
  bookingType: 'All Bookings',
  search: '',
  services: [],
  showIncomplete: false,
}

const ALL_STATUSES = Object.keys(STATUS_COLORS)

function StatusFilterPopover({ applied, onApply }: {
  applied: string[]
  onApply: (s: string[]) => void
}) {
  const [pending, setPending] = useState<string[]>(applied)
  const allSelected = pending.length === ALL_STATUSES.length

  function toggle(status: string) {
    setPending(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])
  }

  return (
    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-40 p-4 w-52">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter by Status</p>
      <div className="space-y-2">
        {ALL_STATUSES.map(status => {
          const checked = pending.includes(status)
          return (
            <label key={status} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggle(status)}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300 group-hover:border-[#7C3AED]'}`}>
                {checked && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white stroke-2"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status]}`} />
              <span className="text-sm text-gray-700">{status}</span>
            </label>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setPending(allSelected ? [] : ALL_STATUSES)}
          className="text-xs text-gray-500 hover:text-[#7C3AED] transition-colors"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={() => onApply(pending)}
          className="bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#6D28D9] transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default function BookingCalendar() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') !== 'false')
  const [startDate, setStartDate] = useState(new Date(2026, 2, 5))
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>(ALL_STATUSES)
  const [searchType, setSearchType] = useState('Booking ID')
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const DAYS_VISIBLE = 5
  const days = Array.from({ length: DAYS_VISIBLE }, (_, i) => addDays(startDate, i))
  const endDate = addDays(startDate, DAYS_VISIBLE - 1)

  const activeBkgs = MOCK_BOOKINGS.filter(b => {
    if (b.isDeleted || deletedIds.has(b.id) || b.approvalStatus !== 'approved') return false
    if (filters.bookingType !== 'All Bookings' && !b.id.startsWith(filters.bookingType)) return false
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      if (searchType === 'Booking ID' && !b.id.toLowerCase().includes(q)) return false
      if (searchType === 'Lead Pax'   && !b.leadPax.toLowerCase().includes(q)) return false
      if (searchType === 'Amount'     && !String(b.amount).includes(q)) return false
    }
    if (filters.ownerIds.length > 0 && !b.owners.some(o => filters.ownerIds.includes(o.id))) return false
    if (filters.travelDateStart) {
      const s = new Date(filters.travelDateStart + 'T00:00:00')
      if (b.travelDate < s) return false
    }
    if (filters.travelDateEnd) {
      const e = new Date(filters.travelDateEnd + 'T00:00:00')
      if (b.travelDate > e) return false
    }
    return true
  })

  const bkgsByDay = days.map(d =>
    activeBkgs.filter(b => isSameDay(b.travelDate, d) && statusFilter.includes(getBookingCalStatus(b)))
  )

  const totalInRange = activeBkgs.filter(b => {
    const t = b.travelDate
    return t >= startDate && t <= endDate
  }).length

  const now = new Date()
  const nowHour = now.getHours() + now.getMinutes() / 60
  const timelineStart = 9
  const timelineEnd   = 18
  const nowPct = Math.min(Math.max((nowHour - timelineStart) / (timelineEnd - timelineStart), 0), 1) * 100

  const statusCounts = activeBkgs.filter(b => b.travelDate >= startDate && b.travelDate <= endDate).reduce((acc, b) => {
    const s = getBookingCalStatus(b)
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters(f => ({ ...f, [key]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && <Sidebar onClose={() => { setSidebarOpen(false); localStorage.setItem('sidebarOpen', 'false') }} />}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9F9F9]">
      <Navbar searchValue={filters.search} onSearch={q => updateFilter('search', q)} sidebarOpen={sidebarOpen} onOpenSidebar={() => { setSidebarOpen(true); localStorage.setItem('sidebarOpen', 'true') }} />

      <div className="px-6 py-4 flex items-center justify-between">
        <FinancePills />
        <button
          onClick={() => navigate('/finance/bookings')}
          className="w-11.5 h-11.5 border-2 border-[#7135AD] rounded-xl flex items-center justify-center text-[#7135AD] bg-violet-50"
        >
          <Calendar size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 px-6 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <FilterBar filters={filters} updateFilter={updateFilter} resetFilters={() => setFilters(DEFAULT_FILTERS)} isCalendar searchType={searchType} onSearchTypeChange={setSearchType} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm ml-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Bookings Timeline</h2>
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(v => !v)}
                className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-sm transition-colors ${
                  statusFilter.length < ALL_STATUSES.length
                    ? 'border-[#7C3AED] text-[#7C3AED] bg-violet-50'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter size={14} /> Filter
                {statusFilter.length < ALL_STATUSES.length && (
                  <span className="bg-[#7C3AED] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {ALL_STATUSES.length - statusFilter.length}
                  </span>
                )}
              </button>
              {filterOpen && (
                <StatusFilterPopover
                  applied={statusFilter}
                  onApply={s => { setStatusFilter(s); setFilterOpen(false) }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <button onClick={() => setStartDate(d => addDays(d, -DAYS_VISIBLE))} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {fmtDateShort(startDate)} - {fmtDateShort(endDate)}
              </span>
              <button onClick={() => setStartDate(d => addDays(d, DAYS_VISIBLE))} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
                <ChevronRight size={14} />
              </button>
              <span className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2.5 py-0.5">Total {totalInRange}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {Object.entries(STATUS_COLORS).map(([label, cls]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${cls}`} />
                  {label} {statusCounts[label] ?? 0}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-200">
              <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '60px repeat(5, 1fr)' }}>
                <div className="border-r border-gray-100" />
                {days.map((d, i) => {
                  const dayBkgs = bkgsByDay[i]
                  const osCount = dayBkgs.filter(b => b.id.startsWith('OS')).length
                  const liCount = dayBkgs.filter(b => b.id.startsWith('LI')).length
                  const isToday = isSameDay(d, new Date())
                  return (
                    <div key={i} className={`border-r border-gray-100 px-3 py-2 ${isToday ? 'bg-blue-50' : ''}`}>
                      <div className={`text-xs font-semibold mb-0.5 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                      </div>
                      <div className="flex gap-2 text-[10px] text-gray-400">
                        <span>OS {osCount}</span>
                        <span>Limitless {liCount}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="relative">
                <div
                  className="absolute left-0 right-0 border-t-2 border-blue-500 z-20 pointer-events-none"
                  style={{ top: `${nowPct}%` }}
                >
                  <span className="absolute left-1 -top-2.5 w-4 h-4 bg-blue-500 rounded-full" />
                </div>

                {TIME_SLOTS.map((time) => (
                  <div key={time} className="grid border-b border-gray-100" style={{ gridTemplateColumns: '60px repeat(5, 1fr)', minHeight: 80 }}>
                    <div className="border-r border-gray-100 px-2 pt-2">
                      <span className="text-[11px] text-gray-400 font-medium">{time}</span>
                    </div>

                    {/* Day cells */}
                    {days.map((d, di) => {
                      const slotBkgs = bkgsByDay[di].filter(b => {
                        const bTime = b.time ?? '09:00'
                        const bHour = parseInt(bTime.split(':')[0])
                        const slotHour = parseInt(time.split(':')[0])
                        return bHour === slotHour
                      })
                      const isToday = isSameDay(d, new Date())
                      return (
                        <div key={di} className={`border-r border-gray-100 p-1.5 ${isToday ? 'bg-blue-50/30' : ''}`}>
                          {slotBkgs.map(b => (
                            <CalendarCard key={b.id} booking={b} status={getBookingCalStatus(b)} onDelete={() => setDeletedIds(prev => new Set([...prev, b.id]))} />
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
