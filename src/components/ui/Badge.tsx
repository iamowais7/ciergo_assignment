import type { PaymentStatus } from '../../types'

interface BadgeProps {
  status: PaymentStatus | string
  className?: string
}

const statusStyles: Record<string, string> = {
  'Paid':           'bg-green-100  text-green-700  border border-green-300',
  'Partially Paid': 'bg-orange-100 text-orange-600 border border-orange-200',
  'Pending':        'bg-yellow-100 text-yellow-700 border border-yellow-300',
  'Confirmed':      'bg-blue-100   text-blue-700   border border-blue-200',
  'Cancelled':      'bg-red-100    text-red-600    border border-red-200',
  'Draft':          'bg-gray-100   text-gray-600   border border-gray-200',
}

export default function Badge({ status, className = '' }: BadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style} ${className}`}>
      {status}
    </span>
  )
}
