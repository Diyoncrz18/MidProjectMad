import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all students (mahasiswa)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "mahasiswa"))
      .collect();
    return students.map(({ password, ...s }) => s);
  },
});

// Get student count
export const count = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "mahasiswa"))
      .collect();
    return students.length;
  },
});

// Add a new student
export const add = mutation({
  args: {
    name: v.string(),
    nim: v.string(),
    asrama: v.string(),
    kamar: v.string(),
    password: v.optional(v.string()),
    email: v.optional(v.string()),
    jurusan: v.optional(v.string()),
    fakultas: v.optional(v.string()),
    angkatan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if NIM already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", args.nim))
      .first();

    if (existing) {
      return { success: false, error: "NIM sudah terdaftar" };
    }

    const id = await ctx.db.insert("users", {
      name: args.name,
      nim: args.nim,
      password: args.password || args.nim,
      role: "mahasiswa",
      asrama: args.asrama,
      kamar: args.kamar,
      email: args.email,
      jurusan: args.jurusan,
      fakultas: args.fakultas,
      angkatan: args.angkatan,
      status: "aktif",
    });

    return { success: true, id };
  },
});

// Update a student
export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    nim: v.string(),
    asrama: v.string(),
    kamar: v.string(),
    status: v.union(v.literal("aktif"), v.literal("nonaktif")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      nim: args.nim,
      asrama: args.asrama,
      kamar: args.kamar,
      status: args.status,
    });
  },
});

// Delete a student
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
