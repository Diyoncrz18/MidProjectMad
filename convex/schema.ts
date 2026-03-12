import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    nim: v.string(),
    password: v.string(),
    role: v.union(v.literal("mahasiswa"), v.literal("admin")),
    email: v.optional(v.string()),
    jurusan: v.optional(v.string()),
    fakultas: v.optional(v.string()),
    angkatan: v.optional(v.string()),
    semester: v.optional(v.string()),
    asrama: v.optional(v.string()),
    kamar: v.optional(v.string()),
    status: v.union(v.literal("aktif"), v.literal("nonaktif")),
    profileImage: v.optional(v.string()),
  })
    .index("by_nim", ["nim"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  menuItems: defineTable({
    day: v.string(),
    period: v.string(),
    name: v.string(),
    desc: v.string(),
    icon: v.string(),
  })
    .index("by_day", ["day"])
    .index("by_day_period", ["day", "period"]),

  qrCodes: defineTable({
    period: v.string(),
    code: v.string(),
    date: v.string(),
    active: v.boolean(),
  })
    .index("by_date", ["date"])
    .index("by_active", ["active"])
    .index("by_code", ["code"])
    .index("by_date_period", ["date", "period"]),

  mealRecords: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    userNim: v.string(),
    userAsrama: v.optional(v.string()),
    period: v.string(),
    date: v.string(),
    time: v.string(),
    qrCode: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_user", ["userId"])
    .index("by_date_period", ["date", "period"])
    .index("by_user_date", ["userId", "date"]),
});
