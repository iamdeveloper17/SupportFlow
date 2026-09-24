import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStats } from "../../features/tickets/ticketSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { stats } = useSelector((s) => s.tickets);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const statusConfig = {
    open: { color: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
    pending: { color: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    resolved: { color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    closed: { color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  };

  const priorityConfig = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-50 text-blue-600",
    high: "bg-orange-50 text-orange-600",
    urgent: "bg-red-50 text-red-600",
  };

  const totalTickets = stats?.byStatus?.reduce((sum, s) => sum + s.count, 0) || 0;
  const openCount = stats?.byStatus?.find((s) => s._id === "open")?.count || 0;
  const resolvedCount =
    stats?.byStatus?.find((s) => s._id === "resolved")?.count || 0;
  const urgentCount =
    stats?.byPriority?.find((s) => s._id === "urgent")?.count || 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const kpis = [
    {
      label: "Total tickets",
      value: totalTickets,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
      ),
      bg: "bg-primary-50",
      badge: "Total",
      badgeColor: "text-primary-600 bg-primary-50",
    },
    {
      label: "Open tickets",
      value: openCount,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      bg: "bg-blue-50",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
    {
      label: "Urgent",
      value: urgentCount,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-5 sm:p-8">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">
            {greeting()} 👋
          </p>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-white/70 text-xs sm:text-sm max-w-lg">
            Here's what's happening in your workspace today.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white text-surface-900 text-xs sm:text-sm font-semibold rounded-xl hover:bg-surface-100 transition-colors shadow-soft"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Ticket
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white/10 backdrop-blur text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card card-hover p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}
              >
                {kpi.icon}
              </div>
              {kpi.badge && (
                <span
                  className={`text-[10px] font-bold ${kpi.badgeColor} px-2 py-0.5 rounded-full uppercase`}
                >
                  {kpi.badge}
                </span>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-surface-900">
              {kpi.value}
            </p>
            <p className="text-xs text-surface-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 text-sm sm:text-base">
              Tickets by Status
            </h2>
            <span className="text-xs text-surface-500">Live</span>
          </div>
          <div className="space-y-1">
            {stats?.byStatus?.length ? (
              stats.byStatus.map((s) => {
                const cfg = statusConfig[s._id] || statusConfig.open;
                return (
                  <div
                    key={s._id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${cfg.color} flex items-center justify-center`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-500 capitalize">
                        {s._id}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-surface-900">
                        {s.count}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-surface-700">
                  No tickets yet
                </p>
                <Link
                  to="/tickets/new"
                  className="mt-3 btn-primary text-xs px-3 py-1.5"
                >
                  Create ticket
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 text-sm sm:text-base">
              Tickets by Priority
            </h2>
            <span className="text-xs text-surface-500">Live</span>
          </div>
          <div className="space-y-1">
            {stats?.byPriority?.length ? (
              stats.byPriority.map((s) => {
                const cfg = priorityConfig[s._id] || priorityConfig.medium;
                return (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  >
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg}`}
                    >
                      {s._id}
                    </span>
                    <span className="font-bold text-surface-900">{s.count}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-surface-400 py-8 text-center">
                No tickets yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}