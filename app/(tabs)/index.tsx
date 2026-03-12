import { useQuery } from "convex/react";
import { router } from "expo-router";
import {
    CalendarDays,
    ChevronRight,
    Clock,
    Coffee,
    Moon,
    Sun,
    Ticket,
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Badge } from "../../components/Badge";
import { Card } from "../../components/Card";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();

  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const todayMeals =
    useQuery(
      api.mealRecords.userTodayMeals,
      user ? { userId: user._id, date: dateStr } : "skip",
    ) ?? [];

  const hasMeal = (period: string) =>
    todayMeals.some((m) => m.period === period);

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

  const currentHour = today.getHours();
  const greeting =
    currentHour < 10
      ? "Selamat Pagi"
      : currentHour < 15
        ? "Selamat Siang"
        : currentHour < 18
          ? "Selamat Sore"
          : "Selamat Malam";

  const meals = [
    {
      id: "1",
      period: "sarapan",
      title: "Sarapan",
      icon: Coffee,
      time: "06:30 - 10:00",
      color: "#FF9800",
    },
    {
      id: "2",
      period: "siang",
      title: "Makan Siang",
      icon: Sun,
      time: "11:30 - 14:00",
      color: "#4CAF50",
    },
    {
      id: "3",
      period: "malam",
      title: "Makan Malam",
      icon: Moon,
      time: "17:00 - 20:00",
      color: "#5C6BC0",
    },
  ];

  const announcements = [
    { id: 1, text: "Menu spesial hari Jumat: Ayam Geprek!" },
    { id: 2, text: "Kafetaria tutup tanggal merah." },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.userName}>{user?.name ?? "-"}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile" as any)}
          style={styles.avatarBtn}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "?")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </Text>
          </View>
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Status Card */}
        <Card style={styles.dateCard} shadow="lg">
          <View style={styles.dateRow}>
            <View style={styles.dateIconWrap}>
              <CalendarDays size={20} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateText}>{dateString}</Text>
              <Text style={styles.dormText}>
                {user?.asrama ? `${user.asrama}` : "📋 Non-Asrama"}
              </Text>
            </View>
            <Badge status="available" customText="Aktif" size="sm" />
          </View>
        </Card>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jadwal Makan Hari Ini</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/menu")}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Lihat Menu</Text>
            <ChevronRight size={14} color={COLORS.green} />
          </TouchableOpacity>
        </View>

        {/* Meal Cards */}
        {meals.map((meal) => {
          const MealIcon = meal.icon;
          const isUsed = hasMeal(meal.period);
          const status = isUsed ? ("used" as const) : ("available" as const);
          return (
            <TouchableOpacity
              key={meal.id}
              activeOpacity={isUsed ? 1 : 0.7}
              onPress={() => !isUsed && router.push(`/ticket/${meal.id}`)}
            >
              <Card style={[styles.mealCard, isUsed && styles.mealCardUsed]}>
                <View
                  style={[
                    styles.mealIconWrap,
                    { backgroundColor: `${meal.color}15` },
                  ]}
                >
                  <MealIcon size={24} color={meal.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={[styles.mealTitle, isUsed && { color: COLORS.gray }]}
                  >
                    {meal.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Clock size={12} color={COLORS.gray} />
                    <Text style={styles.mealTime}> {meal.time}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Badge status={status} size="sm" />
                  {!isUsed && (
                    <View style={styles.ticketBtn}>
                      <Ticket size={16} color={COLORS.white} />
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.brown,
  },
  avatarBtn: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  dateCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.brown,
    borderRadius: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  dormText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  announcementCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#FFFDE7",
    borderWidth: 1,
    borderColor: "#FFF9C4",
  },
  announcementTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.brown,
    marginLeft: 6,
  },
  announcementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  announcementDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginRight: 8,
  },
  announcementText: {
    fontSize: 13,
    color: COLORS.brownLight,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.brown,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: "600",
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
  },
  mealCardUsed: {
    opacity: 0.6,
  },
  mealIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.brown,
  },
  mealTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  ticketBtn: {
    marginTop: 8,
    backgroundColor: COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: "center",
    width: (width - 60) / 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.brownLight,
  },
});
