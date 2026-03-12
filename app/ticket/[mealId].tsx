import { useLocalSearchParams } from "expo-router";
import { Clock, QrCode, ShieldCheck } from "lucide-react-native";
import React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function TicketDetailScreen() {
  const { mealId } = useLocalSearchParams();
  const { user } = useAuth();

  const meals: Record<
    string,
    { title: string; time: string; icon: string; color: string }
  > = {
    "1": {
      title: "Sarapan",
      time: "06:30 - 10:00",
      icon: "☀️",
      color: "#FF9800",
    },
    "2": {
      title: "Makan Siang",
      time: "11:30 - 14:00",
      icon: "🌤️",
      color: "#4CAF50",
    },
    "3": {
      title: "Makan Malam",
      time: "17:00 - 20:00",
      icon: "🌙",
      color: "#5C6BC0",
    },
  };

  const meal = meals[mealId as string] || meals["2"];
  const today = new Date();
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Card */}
        <Card style={styles.ticketCard} shadow="lg">
          {/* Top Section */}
          <View style={styles.ticketTop}>
            <Text style={{ fontSize: 40 }}>{meal.icon}</Text>
            <Text style={styles.ticketTitle}>{meal.title}</Text>
            <View style={styles.timeRow}>
              <Clock size={14} color={COLORS.gray} />
              <Text style={styles.timeText}>{meal.time}</Text>
            </View>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Badge status="available" customText="Tersedia" />
          </View>

          {/* Dashed Divider */}
          <View style={styles.dashedDivider}>
            <View style={styles.circleLeft} />
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={styles.dash} />
            ))}
            <View style={styles.circleRight} />
          </View>

          {/* QR / Ticket Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrWrap}>
              <QrCode size={80} color={COLORS.brown} strokeWidth={1.5} />
            </View>
            <Text style={styles.scanLabel}>TUNJUKKAN KE PETUGAS</Text>
          </View>

          {/* Dashed Divider */}
          <View style={styles.dashedDivider}>
            <View style={styles.circleLeft} />
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={styles.dash} />
            ))}
            <View style={styles.circleRight} />
          </View>

          {/* Student Info Bottom */}
          <View style={styles.studentInfo}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>
                {(user?.name ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.studentName}>{user?.name ?? "-"}</Text>
              <Text style={styles.studentNim}>NIM: {user?.nim ?? "-"}</Text>
            </View>
            <ShieldCheck size={20} color={COLORS.green} />
          </View>
        </Card>

        {/* Details Card */}
        <Card style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asrama</Text>
            <Text style={styles.detailValue}>{user?.asrama ?? "-"}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kamar</Text>
            <Text style={styles.detailValue}>{user?.kamar ?? "-"}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fakultas</Text>
            <Text style={styles.detailValue}>{user?.fakultas ?? "-"}</Text>
          </View>
        </Card>

        {/* Action Button */}
        <Button
          title="Gunakan Tiket Sekarang"
          variant="primary"
          onPress={() =>
            Alert.alert(
              "Konfirmasi",
              "Tunjukkan layar ini ke petugas kafetaria.",
              [{ text: "Batal", style: "cancel" }, { text: "OK" }],
            )
          }
          style={{ marginTop: 4 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { padding: 20, paddingBottom: 40 },
  ticketCard: {
    padding: 0,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  ticketTop: { alignItems: "center", padding: 24, paddingBottom: 20 },
  ticketTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.brown,
    marginTop: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  timeText: { fontSize: 14, color: COLORS.gray },
  dateText: { fontSize: 12, color: COLORS.gray, marginBottom: 10 },
  dashedDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    position: "relative",
  },
  circleLeft: {
    position: "absolute",
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
  },
  circleRight: {
    position: "absolute",
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
  },
  dash: {
    width: 8,
    height: 2,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 3,
  },
  qrSection: { alignItems: "center", paddingVertical: 24 },
  qrWrap: {
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    marginBottom: 12,
  },
  scanLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF8E1",
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  studentAvatarText: { color: COLORS.white, fontWeight: "bold", fontSize: 16 },
  studentName: { fontSize: 16, fontWeight: "bold", color: COLORS.brown },
  studentNim: { fontSize: 12, color: COLORS.gray, marginTop: 2 },

  detailCard: { marginTop: 16, padding: 18 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: 13, color: COLORS.gray },
  detailValue: { fontSize: 14, fontWeight: "600", color: COLORS.brown },
  detailDivider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
});
