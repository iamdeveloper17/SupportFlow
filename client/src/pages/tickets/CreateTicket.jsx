import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createTicket } from "../../features/tickets/ticketSlice.js";

export default function CreateTicket() {
  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createTicket(form));
    setLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Ticket created!");
      navigate(`/tickets/${result.payload._id}`);
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Subject *</label>
          <input
            required
            className="input"
            placeholder="Brief summary of the issue"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description *</label>
          <textarea
            required
            rows={6}
            className="input"
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="general">General</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Ticket"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}