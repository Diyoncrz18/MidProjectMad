import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Login - find user by NIM/ID or email and verify password
export const login = mutation({
  args: {
    identifier: v.string(),
    password: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Try by NIM first, then by email
    let user = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", args.identifier))
      .first();

    if (!user) {
      // Fallback: search by email
      const all = await ctx.db.query("users").collect();
      user = all.find((u) => u.email === args.identifier) ?? null;
    }

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    if (user.role !== args.role) {
      return { success: false, error: "Role tidak sesuai" };
    }

    if (user.password !== args.password) {
      return { success: false, error: "Password salah" };
    }

    if (user.status === "nonaktif") {
      return { success: false, error: "Akun tidak aktif" };
    }

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        nim: user.nim,
        role: user.role,
        email: user.email,
        jurusan: user.jurusan,
        fakultas: user.fakultas,
        angkatan: user.angkatan,
        semester: user.semester,
        asrama: user.asrama,
        kamar: user.kamar,
        profileImage: user.profileImage,
      },
    };
  },
});

// Get current user profile
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    const { password, ...profile } = user;
    return profile;
  },
});

// Update profile image
export const updateProfileImage = mutation({
  args: { userId: v.id("users"), profileImage: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { profileImage: args.profileImage });
  },
});

// Seed default admin (run once)
export const seedAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", "admin"))
      .first();

    if (existingAdmin) return { message: "Admin sudah ada" };

    await ctx.db.insert("users", {
      name: "Administrator",
      nim: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@unklab.ac.id",
      status: "aktif",
    });

    return { message: "Admin berhasil dibuat" };
  },
});

// Seed demo accounts: admin/admin123 and 12345678/user123
export const seedDemoAccounts = mutation({
  args: {},
  handler: async (ctx) => {
    const results: string[] = [];

    // Admin account (NIM: admin, password: admin123)
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", "admin"))
      .first();

    if (!existingAdmin) {
      await ctx.db.insert("users", {
        name: "Administrator",
        nim: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@gmail.com",
        status: "aktif",
      });
      results.push("Admin account created");
    } else {
      results.push("Admin account already exists");
    }

    // User/mahasiswa account (NIM: 12345678, password: user123)
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", "12345678"))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        name: "User",
        nim: "12345678",
        password: "user123",
        role: "mahasiswa",
        email: "user@gmail.com",
        status: "aktif",
        asrama: "Blok A",
        kamar: "A-101",
        jurusan: "Sistem Informasi",
        fakultas: "Fakultas Ilmu Komputer",
        angkatan: "2023",
        semester: "6",
      });
      results.push("User account created");
    } else {
      results.push("User account already exists");
    }

    return { results };
  },
});
