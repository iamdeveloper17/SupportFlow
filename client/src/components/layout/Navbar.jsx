import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="h-14 sm:h-16 bg-white/80 backdrop-blur-lg border-b border-surface-200/70 sticky top-0 z-40 shrink-0">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-surface-900">
                SupportFlow
              </span>
              <span className="text-[10px] font-medium text-surface-500 tracking-wide uppercase">
                Helpdesk
              </span>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status pill (desktop only) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft" />
            <span className="text-xs font-medium text-green-700">All systems</span>
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-0.5 sm:p-1 sm:pl-3 sm:pr-1 rounded-full hover:bg-surface-100 transition-colors"
            >
              <span className="text-sm font-medium text-surface-700 hidden sm:block">
                {user?.name?.split(" ")[0]}
              </span>
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-soft">
                {initials}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-surface-200/70 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}