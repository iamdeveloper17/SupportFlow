import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { fetchTicket, updateTicket } from "../../features/tickets/ticketSlice.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useSocket } from "../../hooks/useSocket.js";
import FileUpload from "../../components/common/FileUpload.jsx";

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

export default function TicketDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { current: ticket } = useSelector((s) => s.tickets);
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const addMessageSafe = (msg) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  useEffect(() => {
    dispatch(fetchTicket(id));
    loadMessages();
  }, [dispatch, id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("ticket:join", id);

    const onNew = (msg) => {
      if (msg.ticket === id || msg.ticket?._id === id) {
        addMessageSafe(msg);
      }
    };
    socket.on("message:new", onNew);

    return () => {
      socket.emit("ticket:leave", id);
      socket.off("message:new", onNew);
    };
  }, [socket, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await api.get(`/tickets/${id}/messages`);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/tickets/${id}/messages`, {
        content: newMessage,
        isInternalNote: isInternal,
      });
      addMessageSafe(res.data.data.message);
      setNewMessage("");
      setIsInternal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status) => {
    const res = await dispatch(updateTicket({ id, data: { status } }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Status updated");
    }
  };

  if (!ticket) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="card">
          <div className="h-4 w-24 bg-surface-200 rounded mb-3" />
          <div className="h-6 w-2/3 bg-surface-200 rounded mb-2" />
          <div className="h-4 w-48 bg-surface-100 rounded" />
        </div>
        <div className="card h-64" />
      </div>
    );
  }

  const canUpdate = user?.role === "admin" || user?.role === "agent";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-mono text-surface-500 font-semibold">
                {ticket.ticketNumber}
              </span>
              <span className={`badge border ${STATUS_STYLES[ticket.status]}`}>
                <span className="badge-dot bg-current opacity-70" />
                {ticket.status}
              </span>
              <span className={`badge ${PRIORITY_STYLES[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-surface-900 mb-2 break-words">
              {ticket.subject}
            </h1>
            <div className="flex items-center gap-2 text-xs text-surface-500 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {ticket.customer?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-surface-700">
                  {ticket.customer?.name}
                </span>
              </div>
              <span className="hidden sm:inline">·</span>
              <span>
                {new Date(ticket.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {canUpdate && (
            <div className="w-full sm:w-auto">
              <label className="input-label">Status</label>
              <select
                className="input sm:w-36"
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="card flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-surface-900 text-sm sm:text-base">
              Conversation
            </h2>
            <span className="badge bg-primary-50 text-primary-700 text-[10px]">
              {messages.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            <span className="text-xs text-surface-500 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] sm:max-h-[420px] overflow-y-auto mb-4 pr-1 sm:pr-2">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-surface-500">No messages yet</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender?._id === user?._id;
              const initials = m.sender?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={m._id}
                  className={`flex gap-2 sm:gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isMe
                        ? "gradient-primary text-white"
                        : "bg-surface-200 text-surface-700"
                    }`}
                  >
                    {initials}
                  </div>

                  <div
                    className={`flex-1 max-w-[85%] sm:max-w-[75%] ${
                      isMe ? "text-right" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-semibold text-surface-700 ${
                          isMe ? "ml-auto" : ""
                        }`}
                      >
                        {isMe ? "You" : m.sender?.name}
                      </span>
                      {m.isInternalNote && (
                        <span className="badge bg-amber-50 text-amber-700 text-[10px]">
                          Internal
                        </span>
                      )}
                    </div>
                    <div
                      className={`inline-block rounded-2xl px-3.5 py-2.5 text-sm text-left break-words max-w-full ${
                        m.isInternalNote
                          ? "bg-amber-50 border border-amber-200 text-surface-800"
                          : isMe
                          ? "bg-primary-600 text-white"
                          : "bg-surface-100 text-surface-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed break-words">
                        {m.content}
                      </div>
                    </div>
                    <div
                      className={`text-[10px] text-surface-400 mt-1.5 ${
                        isMe ? "text-right" : ""
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-surface-200 pt-4 space-y-3"
        >
          <textarea
            rows={3}
            className="input resize-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {canUpdate && (
                <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  Internal note
                </label>
              )}
              <FileUpload
                onUploaded={(f) =>
                  setNewMessage((m) => `${m}\n📎 ${f.name}: ${f.url}`)
                }
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="btn-primary w-full sm:w-auto"
            >
              {sending ? "Sending..." : "Send"}
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}