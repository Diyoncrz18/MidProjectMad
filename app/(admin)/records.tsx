import { useQuery } from "convex/react";
import { Download, Search, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";

type MealPeriod = "semua" | "sarapan" | "siang" | "malam";

const PERIOD_FILTERS: { key: MealPeriod; label: string; icon: string }[] = [
  { key: "semua", label: "Semua", icon: "📋" },
  { key: "sarapan", label: "Sarapan", icon: "🌅" },
  { key: "siang", label: "Siang", icon: "☀️" },
  { key: "malam", label: "Malam", icon: "🌙" },
];

type AsramaFilter = "semua" | "Blok A" | "Blok B" | "Blok C";

export default function RecordsScreen() {
  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const records = useQuery(api.mealRecords.listByDate, { date: dateStr }) ?? [];

  const [periodFilter, setPeriodFilter] = useState<MealPeriod>("semua");
  const [asramaFilter, setAsramaFilter] = useState<AsramaFilter>("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = records.filter((r) => {
    const matchesPeriod = periodFilter === "semua" || r.period === periodFilter;
    const matchesAsrama =
      asramaFilter === "semua" || r.userAsrama === asramaFilter;
    const matchesSearch =
      !searchQuery ||
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userNim.includes(searchQuery);
    return matchesPeriod && matchesAsrama && matchesSearch;
  });

  const periodCounts = {
    semua: records.length,
    sarapan: records.filter((r) => r.period === "sarapan").length,
    siang: records.filter((r) => r.period === "siang").length,
    malam: records.filter((r) => r.period === "malam").length,
  };

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
  const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const renderRecord = ({ item }: { item: (typeof records)[0] }) => {
    const periodColors: Record<string, { bg: string; text: string }> = {
      sarapan: { bg: "#FFF3E0", text: "#F57C00" },
      siang: { bg: "#E8F5E9", text: "#1B5E20" },
      malam: { bg: "#E3F2FD", text: "#1565C0" },
    };
    const colors = periodColors[item.period] || periodColors.sarapan;

    return (
      <View style={styles.recordCard}>
        <View style={styles.recordAvatar}>
          <Text style={styles.recordAvatarText}>
            {item.userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.recordName}>{item.userName}</Text>
          <Text style={styles.recordNim}>
            {item.userNim} • {item.userAsrama || "-"}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={[styles.periodBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.periodBadgeText, { color: colors.text }]}>
              {item.period.charAt(0).toUpperCase() + item.period.slice(1)}
            </Text>
          </View>
          <Text style={styles.recordTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Rekap Makan</Text>
          <Text style={styles.headerSub}>{formattedDate}</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn} activeOpacity={0.7}>
          <Download size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Users size={18} color={COLORS.brown} />
          <Text style={styles.summaryValue}>{records.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={{ fontSize: 16 }}>🌅</Text>
          <Text style={styles.summaryValue}>{periodCounts.sarapan}</Text>
          <Text style={styles.summaryLabel}>Sarapan</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={{ fontSize: 16 }}>☀️</Text>
          <Text style={styles.summaryValue}>{periodCounts.siang}</Text>
          <Text style={styles.summaryLabel}>Siang</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={{ fontSize: 16 }}>🌙</Text>
          <Text style={styles.summaryValue}>{periodCounts.malam}</Text>
          <Text style={styles.summaryLabel}>Malam</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={18} color={COLORS.gray} />
        <View style={styles.searchInputWrap}>
          <Text
            style={[
              styles.searchPlaceholder,
              searchQuery ? { color: COLORS.brown } : {},
            ]}
            onPress={() => {}}
          >
            {searchQuery || "Cari nama atau NIM..."}
          </Text>
        </View>
      </View>

      {/* Period Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          {PERIOD_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                periodFilter === f.key && styles.filterChipActive,
              ]}
              onPress={() => setPeriodFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.filterEmoji}>{f.icon}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  periodFilter === f.key && styles.filterChipTextActive,
                ]}
              >
                {f.label} ({periodCounts[f.key]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Asrama Filter */}
        <View style={styles.filterRow}>
          {(["semua", "Blok A", "Blok B", "Blok C"] as AsramaFilter[]).map(
            (f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.asramaChip,
                  asramaFilter === f && styles.asramaChipActive,
                ]}
                onPress={() => setAsramaFilter(f)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.asramaChipText,
                    asramaFilter === f && styles.asramaChipTextActive,
                  ]}
                >
                  {f === "semua" ? "Semua Asrama" : f}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filtered.length} hasil ditemukan
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderRecord}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={styles.emptyText}>Tidak ada data makan ditemukan</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.brown,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
    fontWeight: "500",
  },
  exportBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0EDE8",
    gap: 4,
  },
  summaryValue: { fontSize: 20, fontWeight: "800", color: COLORS.brown },
  summaryLabel: { fontSize: 10, color: COLORS.gray, fontWeight: "500" },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    gap: 10,
    marginBottom: 12,
  },
  searchInputWrap: { flex: 1 },
  searchPlaceholder: { fontSize: 13, color: COLORS.gray },

  // Filter
  filterSection: { paddingHorizontal: 24, gap: 8, marginBottom: 12 },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  filterChipActive: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  filterEmoji: { fontSize: 12 },
  filterChipText: { fontSize: 11, fontWeight: "600", color: COLORS.gray },
  filterChipTextActive: { color: COLORS.white, fontWeight: "700" },
  asramaChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  asramaChipActive: {
    backgroundColor: "#1B5E20",
    borderColor: "#1B5E20",
  },
  asramaChipText: { fontSize: 11, fontWeight: "600", color: COLORS.gray },
  asramaChipTextActive: { color: COLORS.white, fontWeight: "700" },

  // Results
  resultsHeader: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  resultsText: { fontSize: 12, color: COLORS.gray, fontWeight: "500" },

  // List
  listContent: { paddingHorizontal: 24, paddingBottom: 20 },

  // Record Card
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  recordAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0EDE8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recordAvatarText: { fontSize: 13, fontWeight: "700", color: COLORS.brown },
  recordName: { fontSize: 14, fontWeight: "700", color: COLORS.brown },
  recordNim: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  periodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  periodBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  recordTime: { fontSize: 12, fontWeight: "600", color: COLORS.brownLight },

  // Empty
  emptyWrap: { alignItems: "center", paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 14, color: COLORS.gray },
});
