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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening in your workspace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Tickets by Status</h2>
          <div className="space-y-2">
            {stats?.byStatus?.length ? (
              stats.byStatus.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[s._id]}`}
                  >
                    {s._id}
                  </span>
                  <span className="font-bold">{s.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No tickets yet</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Tickets by Priority</h2>
          <div className="space-y-2">
            {stats?.byPriority?.length ? (
              stats.byPriority.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[s._id]}`}
                  >
                    {s._id}
                  </span>
                  <span className="font-bold">{s.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No tickets yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="flex gap-3">
          <Link to="/tickets/new" className="btn-primary">
            ➕ Create Ticket
          </Link>
          <Link to="/tickets" className="btn-secondary">
            View All Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}