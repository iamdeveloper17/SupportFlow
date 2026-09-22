import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { registerUser, clearError } from "../../features/auth/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    workspaceName: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Workspace created!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            S
          </div>
          <h1 className="text-2xl font-bold">Create your workspace</h1>
          <p className="text-gray-500 text-sm mt-1">
            Start managing tickets in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Your name</label>
            <input
              required
              className="input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Workspace name</label>
            <input
              required
              className="input"
              placeholder="Acme Corp"
              value={form.workspaceName}
              onChange={(e) => setForm({ ...form, workspaceName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              required
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create workspace"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}