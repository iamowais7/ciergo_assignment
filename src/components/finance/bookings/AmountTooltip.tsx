interface AmountTooltipProps {
  customer: number
  vendor: number
}

export default function AmountTooltip({ customer, vendor }: AmountTooltipProps) {
  const showBoth = customer > 0 && vendor > 0
  const single = customer > 0 ? customer : vendor

  if (customer === 0 && vendor === 0) return null

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white rounded-xl px-4 py-3 z-50 pointer-events-none shadow-xl text-center min-w-40">
      <div className="text-[10px] font-semibold uppercase tracking-widest underline mb-2 text-gray-300">Pending Amount</div>
      {showBoth ? (
        <>
          <div className="text-xs font-medium">Customer : ₹{customer.toLocaleString('en-IN')}</div>
          <div className="text-xs font-medium">Vendor : ₹{vendor.toLocaleString('en-IN')}</div>
        </>
      ) : (
        <div className="text-xs font-medium">₹{single.toLocaleString('en-IN')}</div>
      )}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
    </div>
  )
}
