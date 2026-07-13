import { useState } from 'react'
import { ArrowUpDown, ChevronsUpDown, ArrowUp, ArrowDown, ArrowLeftRight } from 'lucide-react'
import type { Booking, BookingTab, SortDir, SortField, StatusDisplayMode, WaitingSubFilter, ServiceType } from '../../../types'
import BookingRow from './BookingRow'
import ServiceFilterDropdown from './ServiceFilterDropdown'
import ApproveRejectModal from './ApproveRejectModal'

interface BookingsTableProps {
  bookings: Booking[]
  tab: BookingTab
  waitingSub: WaitingSubFilter
  sortField: SortField
  sortDir: SortDir
  onSort: (f: SortField) => void
  statusMode: StatusDisplayMode
  onStatusModeToggle: () => void
  isSelectionMode: boolean
  selectedIds: Set<string>
  allSelected: boolean
  onToggleRow: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onEnterSelectionMode: () => void
  serviceFilter: ServiceType[]
  onServiceFilter: (s: ServiceType[]) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
  onSendForApproval: (id: string) => void
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field || !sortDir) return <ChevronsUpDown size={12} className="text-gray-400" />
  return sortDir === 'asc'
    ? <ArrowUp size={12} className="text-[#7C3AED]" />
    : <ArrowDown size={12} className="text-[#7C3AED]" />
}

function TravelDateFilterPopover({ value, onFilterType }: { value: 'travelDate' | 'bookingDate'; onFilterType: (t: string) => void }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value === 'bookingDate' ? 'Booking Date' : 'Travel Date')

  function apply(type: string) {
    setSelected(type)
    onFilterType(type === 'Booking Date' ? 'bookingDate' : 'travelDate')
    setOpen(false)
  }

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(v => !v)}
        className={`p-0.5 rounded hover:bg-gray-100 transition-colors ${open ? 'text-[#7C3AED]' : 'text-gray-400'}`}
      >
        <ArrowUpDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-3 w-48">
          <div className="mb-3 space-y-2">
            {['Travel Date', 'Booking Date'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setSelected(t)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected === t ? 'border-[#7C3AED]' : 'border-gray-300'}`}
                >
                  {selected === t && <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
                </div>
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2 justify-end border-t border-gray-100 pt-2.5">
            <button onClick={() => setOpen(false)} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50">↺</button>
            <button onClick={() => apply(selected)} className="bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#6D28D9]">Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingsTable({
  bookings, tab, waitingSub, sortField, sortDir, onSort,
  statusMode, onStatusModeToggle,
  isSelectionMode, selectedIds, allSelected,
  onToggleRow, onSelectAll, onDeselectAll, onEnterSelectionMode,
  serviceFilter, onServiceFilter,
  onApprove, onReject, onDelete, onRestore, onSendForApproval,
}: BookingsTableProps) {
  const [approvalModal, setApprovalModal] = useState<{ id: string; type: 'approve' | 'reject' } | null>(null)
  const [dateCol, setDateCol] = useState<'travelDate' | 'bookingDate'>('travelDate')
  const isDeleted = tab === 'deleted'
  void waitingSub

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="pl-4 pr-2 py-4 w-10">
                <div
                  onClick={() => {
                    if (!isSelectionMode) onEnterSelectionMode()
                    allSelected ? onDeselectAll() : onSelectAll()
                  }}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${allSelected ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300 hover:border-[#7C3AED]'}`}
                >
                  {allSelected && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white stroke-2"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ID</th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <button onClick={() => onSort('leadPax')} className="flex items-center gap-1 hover:text-gray-700">
                  Lead Pax <SortIcon field="leadPax" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  <button onClick={() => onSort(dateCol)} className="flex items-center gap-1 hover:text-gray-700">
                    {dateCol === 'travelDate' ? 'Travel Date' : 'Booking Date'}
                    <SortIcon field={dateCol} sortField={sortField} sortDir={sortDir} />
                  </button>
                  <TravelDateFilterPopover
                    value={dateCol}
                    onFilterType={t => setDateCol(t as 'travelDate' | 'bookingDate')}
                  />
                </div>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  Service
                  <ServiceFilterDropdown selected={serviceFilter} onChange={onServiceFilter} />
                </div>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <button onClick={onStatusModeToggle} className="flex items-center gap-1 hover:text-gray-700">
                  {statusMode === 'payment' ? 'Payment Status' : 'Booking Status'}
                  <ArrowLeftRight size={11} className="text-gray-400" />
                </button>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <button onClick={() => onSort('amount')} className="flex items-center gap-1 hover:text-gray-700">
                  Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Owner</th>

              {!isDeleted && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Voucher</th>}
              {!isDeleted && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Tasks</th>}

              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16 text-gray-400 text-sm">
                  No bookings found
                </td>
              </tr>
            ) : bookings.map(booking => (
              <BookingRow
                key={booking.id}
                booking={booking}
                tab={tab}
                dateCol={dateCol}
                statusMode={statusMode}
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.has(booking.id)}
                onToggleSelect={() => {
                  if (!isSelectionMode) onEnterSelectionMode()
                  onToggleRow(booking.id)
                }}
                onApprove={() => setApprovalModal({ id: booking.id, type: 'approve' })}
                onReject={() => setApprovalModal({ id: booking.id, type: 'reject' })}
                onDelete={() => onDelete(booking.id)}
                onRestore={() => onRestore(booking.id)}
                onSendForApproval={() => onSendForApproval(booking.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {approvalModal && (
        <ApproveRejectModal
          open
          type={approvalModal.type}
          bookingId={approvalModal.id}
          onConfirm={() => {
            if (approvalModal.type === 'approve') onApprove(approvalModal.id)
            else onReject(approvalModal.id)
            setApprovalModal(null)
          }}
          onCancel={() => setApprovalModal(null)}
        />
      )}
    </>
  )
}
