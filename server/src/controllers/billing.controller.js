// import asyncHandler from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import stripe from "../config/stripe.js";
// import Workspace from "../models/Workspace.model.js";

// export const createCheckoutSession = asyncHandler(async (req, res) => {
//   const { plan } = req.body;
//   const workspace = await Workspace.findById(req.user.workspace);

//   if (!workspace) throw new ApiError(404, "Workspace not found");

//   const priceId =
//     plan === "pro"
//       ? process.env.STRIPE_PRO_PRICE_ID
//       : process.env.STRIPE_ENTERPRISE_PRICE_ID;

//   const session = await stripe.checkout.sessions.create({
//     mode: "subscription",
//     payment_method_types: ["card"],
//     line_items: [{ price: priceId, quantity: 1 }],
//     customer_email: req.user.email,
//     metadata: {
//       workspaceId: workspace._id.toString(),
//       plan,
//     },
//     success_url: `${process.env.CLIENT_URL}/billing?success=true`,
//     cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
//   });

//   res.status(200).json(new ApiResponse(200, { url: session.url }, "Checkout created"));
// });

// export const handleWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const workspaceId = session.metadata.workspaceId;
//       const plan = session.metadata.plan;

//       await Workspace.findByIdAndUpdate(workspaceId, {
//         plan,
//         "subscription.stripeCustomerId": session.customer,
//         "subscription.stripeSubscriptionId": session.subscription,
//         "subscription.status": "active",
//       });

//       console.log(`✅ Workspace ${workspaceId} upgraded to ${plan}`);
//     }

//     if (event.type === "customer.subscription.deleted") {
//       const subscription = event.data.object;
//       await Workspace.findOneAndUpdate(
//         { "subscription.stripeSubscriptionId": subscription.id },
//         { plan: "free", "subscription.status": "canceled" }
//       );
//     }
//   } catch (err) {
//     console.error("Webhook processing error:", err);
//     return res.status(500).send("Webhook processing failed");
//   }

//   res.json({ received: true });
// };

// export const getBillingInfo = asyncHandler(async (req, res) => {
//   const workspace = await Workspace.findById(req.user.workspace);
//   res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         plan: workspace.plan,
//         status: workspace.subscription?.status || "active",
//       },
//       "Billing info"
//     )
//   );
// });

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import stripe from "../config/stripe.js";
import Workspace from "../models/Workspace.model.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  if (!stripe) {
    throw new ApiError(
      503,
      "Billing is not configured. Please add Stripe keys in server/.env"
    );
  }

  const { plan } = req.body;
  const workspace = await Workspace.findById(req.user.workspace);

  if (!workspace) throw new ApiError(404, "Workspace not found");

  const priceId =
    plan === "pro"
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_ENTERPRISE_PRICE_ID;

  if (!priceId || priceId === "price_xxxxx") {
    throw new ApiError(
      503,
      "Stripe price IDs not configured. Add them in server/.env"
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: req.user.email,
    metadata: {
      workspaceId: workspace._id.toString(),
      plan,
    },
    success_url: `${process.env.CLIENT_URL}/billing?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
  });

  res.status(200).json(new ApiResponse(200, { url: session.url }, "Checkout created"));
});

export const handleWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const workspaceId = session.metadata.workspaceId;
      const plan = session.metadata.plan;

      await Workspace.findByIdAndUpdate(workspaceId, {
        plan,
        "subscription.stripeCustomerId": session.customer,
        "subscription.stripeSubscriptionId": session.subscription,
        "subscription.status": "active",
      });

      console.log(`✅ Workspace ${workspaceId} upgraded to ${plan}`);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await Workspace.findOneAndUpdate(
        { "subscription.stripeSubscriptionId": subscription.id },
        { plan: "free", "subscription.status": "canceled" }
      );
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).send("Webhook processing failed");
  }

  res.json({ received: true });
};

export const getBillingInfo = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.user.workspace);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        plan: workspace.plan,
        status: workspace.subscription?.status || "active",
        billingEnabled: !!stripe,
      },
      "Billing info"
    )
  );
});