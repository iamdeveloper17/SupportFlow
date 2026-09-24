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
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900 mb-3 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
          Create a new ticket
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 mt-1">
          Describe the issue and our team will get back to you shortly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 sm:space-y-6">
        <div>
          <label className="input-label">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            required
            className="input"
            placeholder="Brief summary of the issue"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>

        <div>
          <label className="input-label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            className="input resize-none"
            placeholder="Describe the issue in detail... Include steps to reproduce if applicable."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <p className="text-xs text-surface-400 mt-1.5">
            The more details you provide, the faster we can help
          </p>
        </div>

        {/* Priority + Category — stacked on mobile, side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <div>
            <label className="input-label">Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🔵 Medium</option>
              <option value="high">🟠 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>
          <div>
            <label className="input-label">Category</label>
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

        {/* Buttons — stacked (reverse) on mobile, inline on desktop */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-4 border-t border-surface-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto sm:ml-auto"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}