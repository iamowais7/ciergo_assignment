import { useState, useRef, useEffect } from 'react'
import { X, RotateCcw, ChevronDown, Search } from 'lucide-react'
import { ALL_OWNERS } from '../../../data/mockData'

interface OwnerFilterModalProps {
  open: boolean
  onClose: () => void
  selectedIds: string[]
  onApply: (ids: string[]) => void
}

function OwnerSearchPanel({
  label,
  count,
  selectedIds,
  onToggle,
  onRemove,
}: {
  label?: string
  count?: number
  selectedIds: string[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const filteredOwners = ALL_OWNERS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )
  const selectedOwners = ALL_OWNERS.filter(o => selectedIds.includes(o.id))

  function toggle(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    onToggle(id)
  }

  return (
    <div className="flex-1 min-w-0">
      {label !== undefined && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          <span className="text-xs text-gray-500">{count ?? 0} Owner(s) Selected</span>
        </div>
      )}

      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onMouseDown={e => { e.stopPropagation(); e.preventDefault(); setOpen(v => !v) }}
          className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-sm hover:border-[#7C3AED]/50 transition-colors"
        >
          <Search size={14} className="text-gray-400 shrink-0" />
          <span className="flex-1 text-left text-gray-400">Search / Select Owners</span>
          <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-999 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                ref={inputRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onMouseDown={e => e.stopPropagation()}
                placeholder="Search..."
                className="w-full text-sm outline-none px-3 py-1.5 rounded-lg border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-colors"
              />
            </div>

            <div className="max-h-44 overflow-y-auto">
              {filteredOwners.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-5">No owners found</div>
              ) : filteredOwners.map(o => (
                <div
                  key={o.id}
                  onMouseDown={e => toggle(o.id, e)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 select-none border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedIds.includes(o.id)
                        ? 'bg-[#7C3AED] border-[#7C3AED]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedIds.includes(o.id) && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{o.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedOwners.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedOwners.map(o => (
            <span
              key={o.id}
              className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 bg-white"
            >
              <X
                size={12}
                className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                onMouseDown={e => { e.stopPropagation(); onRemove(o.id) }}
              />
              {o.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OwnerFilterModal({ open, onClose, selectedIds, onApply }: OwnerFilterModalProps) {
  const [advanced, setAdvanced]       = useState(false)
  const [simpleIds, setSimpleIds]     = useState<string[]>([])
  const [primaryIds, setPrimaryIds]   = useState<string[]>([])
  const [secondaryIds, setSecondaryIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setSimpleIds([...selectedIds])
      setPrimaryIds([])
      setSecondaryIds([])
    }
  }, [open])

  const toggleSimple    = (id: string) => setSimpleIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const togglePrimary   = (id: string) => setPrimaryIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleSecondary = (id: string) => setSecondaryIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  function handleReset() {
    setSimpleIds([])
    setPrimaryIds([])
    setSecondaryIds([])
  }

  function handleApply(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    const ids = advanced ? [...new Set([...primaryIds, ...secondaryIds])] : simpleIds
    onApply(ids)
    onClose()
  }

  if (!open) return null

  const displayCount = advanced
    ? new Set([...primaryIds, ...secondaryIds]).size
    : simpleIds.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full z-10"
        style={{ maxWidth: advanced ? 740 : 540 }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-gray-900">Select Booking Owners</h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onMouseDown={e => { e.stopPropagation(); setAdvanced(v => !v) }}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  advanced ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300'
                }`}
              >
                {advanced && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">Advance Search</span>
            </label>
            <button onMouseDown={e => { e.stopPropagation(); onClose() }} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        <div className="px-6 py-5">
          {!advanced ? (
            /* Simple mode */
            <div>
              <p className="text-sm text-gray-500 mb-3">{displayCount} Owner(s) Selected</p>
              <OwnerSearchPanel
                selectedIds={simpleIds}
                onToggle={toggleSimple}
                onRemove={id => setSimpleIds(p => p.filter(x => x !== id))}
              />
            </div>
          ) : (
            /* Advanced mode */
            <div className="flex gap-6">
              <OwnerSearchPanel
                label="Primary Owner(s)"
                count={primaryIds.length}
                selectedIds={primaryIds}
                onToggle={togglePrimary}
                onRemove={id => setPrimaryIds(p => p.filter(x => x !== id))}
              />
              <div className="w-px bg-gray-200 self-stretch" />
              <OwnerSearchPanel
                label="Secondary Owner(s)"
                count={secondaryIds.length}
                selectedIds={secondaryIds}
                onToggle={toggleSecondary}
                onRemove={id => setSecondaryIds(p => p.filter(x => x !== id))}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onMouseDown={e => { e.stopPropagation(); handleReset() }}
            className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onMouseDown={handleApply}
            className="bg-[#7C3AED] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#6D28D9] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
