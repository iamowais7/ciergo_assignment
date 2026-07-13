import type { Owner } from '../../types'

interface OwnerAvatarsProps {
  owners: Owner[]
  max?: number
}

export default function OwnerAvatars({ owners, max = 4 }: OwnerAvatarsProps) {
  const visible = owners.slice(0, max)
  const extra   = owners.length - max

  return (
    <div className="flex items-center">
      {visible.map((owner, i) => (
        <div
          key={owner.id}
          title={owner.name}
          className={`w-7 h-7 rounded-full border-2 ${owner.borderColor} ${owner.bgColor} ${owner.textColor} flex items-center justify-center text-[10px] font-bold cursor-default select-none transition-transform hover:scale-110 hover:z-10`}
          style={{ marginLeft: i === 0 ? 0 : -6, zIndex: visible.length - i }}
        >
          {owner.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-gray-300 bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold"
          style={{ marginLeft: -6 }}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
