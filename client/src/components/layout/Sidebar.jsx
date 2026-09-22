import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/tickets", label: "Tickets", icon: "🎫" },
    ...(user?.role !== "customer"
      ? [
          { to: "/tickets/new", label: "New Ticket", icon: "➕" },
          { to: "/agents", label: "Agents", icon: "👥" },
        ]
      : [{ to: "/tickets/new", label: "New Ticket", icon: "➕" }]),
  ];

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/tickets"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}