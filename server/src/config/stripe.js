// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-06-20",
// });

// export default stripe;

import Stripe from "stripe";

let stripe = null;

if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith("sk_")
) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
    console.log("✅ Stripe initialized");
  } catch (err) {
    console.log("⚠️  Stripe not initialized:", err.message);
  }
} else {
  console.log("⚠️  Stripe disabled (no valid STRIPE_SECRET_KEY)");
}

export default stripe;