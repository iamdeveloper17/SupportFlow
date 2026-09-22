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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Team Members</h1>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : agents.length === 0 ? (
        <div className="card text-center text-gray-500 py-10">No agents yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((a) => (
            <div key={a._id} className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                {a.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-gray-500 capitalize">{a.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}