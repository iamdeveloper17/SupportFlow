import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out SupportFlow",
    features: [
      "1 agent",
      "100 tickets/month",
      "Email support",
      "Basic analytics",
    ],
    cta: "Current plan",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    period: "month",
    description: "For growing teams that need more",
    features: [
      "10 agents",
      "5,000 tickets/month",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
    ],
    popular: true,
    cta: "Upgrade to Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹4,999",
    period: "month",
    description: "For large organizations at scale",
    features: [
      "Unlimited agents",
      "Unlimited tickets",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "SSO & audit logs",
    ],
    cta: "Contact sales",
  },
];

export default function Billing() {
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    api
      .get("/billing")
      .then((res) => setCurrent(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (params.get("success")) {
      toast.success("Subscription activated!");
      setParams({});
    } else if (params.get("canceled")) {
      toast.error("Checkout canceled");
      setParams({});
    }
  }, [params, setParams]);

  const handleUpgrade = async (planId) => {
    try {
      const res = await api.post("/billing/checkout", { plan: planId });
      window.location.href = res.data.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start checkout");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-200 rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-4">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Simple, transparent pricing
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">
          Choose the plan that fits you
        </h1>
        <p className="text-sm sm:text-base text-surface-500">
          Current plan:{" "}
          <span className="font-semibold text-surface-900 capitalize">
            {current?.plan}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = current?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-card-hover md:scale-[1.02] border-2 border-primary-600"
                  : "bg-white border border-surface-200/70 shadow-soft hover:shadow-card-hover md:hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-soft whitespace-nowrap">
                  Most popular
                </span>
              )}

              <h3
                className={`text-lg font-bold ${
                  plan.popular ? "text-white" : "text-surface-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-xs mt-1 mb-5 ${
                  plan.popular ? "text-white/70" : "text-surface-500"
                }`}
              >
                {plan.description}
              </p>

              <div className="mb-6">
                <span
                  className={`text-3xl sm:text-4xl font-bold ${
                    plan.popular ? "text-white" : "text-surface-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    plan.popular ? "text-white/70" : "text-surface-500"
                  }`}
                >
                  /{plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.popular ? "text-white" : "text-emerald-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      className={
                        plan.popular ? "text-white/90" : "text-surface-700"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed ${
                    plan.popular
                      ? "bg-white/20 text-white"
                      : "bg-surface-100 text-surface-500"
                  }`}
                >
                  ✓ Current plan
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "bg-white text-primary-700 hover:bg-surface-100 shadow-soft"
                      : "btn-primary"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs text-surface-500">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure payments
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Cancel anytime
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          24/7 support
        </div>
      </div>
    </div>
  );
}