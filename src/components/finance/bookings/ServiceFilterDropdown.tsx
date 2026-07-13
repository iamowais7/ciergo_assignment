import { useState, useRef, useEffect } from 'react'
import { RotateCcw, Plane, Building2, Bus, FileCheck, Activity, Ticket, Shield, MoreHorizontal, Filter, Globe } from 'lucide-react'
import type { ServiceType } from '../../../types'

const OTHER_SERVICES: { type: ServiceType; label: string; icon: React.ReactNode }[] = [
  { type: 'Flight',           label: 'Flight',              icon: <Plane size={13} /> },
  { type: 'Accommodation',    label: 'Accommodation',       icon: <Building2 size={13} /> },
  { type: 'Transportation',   label: 'Transportation (Land)',icon: <Bus size={13} /> },
  { type: 'Ticket',           label: 'Ticket (Attraction)', icon: <Ticket size={13} /> },
  { type: 'Activity',         label: 'Activity',            icon: <Activity size={13} /> },
  { type: 'Visa',             label: 'Visa',                icon: <FileCheck size={13} /> },
  { type: 'Travel Insurance', label: 'Travel Insurance',    icon: <Shield size={13} /> },
  { type: 'Others',           label: 'Others',              icon: <MoreHorizontal size={13} /> },
]

interface ServiceFilterDropdownProps {
  selected: ServiceType[]
  onChange: (s: ServiceType[]) => void
}

export default function ServiceFilterDropdown({ selected, onChange }: ServiceFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<ServiceType[]>(selected)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const otherTypes   = OTHER_SERVICES.map(s => s.type)
  const allOther     = otherTypes.every(t => local.includes(t))
  const allLimitless = local.includes('Limitless')
  const allSelected  = allOther && allLimitless

  function toggleService(type: ServiceType) {
    setLocal(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  function toggleOtherGroup() {
    if (allOther) setLocal(prev => prev.filter(t => !otherTypes.includes(t)))
    else setLocal(prev => [...new Set([...prev, ...otherTypes])])
  }

  function toggleLimitless() {
    setLocal(prev => prev.includes('Limitless') ? prev.filter(t => t !== 'Limitless') : [...prev, 'Limitless'])
  }

  function handleApply() { onChange(local); setOpen(false) }
  function handleReset() { setLocal([]); onChange([]) }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`p-1 rounded-md transition-colors ${open || selected.length > 0 ? 'text-[#7C3AED] bg-purple-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
      >
        <Filter size={13} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-60 overflow-hidden flex flex-col">
          {/* Scrollable items */}
          <div className="overflow-y-auto max-h-72 p-3 pb-2">
            {/* Group: OTHER SERVICES */}
            <div className="mb-1">
              <div
                className="flex items-center gap-2 px-1 py-1.5 cursor-pointer hover:bg-gray-50 rounded-lg"
                onMouseDown={e => { e.preventDefault(); toggleOtherGroup() }}
              >
                <Checkbox checked={allOther} />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Other Services</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                {OTHER_SERVICES.map(({ type, label, icon }) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 px-1 py-1.5 cursor-pointer hover:bg-gray-50 rounded-lg"
                    onMouseDown={e => { e.preventDefault(); toggleService(type) }}
                  >
                    <Checkbox checked={local.includes(type)} />
                    <span className="text-gray-400 shrink-0">{icon}</span>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group: LIMITLESS */}
            <div className="border-t border-gray-100 pt-1">
              <div
                className="flex items-center gap-2 px-1 py-1.5 cursor-pointer hover:bg-gray-50 rounded-lg"
                onMouseDown={e => { e.preventDefault(); toggleLimitless() }}
              >
                <Checkbox checked={allLimitless} />
                <span className="text-gray-400 shrink-0"><Globe size={13} /></span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Limitless</span>
              </div>
            </div>
          </div>

          {/* Pinned footer */}
          <div className="border-t border-gray-100 px-3 py-2.5 flex items-center justify-between bg-white">
            <button
              onMouseDown={e => { e.preventDefault(); allSelected ? setLocal([]) : setLocal([...otherTypes, 'Limitless']) }}
              className="text-xs text-gray-500 hover:text-[#7C3AED] transition-colors"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            <div className="flex items-center gap-2">
              <button
                onMouseDown={e => { e.preventDefault(); handleReset() }}
                className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors"
              >
                <RotateCcw size={12} />
              </button>
              <button
                onMouseDown={e => { e.preventDefault(); handleApply() }}
                className="bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#6D28D9] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300'}`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )
}
