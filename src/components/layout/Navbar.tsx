import { Bell, Search, PanelLeftOpen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  searchValue?: string
  onSearch?: (q: string) => void
  sidebarOpen?: boolean
  onOpenSidebar?: () => void
}

function getBreadcrumbs(path: string) {
  if (path.includes('/calendar')) {
    return [
      { label: 'Finance', href: '/finance/bookings' },
      { label: 'Bookings', href: '/finance/bookings' },
      { label: 'Booking Calendar', active: true },
    ]
  }
  return [
    { label: 'Finance', href: '/finance/bookings' },
    { label: 'Bookings', active: true },
  ]
}

export default function Navbar({ searchValue = '', onSearch, sidebarOpen = true, onOpenSidebar }: NavbarProps) {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <nav className="h-[82px] flex items-center justify-between px-6 gap-6 shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        {!sidebarOpen && (
          <>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 bg-white">
              <span className="text-xl font-bold text-[#7135AD] tracking-tight">ciergo</span>
              <button
                onClick={onOpenSidebar}
                className="flex items-center justify-center text-[#818181] hover:text-[#7135AD] transition-colors"
                title="Open sidebar"
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
            <span className="text-[#414141] text-base">/</span>
          </>
        )}
        <Link to="/" className="text-[#414141] hover:text-[#7135AD] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <polyline points="9 21 9 12 15 12 15 21"/>
          </svg>
        </Link>
        {breadcrumbs.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-[#414141] text-base">/</span>
            {item.active ? (
              <span className="text-[#7135AD] text-sm font-medium">{item.label}</span>
            ) : (
              <Link to={item.href!} className="text-[#414141] text-sm font-medium hover:text-[#7135AD] transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-[450px]">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 h-10 border border-[#E2E1E1]/80">
          <Search size={16} className="text-[#818181] shrink-0" />
          <input
            className="bg-transparent text-gray-700 text-sm flex-1 outline-none placeholder-[#9CA3AF] min-w-0"
            placeholder="Search or type command..."
            value={searchValue}
            onChange={e => onSearch?.(e.target.value)}
          />
          {searchValue ? (
            <button
              onClick={() => onSearch?.('')}
              className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
            >
              ✕
            </button>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="text-[10px] text-[#9CA3AF] font-medium bg-[#F3F3F3] border border-[#E2E1E1] rounded px-1.5 py-0.5">⌘</kbd>
              <kbd className="text-[10px] text-[#9CA3AF] font-medium bg-[#F3F3F3] border border-[#E2E1E1] rounded px-1.5 py-0.5">K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="relative">
          <Bell size={22} className="text-[#818181] cursor-pointer hover:text-[#7135AD] transition-colors" strokeWidth={1.5} />
          <span className="absolute -top-1.5 -right-1.5 bg-[#EB382B] text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">9</span>
        </div>
        <div className="w-px h-7 bg-[#E2E1E1]" />
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold ring-[1.5px] ring-[#7135AD]">YM</div>
          <div>
            <div className="text-sm font-semibold text-[#020202] leading-tight">Yash Manocha</div>
            <div className="text-xs text-[#818181]">Sales Lead</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
