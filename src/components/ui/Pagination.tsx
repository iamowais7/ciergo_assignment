import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  label?: string
}

const PAGE_SIZES = [6, 10, 20, 50, 100]

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange, label = 'bookings' }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, total)

  function getPages(): (number | '...')[] {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      {/* Left: rows per page */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1) }}
          className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-white cursor-pointer"
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Center: showing X of Y */}
      <p className="text-sm text-gray-500">
        Showing {start}-{end} of {total} {label}
      </p>

      {/* Right: page nav */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-sm text-gray-400">…</span>
            : <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-[#7C3AED] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
