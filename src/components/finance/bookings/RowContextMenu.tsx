import { useRef, useEffect } from 'react'
import { Pencil, Trash2, Link, Copy, RotateCcw, Send } from 'lucide-react'

interface RowContextMenuProps {
  open: boolean
  onClose: () => void
  variant: 'default' | 'pending' | 'rejected' | 'deleted'
  onEdit?: () => void
  onDelete?: () => void
  onLink?: () => void
  onDuplicate?: () => void
  onRestore?: () => void
  onSendForApproval?: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

export default function RowContextMenu({
  open, onClose, variant,
  onEdit, onDelete, onLink, onDuplicate,
  onRestore, onSendForApproval,
  anchorRef,
}: RowContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          !(anchorRef?.current?.contains(e.target as Node))) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose, anchorRef])

  if (!open) return null

  const Item = ({ icon, label, color = 'text-gray-700', onClick }: {
    icon: React.ReactNode; label: string; color?: string; onClick?: () => void
  }) => (
    <button
      onClick={() => { onClick?.(); onClose() }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${color} hover:bg-gray-50 transition-colors text-left`}
    >
      {icon}{label}
    </button>
  )

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-40 py-1.5 min-w-44 overflow-hidden"
    >
      {variant === 'deleted' ? (
        <>
          <Item icon={<RotateCcw size={14} className="text-green-500"/>} label="Restore" color="text-gray-700" onClick={onRestore} />
          <Item icon={<Copy size={14} className="text-gray-500"/>} label="Duplicate" onClick={onDuplicate} />
        </>
      ) : variant === 'rejected' ? (
        <>
          <Item icon={<Send size={14} className="text-blue-500"/>} label="Send for Approval" color="text-blue-600" onClick={onSendForApproval} />
          <div className="h-px bg-gray-100 mx-3 my-1" />
          <Item icon={<Trash2 size={14} className="text-red-500"/>} label="Delete" color="text-red-600" onClick={onDelete} />
          <Item icon={<Copy size={14} className="text-gray-500"/>} label="Duplicate" onClick={onDuplicate} />
        </>
      ) : variant === 'pending' ? (
        <>
          <Item icon={<Pencil size={14} className="text-blue-500"/>} label="Edit" color="text-blue-600" onClick={onEdit} />
          <div className="h-px bg-gray-100 mx-3 my-1" />
          <Item icon={<Trash2 size={14} className="text-red-500"/>} label="Delete" color="text-red-600" onClick={onDelete} />
          <Item icon={<Copy size={14} className="text-gray-500"/>} label="Duplicate" onClick={onDuplicate} />
        </>
      ) : (
        <>
          <Item icon={<Pencil size={14} className="text-blue-500"/>} label="Edit" color="text-blue-600" onClick={onEdit} />
          <div className="h-px bg-gray-100 mx-3 my-1" />
          <Item icon={<Trash2 size={14} className="text-red-500"/>} label="Delete" color="text-red-600" onClick={onDelete} />
          <Item icon={<Link size={14} className="text-green-500"/>} label="Link" color="text-green-600" onClick={onLink} />
          <Item icon={<Copy size={14} className="text-gray-500"/>} label="Duplicate" onClick={onDuplicate} />
        </>
      )}
    </div>
  )
}
