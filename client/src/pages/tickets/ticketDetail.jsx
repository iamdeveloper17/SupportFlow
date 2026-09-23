import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { fetchTicket, updateTicket } from "../../features/tickets/ticketSlice.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useSocket } from "../../hooks/useSocket.js";
import FileUpload from "../../components/common/FileUpload.jsx";

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

  useEffect(() => {
    dispatch(fetchTicket(id));
    loadMessages();
  }, [dispatch, id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("ticket:join", id);

    const onNew = (msg) => {
      if (msg.ticket === id || msg.ticket?._id === id) {
        setMessages((prev) => [...prev, msg]);
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
      setMessages((prev) => [...prev, res.data.data.message]);
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
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  const canUpdate = user?.role === "admin" || user?.role === "agent";

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-500">
                {ticket.ticketNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium capitalize bg-gray-100">
                {ticket.status}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium capitalize bg-gray-100">
                {ticket.priority}
              </span>
            </div>
            <h1 className="text-xl font-bold">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 mt-1">
              by {ticket.customer?.name} ·{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {canUpdate && (
            <select
              className="input w-40"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Conversation</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
          {messages.map((m) => {
            const isMe = m.sender?._id === user?._id;
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    m.isInternalNote
                      ? "bg-yellow-50 border border-yellow-200"
                      : isMe
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {m.sender?.name}
                    {m.isInternalNote && " · internal note"}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="space-y-2">
          <textarea
            rows={3}
            className="input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {canUpdate && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
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
              className="btn-primary"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}