import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/scan', label: 'Scan', icon: ScanIcon },
  { to: '/results', label: 'Plate', icon: PlateIcon },
  { to: '/dashboard', label: 'Day', icon: ChartIcon },
]

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-cream text-ink shadow-[0_0_80px_rgba(31,58,46,0.08)]">
      <div className="px-5 pb-28 pt-6">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-sand/80 bg-card/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <ul className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium ${
                    isActive ? 'bg-forest text-cream' : 'text-forest/70'
                  }`
                }
              >
                <tab.icon />
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2M17 20h2a1 1 0 0 0 1-1v-2M4 12h16" />
    </svg>
  )
}

function PlateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="13" r="7" />
      <path d="M8 6c2.5-2 5.5-2 8 0" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 19V9M12 19V5M19 19v-7" />
    </svg>
  )
}
