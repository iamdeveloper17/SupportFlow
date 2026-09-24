import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </svg>
  ),
  tickets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    </svg>
  ),
  newTicket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 6-6" />
    </svg>
  ),
  agents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  billing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const links =
    user?.role !== "customer"
      ? [
          { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
          { to: "/tickets", label: "Tickets", icon: "tickets" },
          { to: "/tickets/new", label: "New Ticket", icon: "newTicket" },
          { to: "/analytics", label: "Analytics", icon: "analytics" },
          { to: "/agents", label: "Agents", icon: "agents" },
          { to: "/billing", label: "Billing", icon: "billing" },
        ]
      : [
          { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
          { to: "/tickets", label: "My Tickets", icon: "tickets" },
          { to: "/tickets/new", label: "New Ticket", icon: "newTicket" },
        ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-50
          w-72 sm:w-64 bg-white border-r border-surface-200/70 
          flex flex-col shrink-0 overflow-y-auto
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="font-bold text-surface-900">SupportFlow</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-500 hover:bg-surface-100"
            aria-label="Close menu"
          >
            <span className="w-5 h-5 block">{ICONS.close}</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1">
          <p className="px-3 pt-3 pb-2 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
            Workspace
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/tickets"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-soft"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? "text-primary-600"
                        : "text-surface-400 group-hover:text-surface-600"
                    }`}
                  >
                    {ICONS[link.icon]}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade card */}
        <div className="p-3 hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl gradient-dark p-4">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-500/30 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1">
                Upgrade
              </p>
              <p className="text-sm text-white/70 leading-snug mb-3">
                Unlock unlimited agents & analytics
              </p>
              <button className="w-full py-1.5 bg-white text-surface-900 text-xs font-semibold rounded-lg hover:bg-surface-100 transition-colors">
                View plans
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}