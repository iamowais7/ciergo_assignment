import { Calculator, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { FINANCE_SUMMARY } from '../../data/mockData'

function formatAmount(n: number) {
  return `₹${Math.abs(n).toLocaleString('en-IN')}`
}

export default function FinancePills() {
  const { net, youGive, youGet } = FINANCE_SUMMARY
  const netPositive = net >= 0

  return (
    <div className="flex items-center gap-3">
      {/* Net */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
        <Calculator size={14} className="text-gray-500" />
        <span className="text-sm text-gray-700 font-medium">Net</span>
        <span className={`text-sm font-semibold ${netPositive ? 'text-green-600' : 'text-red-600'}`}>
          {netPositive ? '' : '-'}{formatAmount(net)}
        </span>
      </div>

      {/* You Give */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
        <ArrowUpRight size={14} className="text-red-500" />
        <span className="text-sm text-gray-700 font-medium">You Give</span>
        <span className="text-sm font-semibold text-red-600">{formatAmount(youGive)}</span>
      </div>

      {/* You Get */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
        <ArrowDownLeft size={14} className="text-green-500" />
        <span className="text-sm text-gray-700 font-medium">You Get</span>
        <span className="text-sm font-semibold text-green-600">{formatAmount(youGet)}</span>
      </div>
    </div>
  )
}
