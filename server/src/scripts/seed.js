import mongoose from "mongoose";
import User from "../models/User.model.js";
import Workspace from "../models/Workspace.model.js";
import Ticket from "../models/Ticket.model.js";
import Message from "../models/Message.model.js";

const DEMO_TICKETS = [
  { subject: "Payment failed on checkout", priority: "urgent", category: "billing", status: "open" },
  { subject: "App crashes on Android 14", priority: "high", category: "technical", status: "pending" },
  { subject: "How to add team members?", priority: "medium", category: "general", status: "resolved" },
  { subject: "Invoice not received for last month", priority: "low", category: "billing", status: "open" },
  { subject: "Login button not working on Safari", priority: "high", category: "technical", status: "pending" },
  { subject: "Feature request: Dark mode support", priority: "low", category: "general", status: "closed" },
  { subject: "Data export takes too long", priority: "medium", category: "technical", status: "open" },
  { subject: "Refund not processed after 7 days", priority: "urgent", category: "billing", status: "pending" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Workspace.deleteMany({}),
      Ticket.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log("🧹 Cleaned existing data");

    const admin = await User.create({
      name: "Amit Kumar",
      email: "amitsir1355@gmail.com",
      password: "123456",
      role: "admin",
    });
    const agent = await User.create({
      name: "Priya Sharma",
      email: "priya@demo.com",
      password: "123456",
      role: "agent",
    });
    const customer = await User.create({
      name: "Rahul Verma",
      email: "rahul@demo.com",
      password: "123456",
      role: "customer",
    });
    console.log("👥 Created 3 users");

    const workspace = await Workspace.create({
      name: "Acme Corp",
      slug: "acme-corp",
      owner: admin._id,
      plan: "pro",
    });

    for (const u of [admin, agent, customer]) {
      u.workspace = workspace._id;
      await u.save();
    }
    console.log("🏢 Created workspace: Acme Corp");

    for (let i = 0; i < DEMO_TICKETS.length; i++) {
      const t = DEMO_TICKETS[i];
      const ticket = await Ticket.create({
        ticketNumber: `TKT-${String(i + 1).padStart(4, "0")}`,
        subject: t.subject,
        description: `Customer reported: ${t.subject}. Please investigate and resolve as soon as possible.`,
        workspace: workspace._id,
        customer: customer._id,
        assignedTo: t.status === "open" ? null : agent._id,
        status: t.status,
        priority: t.priority,
        category: t.category,
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        firstResponseAt: t.status !== "open" ? new Date(Date.now() - 2 * 60 * 60 * 1000) : null,
      });

      await Message.create({
        ticket: ticket._id,
        workspace: workspace._id,
        sender: customer._id,
        content: ticket.description,
      });

      if (t.status !== "open") {
        await Message.create({
          ticket: ticket._id,
          workspace: workspace._id,
          sender: agent._id,
          content: "Thanks for reaching out! We're investigating this issue and will get back to you shortly.",
        });
      }
    }

    console.log(`🎫 Created ${DEMO_TICKETS.length} tickets with messages`);
    console.log("\n🎉 SEED COMPLETE!\n");
    console.log("═══════════════════════════════════");
    console.log("📝 Login Credentials");
    console.log("═══════════════════════════════════");
    console.log("   Admin:    amitsir1355@gmail.com / 123456");
    console.log("   Agent:    priya@demo.com / 123456");
    console.log("   Customer: rahul@demo.com / 123456");
    console.log("═══════════════════════════════════\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();