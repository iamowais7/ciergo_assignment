import { useRef, useEffect } from 'react'
import { Download, GitMerge, Trash2 } from 'lucide-react'

interface BulkActionsMenuProps {
  open: boolean
  onClose: () => void
}

export default function BulkActionsMenu({ open, onClose }: BulkActionsMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open) return null

  const Item = ({ icon, label, color = 'text-gray-700' }: { icon: React.ReactNode; label: string; color?: string }) => (
    <button onClick={onClose} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${color} hover:bg-gray-50 transition-colors`}>
      {icon}{label}
    </button>
  )

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-40 py-1.5 min-w-40 overflow-hidden">
      <Item icon={<Download size={14} className="text-blue-500"/>} label="Download" color="text-blue-600" />
      <div className="h-px bg-gray-100 mx-3 my-1" />
      <Item icon={<GitMerge size={14} className="text-gray-500"/>} label="Merge" />
      <div className="h-px bg-gray-100 mx-3 my-1" />
      <Item icon={<Trash2 size={14} className="text-red-500"/>} label="Delete" color="text-red-600" />
    </div>
  )
}
