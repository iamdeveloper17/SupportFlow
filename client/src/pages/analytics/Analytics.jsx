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

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

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

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">Loading analytics...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-500">Workspace performance insights</p>
        </div>
        <select
          className="input w-40"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Tickets</p>
          <p className="text-3xl font-bold mt-1">
            {data.trend.reduce((s, t) => s + t.created, 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Avg First Response</p>
          <p className="text-3xl font-bold mt-1">{data.avgResponseHours}h</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Active Agents</p>
          <p className="text-3xl font-bold mt-1">{data.byAgent.length}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Ticket Trend</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="created"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Agent Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.byAgent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.categoryDist}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(e) => `${e._id} (${e.count})`}
              >
                {data.categoryDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {data.recentActivity.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-500">
                  {t.ticketNumber}
                </span>
                <span className="text-sm">{t.subject}</span>
              </div>
              <span className="text-xs text-gray-500 capitalize">{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}