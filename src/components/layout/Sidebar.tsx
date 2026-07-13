import { LayoutDashboard, Tag, Globe, CalendarDays, ClipboardCheck, FileText, PieChart, Users, BarChart, Settings, ChevronRight, PanelLeftClose } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard',  icon: LayoutDashboard },
  { label: 'Sales',      icon: Tag,             hasChildren: true },
  { label: 'Operations', icon: Globe },
  { label: 'Bookings',   icon: CalendarDays },
  { label: 'Approvals',  icon: ClipboardCheck,  hasChildren: true },
  { label: 'Content',    icon: FileText },
  { label: 'Finance',    icon: PieChart,         hasChildren: true, path: '/finance/bookings' },
  { label: 'Directory',  icon: Users,            hasChildren: true },
  { label: 'Reports',    icon: BarChart },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className="w-56 min-h-screen bg-white flex flex-col shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-10">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#E2E1E1]">
        <span className="text-2xl font-bold text-[#7135AD] tracking-tight">ciergo</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center text-[#818181] hover:text-[#7135AD] transition-colors"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto px-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, hasChildren, path }) => {
          const active = label === 'Finance' && location.pathname.startsWith('/finance')
          return (
            <Link
              key={label}
              to={path ?? '#'}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors rounded-2xl ${
                active
                  ? 'bg-[#F5F3FF] text-[#7135AD] font-semibold'
                  : 'text-[#818181] hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={20} className={active ? 'text-[#7135AD] shrink-0' : 'text-[#9CA3AF] shrink-0'} />
              <span className="flex-1">{label}</span>
              {hasChildren && (
                <ChevronRight size={13} className={active ? 'text-[#7135AD]/60' : 'text-[#C4C4C4]'} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-[#E2E1E1] py-3 px-3">
        <Link
          to="#"
          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#818181] hover:bg-gray-50 hover:text-gray-700 rounded-2xl transition-colors"
        >
          <Settings size={20} className="text-[#9CA3AF] shrink-0" />
          <span className="flex-1">Settings</span>
          <ChevronRight size={13} className="text-[#C4C4C4]" />
        </Link>
      </div>
    </aside>
  )
}
