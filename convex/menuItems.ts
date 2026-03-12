import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List menu items by day and period
export const listByDay = query({
  args: { day: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_day", (q) => q.eq("day", args.day))
      .collect();
  },
});

// List menu items by day and period
export const listByDayPeriod = query({
  args: { day: v.string(), period: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_day_period", (q) =>
        q.eq("day", args.day).eq("period", args.period),
      )
      .collect();
  },
});

// Get all menu items (grouped by the frontend)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

// Add a menu item
export const add = mutation({
  args: {
    day: v.string(),
    period: v.string(),
    name: v.string(),
    desc: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      day: args.day,
      period: args.period,
      name: args.name,
      desc: args.desc,
      icon: args.icon,
    });
  },
});

// Update a menu item
export const update = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.string(),
    desc: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      desc: args.desc,
      icon: args.icon,
    });
  },
});

// Delete a menu item
export const remove = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
