import { useQuery } from "convex/react";
import { Clock, Utensils } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";

type MealPeriod = "pagi" | "siang" | "sore";
type DayKey =
  | "senin"
  | "selasa"
  | "rabu"
  | "kamis"
  | "jumat"
  | "sabtu"
  | "minggu";

const DAYS: { key: DayKey; label: string; short: string; num: number }[] = [
  { key: "senin", label: "Senin", short: "Sen", num: 10 },
  { key: "selasa", label: "Selasa", short: "Sel", num: 11 },
  { key: "rabu", label: "Rabu", short: "Rab", num: 12 },
  { key: "kamis", label: "Kamis", short: "Kam", num: 13 },
  { key: "jumat", label: "Jumat", short: "Jum", num: 14 },
  { key: "sabtu", label: "Sabtu", short: "Sab", num: 15 },
  { key: "minggu", label: "Minggu", short: "Min", num: 16 },
];

const PERIODS: {
  key: MealPeriod;
  label: string;
  time: string;
}[] = [
  { key: "pagi", label: "Sarapan", time: "06:30 - 10:00" },
  { key: "siang", label: "Makan Siang", time: "11:30 - 14:00" },
  { key: "sore", label: "Makan Malam", time: "17:00 - 20:00" },
];

export default function MenuScreen() {
  const [selectedDay, setSelectedDay] = useState<DayKey>(() => {
    const jsDay = new Date().getDay();
    const dayMap: DayKey[] = [
      "minggu",
      "senin",
      "selasa",
      "rabu",
      "kamis",
      "jumat",
      "sabtu",
    ];
    return dayMap[jsDay];
  });
  const [selectedPeriod, setSelectedPeriod] = useState<MealPeriod>(() => {
    const h = new Date().getHours();
    if (h < 10) return "pagi";
    if (h < 15) return "siang";
    return "sore";
  });

  const menuItems =
    useQuery(api.menuItems.listByDayPeriod, {
      day: selectedDay,
      period: selectedPeriod,
    }) ?? [];

  const selectedPeriodInfo = PERIODS.find((p) => p.key === selectedPeriod)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Menu Kafetaria</Text>
          <Text style={styles.headerSub}>Jadwal makan mingguan asrama</Text>
        </View>
        <View style={styles.headerIcon}>
          <Utensils size={20} color={COLORS.brownLight} />
        </View>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelectorWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayScrollContent}
        >
          {DAYS.map((day) => {
            const isActive = selectedDay === day.key;
            return (
              <TouchableOpacity
                key={day.key}
                onPress={() => setSelectedDay(day.key)}
                style={[styles.dayItem, isActive && styles.dayItemActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayShort, isActive && styles.dayShortActive]}
                >
                  {day.short}
                </Text>
                <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
                  {day.num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Period Tabs */}
      <View style={styles.periodContainer}>
        {PERIODS.map((period) => {
          const isActive = selectedPeriod === period.key;
          return (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key)}
              style={[styles.periodTab, isActive && styles.periodTabActive]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodLabel,
                  isActive && styles.periodLabelActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Time Info */}
      <View style={styles.timeBar}>
        <View style={styles.timeInfo}>
          <Clock size={13} color={COLORS.gray} />
          <Text style={styles.timeText}>{selectedPeriodInfo.time}</Text>
        </View>
        <Text style={styles.menuCountText}>
          {menuItems.length} menu tersedia
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuCard}>
            <View style={styles.menuNumber}>
              <Text style={styles.menuNumberText}>{index + 1}</Text>
            </View>

            <View style={styles.menuCardBody}>
              <View style={styles.menuEmojiWrap}>
                <Text style={styles.menuEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  // Header
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
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0EDE8",
    justifyContent: "center",
    alignItems: "center",
  },

  // Day Selector
  daySelectorWrap: {
    marginTop: 8,
    marginBottom: 12,
  },
  dayScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 68,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  dayItemActive: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  dayShort: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.gray,
    marginBottom: 4,
  },
  dayShortActive: { color: "rgba(255,255,255,0.6)" },
  dayNum: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.brown,
  },
  dayNumActive: { color: COLORS.white },

  // Period Tabs
  periodContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#F0EDE8",
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  periodTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  periodTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  periodIcon: { fontSize: 14 },
  periodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
  },
  periodLabelActive: {
    color: COLORS.brown,
    fontWeight: "700",
  },

  // Time Bar
  timeBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  menuCountText: {
    fontSize: 12,
    color: COLORS.brownLight,
    fontWeight: "600",
  },

  // Menu Items
  menuList: {
    paddingHorizontal: 24,
  },
  menuCard: {
    flexDirection: "row",
    marginBottom: 12,
  },
  menuNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 14,
  },
  menuNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  menuCardBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  menuEmojiWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuEmoji: { fontSize: 26 },
  menuInfo: { flex: 1 },
  menuName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 3,
  },
  menuDesc: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 17,
  },
});
