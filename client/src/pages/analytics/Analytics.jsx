import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios.js";

const COLORS = ["#3465ff", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/tickets/analytics?days=${days}`)
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-24" />
          ))}
        </div>
        <div className="card h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            Workspace performance insights
          </p>
        </div>
        <select
          className="input w-full sm:w-44"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card card-hover">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900">
            {data.trend.reduce((s, t) => s + t.created, 0)}
          </p>
          <p className="text-xs text-surface-500 mt-1">Total tickets</p>
        </div>

        <div className="card card-hover">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900">
            {data.avgResponseHours}h
          </p>
          <p className="text-xs text-surface-500 mt-1">Avg first response</p>
        </div>

        <div className="card card-hover">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900">
            {data.byAgent.length}
          </p>
          <p className="text-xs text-surface-500 mt-1">Active agents</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-5">
          <h2 className="font-semibold text-surface-900 text-sm sm:text-base">
            Ticket Trend
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            Tickets created per day
          </p>
        </div>
        {data.trend.length === 0 ? (
          <div className="text-center py-12 text-sm text-surface-400">
            No data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 12,
                  padding: "8px 12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#3465ff"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#3465ff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="card">
          <h2 className="font-semibold text-surface-900 mb-5 text-sm sm:text-base">
            Agent Performance
          </h2>
          {data.byAgent.length === 0 ? (
            <div className="text-center py-12 text-sm text-surface-400">
              No agent data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.byAgent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 12, color: "#fff", fontSize: 12, padding: "8px 12px" }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="total" fill="#3465ff" radius={[6, 6, 0, 0]} name="Total" />
                <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-surface-900 mb-5 text-sm sm:text-base">
            Category Distribution
          </h2>
          {data.categoryDist.length === 0 ? (
            <div className="text-center py-12 text-sm text-surface-400">
              No category data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.categoryDist}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={2}
                  label={false}
                >
                  {data.categoryDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 12, color: "#fff", fontSize: 12, padding: "8px 12px" }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4 text-sm sm:text-base">
          Recent Activity
        </h2>
        <div className="space-y-2">
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-surface-400 py-4 text-center">
              No recent activity
            </p>
          ) : (
            data.recentActivity.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between gap-3 py-2.5 border-b border-surface-100 last:border-0"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-surface-500 font-semibold shrink-0">
                    {t.ticketNumber}
                  </span>
                  <span className="text-sm text-surface-700 truncate">
                    {t.subject}
                  </span>
                </div>
                <span className="text-xs text-surface-500 capitalize shrink-0">
                  {t.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}