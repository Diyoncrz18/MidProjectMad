import { v } from "convex/values";
import { query } from "./_generated/server";

// List records by date
export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealRecords")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .order("desc")
      .collect();
  },
});

// List records by date and period
export const listByDatePeriod = query({
  args: { date: v.string(), period: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealRecords")
      .withIndex("by_date_period", (q) =>
        q.eq("date", args.date).eq("period", args.period),
      )
      .collect();
  },
});

// Count meals today by period
export const countTodayByPeriod = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("mealRecords")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    const counts = { sarapan: 0, siang: 0, malam: 0, total: 0 };
    for (const r of records) {
      if (r.period === "sarapan") counts.sarapan++;
      else if (r.period === "siang") counts.siang++;
      else if (r.period === "malam") counts.malam++;
      counts.total++;
    }
    return counts;
  },
});

// Get recent activity (last N records)
export const recentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("mealRecords")
      .order("desc")
      .take(args.limit ?? 5);
    return records;
  },
});

// Get user meal history
export const userHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealRecords")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Count today's meals for a specific user
export const userTodayMeals = query({
  args: { userId: v.id("users"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealRecords")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date),
      )
      .collect();
  },
});
