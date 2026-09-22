import { z } from "zod";

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(3),
    description: z.string().min(5),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    category: z.enum(["billing", "technical", "general", "other"]).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateTicketSchema = z.object({
  body: z.object({
    status: z.enum(["open", "pending", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});