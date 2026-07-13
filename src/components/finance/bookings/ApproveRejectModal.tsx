interface ApproveRejectModalProps {
  open: boolean
  type: 'approve' | 'reject'
  bookingId: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ApproveRejectModal({ open, type, bookingId, onConfirm, onCancel }: ApproveRejectModalProps) {
  if (!open) return null

  const isApprove = type === 'approve'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full z-10">
        <p className="text-base text-gray-800 text-center leading-relaxed mb-6">
          Are you sure you want to {isApprove ? 'approve' : 'reject'} this booking with ID{' '}
          <strong>'{bookingId}'</strong>?
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${
              isApprove ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isApprove ? 'Yes, Approve' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}
