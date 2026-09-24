import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTickets } from "../../features/tickets/ticketSlice.js";

const STATUS_STYLES = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-50 text-blue-600",
  high: "bg-orange-50 text-orange-600",
  urgent: "bg-red-50 text-red-600",
};

export default function TicketList() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((s) => s.tickets);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchTickets(filters));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
            Tickets
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            {pagination?.total || 0} ticket
            {pagination?.total !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Link to="/tickets/new" className="btn-primary">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">New Ticket</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input pl-10"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 sm:flex gap-3">
            <select
              className="input sm:w-40"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="input sm:w-40"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {(filters.status || filters.priority || filters.search) && (
            <button
              onClick={() =>
                setFilters({ status: "", priority: "", search: "" })
              }
              className="btn-ghost text-sm self-start sm:self-center"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-24 bg-surface-200 rounded" />
                  <div className="h-5 w-3/4 bg-surface-200 rounded" />
                  <div className="h-4 w-1/2 bg-surface-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card py-12 sm:py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-surface-900 mb-1">
            No tickets found
          </h3>
          <p className="text-sm text-surface-500 mb-6 max-w-sm mx-auto px-4">
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters to find what you're looking for."
              : "Create your first ticket to get started with customer support."}
          </p>
          <Link to="/tickets/new" className="btn-primary inline-flex">
            Create ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="card card-hover block group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-surface-500 font-semibold">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`badge border ${STATUS_STYLES[t.status]}`}
                    >
                      <span className="badge-dot bg-current opacity-70" />
                      {t.status}
                    </span>
                    <span className={`badge ${PRIORITY_STYLES[t.priority]}`}>
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="font-semibold text-surface-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
                    {t.subject}
                  </h3>
                  <p className="text-sm text-surface-500 truncate">
                    {t.description}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs text-surface-500 shrink-0 sm:pl-4">
                  <p className="font-medium text-surface-700">
                    {t.customer?.name}
                  </p>
                  <p className="mt-0.5">
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="text-xs sm:text-sm text-surface-500">
            Page <strong className="text-surface-900">{pagination.page}</strong>{" "}
            of {pagination.pages} · {pagination.total} total
          </span>
        </div>
      )}
    </div>
  );
}