import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="text-xl font-bold text-gray-900">SupportFlow</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}