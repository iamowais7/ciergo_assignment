import { useState, useMemo } from 'react'
import type { Booking, BookingTab, FilterState, SortDir, SortField, WaitingSubFilter, StatusDisplayMode } from '../types'
import { MOCK_BOOKINGS } from '../data/mockData'

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

function parseDate(s: string): Date | null {
  if (!s) return null
  // Append T00:00:00 to force local-time parsing instead of UTC midnight
  const d = new Date(s + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function inRange(date: Date, start: string, end: string): boolean {
  const s = parseDate(start)
  const e = parseDate(end)
  if (s && date < s) return false
  if (e && date > e) return false
  return true
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [tab, setTab] = useState<BookingTab>('bookings')
  const [waitingSub, setWaitingSub] = useState<WaitingSubFilter>('All')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [statusMode, setStatusMode] = useState<StatusDisplayMode>('payment')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      if (sortDir === 'asc') { setSortDir('desc') }
      else if (sortDir === 'desc') { setSortField(null); setSortDir(null) }
      else { setSortDir('asc') }
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function approveBooking(id: string) {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, approvalStatus: 'approved' } : b))
  }

  function rejectBooking(id: string) {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, approvalStatus: 'rejected' } : b))
  }

  function deleteBooking(id: string) {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, isDeleted: true, deletedAt: new Date() } : b))
  }

  function restoreBooking(id: string) {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, isDeleted: false } : b))
  }

  function sendForApproval(id: string) {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, approvalStatus: 'pending' } : b))
  }

  const filtered = useMemo(() => {
    let result = bookings

    if (tab === 'bookings') {
      result = result.filter(b => !b.isDeleted && b.approvalStatus === 'approved')
    } else if (tab === 'deleted') {
      result = result.filter(b => b.isDeleted)
    } else {
      result = result.filter(b => !b.isDeleted)
      if (waitingSub === 'Pending')  result = result.filter(b => b.approvalStatus === 'pending')
      if (waitingSub === 'Approved') result = result.filter(b => b.approvalStatus === 'approved')
      if (waitingSub === 'Rejected') result = result.filter(b => b.approvalStatus === 'rejected')
    }

    if (!filters.showIncomplete) {
      result = result.filter(b => !b.isIncomplete)
    }

    if (filters.bookingDateStart || filters.bookingDateEnd) {
      result = result.filter(b => inRange(b.bookingDate, filters.bookingDateStart, filters.bookingDateEnd))
    }

    if (filters.travelDateStart || filters.travelDateEnd) {
      result = result.filter(b => inRange(b.travelDate, filters.travelDateStart, filters.travelDateEnd))
    }

    if (filters.ownerIds.length > 0) {
      result = result.filter(b => b.owners.some(o => filters.ownerIds.includes(o.id)))
    }

    if (filters.bookingType !== 'All Bookings') {
      result = result.filter(b => b.id.startsWith(filters.bookingType))
    }

    if (filters.services.length > 0) {
      result = result.filter(b => filters.services.includes(b.service))
    }

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.leadPax.toLowerCase().includes(q) ||
        String(b.amount).includes(q)
      )
    }

    if (sortField && sortDir) {
      result = [...result].sort((a, b) => {
        let av: number | string = 0
        let bv: number | string = 0
        if (sortField === 'leadPax')     { av = a.leadPax;               bv = b.leadPax }
        if (sortField === 'travelDate') { av = a.travelDate.getTime();  bv = b.travelDate.getTime() }
        if (sortField === 'bookingDate'){ av = a.bookingDate.getTime(); bv = b.bookingDate.getTime() }
        if (sortField === 'amount')     { av = a.amount;                bv = b.amount }
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1  : -1
        return 0
      })
    }

    return result
  }, [bookings, tab, waitingSub, filters, sortField, sortDir])

  const total      = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    bookings: paginated,
    allFiltered: filtered,
    tab, setTab,
    waitingSub, setWaitingSub,
    filters, updateFilter, resetFilters,
    sortField, sortDir, toggleSort,
    statusMode, setStatusMode,
    page, setPage,
    pageSize, setPageSize,
    total, totalPages,
    approveBooking, rejectBooking, deleteBooking, restoreBooking, sendForApproval,
  }
}
