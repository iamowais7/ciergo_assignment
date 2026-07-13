import { useState, useRef } from 'react'
import { Plane, Building2, Bus, Globe, FileCheck, Activity, Ticket, Shield, MoreHorizontal, ClipboardList, Plus, FileText, ChevronDown, Check, X } from 'lucide-react'
import type { Booking, BookingTab, StatusDisplayMode } from '../../../types'
import Badge from '../../ui/Badge'
import OwnerAvatars from '../../ui/OwnerAvatar'
import RowContextMenu from './RowContextMenu'
import AmountTooltip from './AmountTooltip'

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Flight:           <Plane size={20} className="text-sky-500" />,
  Accommodation:    <Building2 size={20} className="text-violet-500" />,
  Transportation:   <Bus size={20} className="text-purple-500" />,
  Limitless:        <Globe size={20} className="text-indigo-500" />,
  Visa:             <FileCheck size={20} className="text-green-500" />,
  Activity:         <Activity size={20} className="text-orange-500" />,
  Ticket:           <Ticket size={20} className="text-pink-500" />,
  'Travel Insurance': <Shield size={20} className="text-blue-500" />,
  Others:           <MoreHorizontal size={20} className="text-gray-500" />,
}

interface BookingRowProps {
  booking: Booking
  tab: BookingTab
  dateCol?: 'travelDate' | 'bookingDate'
  statusMode: StatusDisplayMode
  isSelectionMode: boolean
  isSelected: boolean
  onToggleSelect: () => void
  onApprove?: () => void
  onReject?: () => void
  onDelete?: () => void
  onRestore?: () => void
  onSendForApproval?: () => void
}

export default function BookingRow({
  booking, tab, dateCol = 'travelDate', statusMode,
  isSelectionMode, isSelected, onToggleSelect,
  onApprove, onReject, onDelete, onRestore, onSendForApproval,
}: BookingRowProps) {
  const [hovering, setHovering] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [amountHover, setAmountHover] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  const showCheckbox = isSelectionMode || hovering
  const isDeleted   = tab === 'deleted'
  const isWaiting   = tab === 'waiting'

  const displayStatus = statusMode === 'payment'
    ? booking.paymentStatus
    : booking.bookingStatus

  // In waiting tab, force Pending status for pending/rejected
  const shownStatus = isWaiting && (booking.approvalStatus === 'pending' || booking.approvalStatus === 'rejected')
    ? 'Pending'
    : displayStatus

  // Determine row context menu variant
  const menuVariant = isDeleted
    ? 'deleted'
    : booking.approvalStatus === 'rejected'
    ? 'rejected'
    : booking.approvalStatus === 'pending'
    ? 'pending'
    : 'default'

  const showVoucherAndTasks = !isDeleted && booking.approvalStatus !== 'rejected'
  const showPaymentBtn = !isDeleted && booking.approvalStatus === 'approved'
  const showApproveReject = isWaiting && booking.approvalStatus === 'pending'

  return (
    <tr
      className={`border-b border-gray-100 transition-colors group ${isSelected ? 'bg-violet-50' : 'hover:bg-gray-50/50'}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-5 w-10">
        {showCheckbox ? (
          <div
            onClick={onToggleSelect}
            className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300 hover:border-[#7C3AED]'}`}
          >
            {isSelected && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white stroke-2"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        ) : <div className="w-4 h-4" />}
      </td>

      {/* Booking ID */}
      <td className="px-4 py-5">
        <span className="text-sm font-semibold text-gray-800">{booking.id}</span>
      </td>

      {/* Lead Pax */}
      <td className="px-4 py-5">
        <span className="text-sm text-gray-700">{booking.leadPax}</span>
      </td>

      {/* Travel / Booking Date */}
      <td className="px-4 py-5">
        <span className="text-sm text-gray-600">
          {(() => {
            const d = dateCol === 'bookingDate' ? booking.bookingDate : booking.travelDate
            const day = String(d.getDate()).padStart(2, '0')
            const month = d.toLocaleDateString('en-IN', { month: 'short' })
            const year = String(d.getFullYear()).slice(-2)
            return `${day} ${month} '${year}`
          })()}
        </span>
      </td>

      {/* Service */}
      <td className="px-4 py-5">
        {booking.service === 'Limitless' && booking.country ? (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500 font-medium">{booking.country}</span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-[#7C3AED] rounded-full px-2.5 py-0.5 text-xs font-medium">
              {SERVICE_ICONS[booking.service]}
              {booking.serviceLabel}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1.5">
            {SERVICE_ICONS[booking.service]}
            <span className="text-xs text-gray-600 whitespace-nowrap">{booking.serviceLabel}</span>
          </div>
        )}
      </td>

      {/* Payment/Booking Status */}
      <td className="px-4 py-5">
        <Badge status={shownStatus} />
      </td>

      {/* Amount */}
      <td className="px-4 py-5">
        <div className="relative inline-block">
          <span
            className="text-sm font-medium text-gray-800 cursor-default"
            onMouseEnter={() => setAmountHover(true)}
            onMouseLeave={() => setAmountHover(false)}
          >
            ₹{' '}{booking.amount.toLocaleString('en-IN')}
          </span>
          {amountHover && (booking.pendingCustomer > 0 || booking.pendingVendor > 0) && (
            <AmountTooltip customer={booking.pendingCustomer} vendor={booking.pendingVendor} />
          )}
        </div>
      </td>

      {/* Owner */}
      <td className="px-4 py-5">
        <OwnerAvatars owners={booking.owners} />
      </td>

      {/* Voucher */}
      <td className="px-4 py-5">
        {showVoucherAndTasks ? (
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#7C3AED] transition-colors">
              <FileText size={13} />
            </button>
            <button className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <ChevronDown size={13} />
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">--</span>
        )}
      </td>

      {/* Tasks */}
      <td className="px-4 py-5">
        {showVoucherAndTasks ? (
          <div className="relative inline-flex items-center">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#7C3AED] transition-colors">
              {booking.taskCount === 0 ? <Plus size={13} /> : <ClipboardList size={13} />}
            </button>
            {booking.taskCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {booking.taskCount}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">--</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-5">
        <div className="flex items-center gap-1.5">
          {showApproveReject && (
            <>
              <button
                onClick={onApprove}
                className="w-7 h-7 border border-green-400 bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                title="Approve"
              >
                <Check size={13} />
              </button>
              <button
                onClick={onReject}
                className="w-7 h-7 border border-red-400 bg-red-50 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors"
                title="Reject"
              >
                <X size={13} />
              </button>
            </>
          )}

          {showPaymentBtn && (
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-[#7C3AED] transition-colors font-bold text-xs" title="Record Payment">
              ₹
            </button>
          )}

          <div className="relative">
            <button
              ref={menuBtnRef as any}
              onClick={() => setMenuOpen(v => !v)}
              className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal size={13} />
            </button>
            <RowContextMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              variant={menuVariant}
              onDelete={onDelete}
              onRestore={onRestore}
              onSendForApproval={onSendForApproval}
              anchorRef={menuBtnRef as any}
            />
          </div>
        </div>
      </td>
    </tr>
  )
}
