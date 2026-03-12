import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all QR codes (optionally by date)
export const list = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.date) {
      return await ctx.db
        .query("qrCodes")
        .withIndex("by_date", (q) => q.eq("date", args.date!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("qrCodes").order("desc").collect();
  },
});

// List active QR codes
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("qrCodes")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

// Generate a new QR code
export const generate = mutation({
  args: {
    period: v.string(),
    code: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if active QR for this period+date exists
    const existing = await ctx.db
      .query("qrCodes")
      .withIndex("by_date_period", (q) =>
        q.eq("date", args.date).eq("period", args.period),
      )
      .filter((q) => q.eq(q.field("active"), true))
      .first();

    if (existing) {
      return {
        success: false,
        error: `QR Code untuk periode ini hari ini sudah aktif`,
        existingCode: existing.code,
      };
    }

    const id = await ctx.db.insert("qrCodes", {
      period: args.period,
      code: args.code,
      date: args.date,
      active: true,
    });

    return { success: true, id };
  },
});

// Deactivate a QR code
export const deactivate = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: false });
  },
});

// Delete a QR code
export const remove = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Validate QR code (used when student scans)
export const validate = mutation({
  args: {
    code: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Find active QR with this code
    const qr = await ctx.db
      .query("qrCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .filter((q) => q.eq(q.field("active"), true))
      .first();

    if (!qr) {
      return {
        success: false,
        error: "QR Code tidak valid atau sudah nonaktif",
      };
    }

    // Get user info
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    const now = new Date();
    const today = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check if already scanned today for this period
    const existing = await ctx.db
      .query("mealRecords")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", today),
      )
      .filter((q) => q.eq(q.field("period"), qr.period))
      .first();

    if (existing) {
      return {
        success: false,
        error: `Anda sudah scan untuk ${qr.period} hari ini`,
      };
    }

    // Create meal record
    await ctx.db.insert("mealRecords", {
      userId: args.userId,
      userName: user.name,
      userNim: user.nim,
      userAsrama: user.asrama,
      period: qr.period,
      date: today,
      time,
      qrCode: args.code,
    });

    return {
      success: true,
      period: qr.period,
      time,
      userName: user.name,
    };
  },
});

// Count active QR codes
export const countActive = query({
  args: {},
  handler: async (ctx) => {
    const active = await ctx.db
      .query("qrCodes")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    return active.length;
  },
});
