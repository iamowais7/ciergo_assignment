import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MoreVertical, ChevronDown } from 'lucide-react'

import Navbar from '../../layout/Navbar'
import Sidebar from '../../layout/Sidebar'
import FinancePills from '../FinancePills'
import FilterBar from './FilterBar'
import BookingsTabs from './BookingsTabs'
import BookingsTable from './BookingsTable'
import Pagination from '../../ui/Pagination'
import BulkActionsMenu from './BulkActionsMenu'
import { useBookings } from '../../../hooks/useBookings'
import { useSelection } from '../../../hooks/useSelection'

export default function BookingsPage() {
  const navigate = useNavigate()
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') !== 'false')

  function setSidebar(open: boolean) {
    setSidebarOpen(open)
    localStorage.setItem('sidebarOpen', String(open))
  }

  const {
    bookings, allFiltered,
    tab, setTab,
    waitingSub, setWaitingSub,
    filters, updateFilter, resetFilters,
    sortField, sortDir, toggleSort,
    statusMode, setStatusMode,
    page, setPage, pageSize, setPageSize,
    total, totalPages,
    approveBooking, rejectBooking, deleteBooking, restoreBooking, sendForApproval,
  } = useBookings()

  const allIds = allFiltered.map(b => b.id)
  const {
    isSelectionMode, selectedIds, allSelected,
    enterSelectionMode, exitSelectionMode,
    toggleRow, selectAll, deselectAll,
  } = useSelection(allIds)

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && <Sidebar onClose={() => setSidebar(false)} />}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9F9F9]">
      <Navbar searchValue={filters.search} onSearch={q => updateFilter('search', q)} sidebarOpen={sidebarOpen} onOpenSidebar={() => setSidebar(true)} />

      <div className="px-6 py-4 flex items-center justify-between">
        <FinancePills />

        <div className="flex items-center gap-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={exitSelectionMode}
                className="border border-[#E1E1E1] rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={allSelected ? deselectAll : selectAll}
                className="border border-[#E1E1E1] rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setBulkMenuOpen(v => !v)}
                  className="border border-[#E1E1E1] rounded-xl w-11.5 h-11.5 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
                >
                  <MoreVertical size={15} />
                </button>
                <BulkActionsMenu open={bulkMenuOpen} onClose={() => setBulkMenuOpen(false)} />
              </div>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setBulkMenuOpen(v => !v)}
                className="flex items-center gap-2 border border-[#E1E1E1] bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                More Actions
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <BulkActionsMenu open={bulkMenuOpen} onClose={() => setBulkMenuOpen(false)} />
            </div>
          )}

          <button
            onClick={() => navigate('/finance/bookings/calendar')}
            className="w-11.5 h-11.5 border border-[#E1E1E1] bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-[#7135AD] transition-colors"
            title="Calendar view"
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 px-6 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <FilterBar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <BookingsTabs
            tab={tab}
            onTabChange={t => { setTab(t); exitSelectionMode() }}
            waitingSub={waitingSub}
            onWaitingSubChange={setWaitingSub}
            showIncomplete={filters.showIncomplete}
            onShowIncompleteChange={v => updateFilter('showIncomplete', v)}
            total={total}
          />
          <BookingsTable
            bookings={bookings}
            tab={tab}
            waitingSub={waitingSub}
            sortField={sortField}
            sortDir={sortDir}
            onSort={toggleSort}
            statusMode={statusMode}
            onStatusModeToggle={() => setStatusMode(m => m === 'payment' ? 'booking' : 'payment')}
            isSelectionMode={isSelectionMode}
            selectedIds={selectedIds}
            allSelected={allSelected}
            onToggleRow={toggleRow}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onEnterSelectionMode={enterSelectionMode}
            serviceFilter={filters.services}
            onServiceFilter={s => updateFilter('services', s)}
            onApprove={approveBooking}
            onReject={rejectBooking}
            onDelete={deleteBooking}
            onRestore={restoreBooking}
            onSendForApproval={sendForApproval}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      </div>
    </div>
  )
}
