import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const baseTemplate = (title, content, ctaText, ctaUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .header { background: #2563eb; color: #fff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .body { padding: 28px 24px; color: #334155; line-height: 1.6; }
    .body h2 { color: #0f172a; font-size: 18px; margin-top: 0; }
    .btn { display: inline-block; background: #2563eb; color: #fff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>SupportFlow</h1></div>
    <div class="body">
      <h2>${title}</h2>
      ${content}
      ${ctaUrl ? `<a href="${ctaUrl}" class="btn">${ctaText}</a>` : ""}
    </div>
    <div class="footer">© ${new Date().getFullYear()} SupportFlow. All rights reserved.</div>
  </div>
</body>
</html>
`;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
    throw err;
  }
};

export const sendTicketCreatedEmail = async (ticket, customer) => {
  await sendEmail({
    to: customer.email,
    subject: `Ticket ${ticket.ticketNumber} created`,
    html: baseTemplate(
      `Your ticket has been created`,
      `<p>Hi ${customer.name},</p>
       <p>We've received your ticket <strong>${ticket.ticketNumber}</strong> — "${ticket.subject}".</p>
       <p>Our team will respond within <strong>24 hours</strong>.</p>`,
      "View Ticket",
      `${process.env.CLIENT_URL}/tickets/${ticket._id}`
    ),
  });
};

export const sendTicketAssignedEmail = async (ticket, agent, customer) => {
  await sendEmail({
    to: agent.email,
    subject: `New ticket assigned: ${ticket.ticketNumber}`,
    html: baseTemplate(
      `New ticket assigned to you`,
      `<p>Hi ${agent.name},</p>
       <p>You've been assigned ticket <strong>${ticket.ticketNumber}</strong> — "${ticket.subject}".</p>
       <p>Customer: ${customer.name} (${customer.email})</p>
       <p>Priority: <strong>${ticket.priority.toUpperCase()}</strong></p>`,
      "Open Ticket",
      `${process.env.CLIENT_URL}/tickets/${ticket._id}`
    ),
  });
};

export const sendNewMessageEmail = async (ticket, recipient, sender, preview) => {
  await sendEmail({
    to: recipient.email,
    subject: `New reply on ${ticket.ticketNumber}`,
    html: baseTemplate(
      `New message from ${sender.name}`,
      `<p>Hi ${recipient.name},</p>
       <p>You have a new message on ticket <strong>${ticket.ticketNumber}</strong>:</p>
       <blockquote style="border-left:3px solid #2563eb; padding-left:12px; color:#64748b; margin:16px 0;">
         ${preview.slice(0, 200)}${preview.length > 200 ? "..." : ""}
       </blockquote>`,
      "View Reply",
      `${process.env.CLIENT_URL}/tickets/${ticket._id}`
    ),
  });
};

export const sendSLABreachEmail = async (ticket, admin) => {
  await sendEmail({
    to: admin.email,
    subject: `⚠️ SLA breached: ${ticket.ticketNumber}`,
    html: baseTemplate(
      `SLA deadline breached`,
      `<p>Hi ${admin.name},</p>
       <p>Ticket <strong>${ticket.ticketNumber}</strong> has crossed its SLA deadline.</p>
       <p>Subject: ${ticket.subject}</p>
       <p>Status: <strong>${ticket.status}</strong></p>
       <p>Please take immediate action.</p>`,
      "View Ticket",
      `${process.env.CLIENT_URL}/tickets/${ticket._id}`
    ),
  });
};