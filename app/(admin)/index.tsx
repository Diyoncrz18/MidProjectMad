import { useQuery } from "convex/react";
import { router } from "expo-router";
import {
    ChevronRight,
    ClipboardList,
    LogOut,
    QrCode,
    ShieldCheck,
    UserCog,
    UtensilsCrossed,
} from "lucide-react-native";
import React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

const quickActions = [
  {
    label: "Kelola Mahasiswa",
    icon: UserCog,
    color: "#1976D2",
    bg: "#E3F2FD",
    route: "/(admin)/users",
  },
  {
    label: "Buat QR Code",
    icon: QrCode,
    color: "#7B1FA2",
    bg: "#F3E5F5",
    route: "/(admin)/generate-qr",
  },
  {
    label: "Update Menu",
    icon: UtensilsCrossed,
    color: "#1B5E20",
    bg: "#E8F5E9",
    route: "/(admin)/menu-manage",
  },
  {
    label: "Rekap Makan",
    icon: ClipboardList,
    color: "#F57C00",
    bg: "#FFF3E0",
    route: "/(admin)/records",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const handleLogout = () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const studentCount = useQuery(api.students.count) ?? 0;
  const activeQRCount = useQuery(api.qrCodes.countActive) ?? 0;
  const mealCounts = useQuery(api.mealRecords.countTodayByPeriod, {
    date: dateStr,
  });
  const recentActivity = useQuery(api.mealRecords.recentActivity, { limit: 5 });

  const todayTotal = mealCounts?.total ?? 0;
  const belumMakan = studentCount - todayTotal;

  const stats = [
    { label: "Total Mahasiswa", value: String(studentCount), bg: "#E3F2FD" },
    { label: "Makan Hari Ini", value: String(todayTotal), bg: "#E8F5E9" },
    {
      label: "Belum Makan",
      value: String(belumMakan > 0 ? belumMakan : 0),
      bg: "#FFF3E0",
    },
    { label: "QR Aktif", value: String(activeQRCount), bg: "#F3E5F5" },
  ];

  const sarapanPct =
    studentCount > 0
      ? Math.round(((mealCounts?.sarapan ?? 0) / studentCount) * 100)
      : 0;
  const siangPct =
    studentCount > 0
      ? Math.round(((mealCounts?.siang ?? 0) / studentCount) * 100)
      : 0;
  const malamPct =
    studentCount > 0
      ? Math.round(((mealCounts?.malam ?? 0) / studentCount) * 100)
      : 0;

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dateString = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
        <View style={styles.adminBadge}>
          <ShieldCheck size={18} color={COLORS.white} />
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={18} color="#E53935" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        </View>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                activeOpacity={0.7}
                onPress={() => router.push(action.route as any)}
              >
                <View
                  style={[
                    styles.actionIconWrap,
                    { backgroundColor: action.bg },
                  ]}
                >
                  <Icon size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <ChevronRight size={14} color={COLORS.gray} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Today's Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ringkasan Hari Ini</Text>
        </View>
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewEmoji}></Text>
              <View>
                <Text style={styles.overviewLabel}>Sarapan</Text>
                <Text style={styles.overviewValue}>
                  {mealCounts?.sarapan ?? 0} / {studentCount}
                </Text>
              </View>
            </View>
            <View style={styles.overviewBar}>
              <View
                style={[styles.overviewBarFill, { width: `${sarapanPct}%` }]}
              />
            </View>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewEmoji}></Text>
              <View>
                <Text style={styles.overviewLabel}>Makan Siang</Text>
                <Text style={styles.overviewValue}>
                  {mealCounts?.siang ?? 0} / {studentCount}
                </Text>
              </View>
            </View>
            <View style={styles.overviewBar}>
              <View
                style={[
                  styles.overviewBarFill,
                  { width: `${siangPct}%`, backgroundColor: COLORS.greenLight },
                ]}
              />
            </View>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewEmoji}></Text>
              <View>
                <Text style={styles.overviewLabel}>Makan Malam</Text>
                <Text style={styles.overviewValue}>
                  {mealCounts?.malam ?? 0} / {studentCount}
                </Text>
              </View>
            </View>
            <View style={styles.overviewBar}>
              <View
                style={[styles.overviewBarFill, { width: `${malamPct}%` }]}
              />
            </View>
          </View>
        </View>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutFullBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={18} color="#E53935" />
          <Text style={styles.logoutFullText}>Keluar dari Admin</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.brown,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
    fontWeight: "500",
  },
  adminBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  logoutFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  logoutFullText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E53935",
  },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.brown,
    marginBottom: 2,
  },
  statLabel: { fontSize: 12, color: COLORS.gray, fontWeight: "500" },

  // Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.brown },
  seeAll: { fontSize: 12, fontWeight: "600", color: COLORS.brownLight },

  // Actions
  actionsGrid: { gap: 8, marginBottom: 24 },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.brown,
  },

  // Overview
  overviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    marginBottom: 24,
  },
  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  overviewItem: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    gap: 10,
  },
  overviewEmoji: { fontSize: 20 },
  overviewLabel: { fontSize: 12, color: COLORS.gray, fontWeight: "500" },
  overviewValue: { fontSize: 14, fontWeight: "700", color: COLORS.brown },
  overviewBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0EDE8",
    marginLeft: 12,
  },
  overviewBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brown,
  },
  overviewDivider: { height: 1, backgroundColor: "#F5F2EE", marginVertical: 4 },

  // Activity
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    overflow: "hidden",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: "#F5F2EE" },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenLight,
  },
  activityText: { fontSize: 13, fontWeight: "500", color: COLORS.brown },
  activityTime: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
});
