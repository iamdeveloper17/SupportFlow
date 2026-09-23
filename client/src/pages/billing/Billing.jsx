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
    features: ["1 agent", "100 tickets/month", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    period: "month",
    features: [
      "10 agents",
      "5,000 tickets/month",
      "Priority support",
      "Analytics",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹4,999",
    period: "month",
    features: [
      "Unlimited agents",
      "Unlimited tickets",
      "24/7 support",
      "Custom integrations",
    ],
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
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-sm text-gray-500">
          Current plan:{" "}
          <span className="font-semibold capitalize">{current?.plan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = current?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`card relative ${
                plan.popular ? "border-2 border-primary-500" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="my-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full ${isCurrent ? "btn-secondary" : "btn-primary"}`}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}