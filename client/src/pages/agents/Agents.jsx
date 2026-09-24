import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tickets/agents")
      .then((res) => setAgents(res.data.data.agents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
            Team Members
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            {agents.length} member{agents.length !== 1 ? "s" : ""} in your
            workspace
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-surface-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-surface-200 rounded" />
                  <div className="h-3 w-20 bg-surface-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="card py-12 sm:py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-surface-900 mb-1">
            No team members yet
          </h3>
          <p className="text-sm text-surface-500">
            Invite your team to start collaborating
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {agents.map((a) => (
            <div key={a._id} className="card card-hover group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-glow shrink-0 group-hover:scale-105 transition-transform">
                  {getInitials(a.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-surface-900 truncate text-sm sm:text-base">
                    {a.name}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    {a.email}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      a.role === "admin"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {a.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}