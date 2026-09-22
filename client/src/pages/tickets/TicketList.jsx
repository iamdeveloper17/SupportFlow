import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTickets } from "../../features/tickets/ticketSlice.js";

export default function TicketList() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((s) => s.tickets);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  useEffect(() => {
    dispatch(fetchTickets(filters));
  }, [dispatch, filters]);

  const statusColors = {
    open: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Link to="/tickets/new" className="btn-primary">
          ➕ New Ticket
        </Link>
      </div>

      <div className="card flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-[200px]"
          placeholder="Search by subject..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="input w-40"
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
          className="input w-40"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : list.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">
          No tickets found
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="card block hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[t.status]}`}
                    >
                      {t.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${priorityColors[t.priority]}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{t.subject}</h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {t.description}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500 shrink-0">
                  <p>{t.customer?.name}</p>
                  <p>{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
        </div>
      )}
    </div>
  );
}