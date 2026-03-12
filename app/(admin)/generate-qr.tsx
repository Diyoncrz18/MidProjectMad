import { useMutation, useQuery } from "convex/react";
import { Check, Copy, QrCode, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
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
import QRCode from "react-native-qrcode-svg";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type MealPeriod = "sarapan" | "siang" | "malam";

const PERIODS: {
  key: MealPeriod;
  label: string;
  time: string;
}[] = [
  { key: "sarapan", label: "Sarapan", time: "06:30 - 10:00" },
  { key: "siang", label: "Makan Siang", time: "11:30 - 14:00" },
  { key: "malam", label: "Makan Malam", time: "17:00 - 20:00" },
];

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function GenerateQRScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<MealPeriod>("sarapan");

  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const allQRs = useQuery(api.qrCodes.list, { date: dateStr }) ?? [];
  const generateQR = useMutation(api.qrCodes.generate);
  const deactivateQR = useMutation(api.qrCodes.deactivate);
  const removeQR = useMutation(api.qrCodes.remove);

  const activeQRs = allQRs.filter((q) => q.active);
  const inactiveQRs = allQRs.filter((q) => !q.active);

  const handleGenerate = async () => {
    const periodInfo = PERIODS.find((p) => p.key === selectedPeriod)!;
    const code = generateCode();

    const result = await generateQR({
      period: selectedPeriod,
      code,
      date: dateStr,
    });

    if (!result.success) {
      Alert.alert(
        "QR Sudah Ada",
        `QR Code untuk ${periodInfo.label} hari ini sudah aktif.${result.existingCode ? `\nKode: ${result.existingCode}` : ""}`,
      );
      return;
    }

    Alert.alert(
      "Berhasil",
      `QR Code untuk ${periodInfo.label} berhasil dibuat!`,
    );
  };

  const handleDeactivate = async (id: Id<"qrCodes">) => {
    await deactivateQR({ id });
  };

  const handleDelete = (id: Id<"qrCodes">) => {
    Alert.alert("Hapus QR", "Yakin ingin menghapus QR Code ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeQR({ id }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate QR Code</Text>
        <Text style={styles.headerSub}>Buat kode QR untuk scan makan</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <Text style={styles.sectionLabel}>Pilih Periode Makan</Text>
        <View style={styles.periodList}>
          {PERIODS.map((p) => {
            const isActive = selectedPeriod === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodCard, isActive && styles.periodCardActive]}
                onPress={() => setSelectedPeriod(p.key)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.periodLabel,
                      isActive && styles.periodLabelActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                  <Text
                    style={[
                      styles.periodTime,
                      isActive && { color: "rgba(255,255,255,0.7)" },
                    ]}
                  >
                    {p.time}
                  </Text>
                </View>
                {isActive && (
                  <View style={styles.checkCircle}>
                    <Check size={14} color={COLORS.brown} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={handleGenerate}
          activeOpacity={0.8}
        >
          <QrCode size={20} color={COLORS.white} />
          <Text style={styles.generateBtnText}>Generate QR Code</Text>
        </TouchableOpacity>

        {/* Active QR Codes */}
        {activeQRs.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              QR Code Aktif ({activeQRs.length})
            </Text>
            {activeQRs.map((qr) => {
              const periodInfo = PERIODS.find((p) => p.key === qr.period)!;
              return (
                <View key={qr._id} style={styles.qrCard}>
                  <View style={styles.qrCardTop}>
                    <View style={styles.qrIconWrap}>
                      <QrCode size={24} color={COLORS.brown} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.qrPeriodLabel}>
                        {periodInfo.label}
                      </Text>
                      <Text style={styles.qrDate}>{qr.date}</Text>
                    </View>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Aktif</Text>
                    </View>
                  </View>

                  <View style={styles.qrCodeWrap}>
                    <QRCode
                      value={qr.code}
                      size={180}
                      color={COLORS.brown}
                      backgroundColor="#FAF7F4"
                    />
                  </View>

                  <View style={styles.codeWrap}>
                    <Text style={styles.codeText}>{qr.code}</Text>
                    <TouchableOpacity
                      style={styles.copyBtn}
                      onPress={() =>
                        Alert.alert("Disalin", `Kode ${qr.code} disalin!`)
                      }
                    >
                      <Copy size={16} color={COLORS.brownLight} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.qrActions}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(qr._id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={14} color="#E53935" />
                      <Text style={styles.deleteBtnText}>Hapus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deactivateBtn}
                      onPress={() => handleDeactivate(qr._id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deactivateBtnText}>Nonaktifkan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Inactive */}
        {inactiveQRs.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 8 }]}>
              Riwayat ({inactiveQRs.length})
            </Text>
            {inactiveQRs.map((qr) => {
              const periodInfo = PERIODS.find((p) => p.key === qr.period)!;
              return (
                <View key={qr._id} style={[styles.qrCard, { opacity: 0.6 }]}>
                  <View style={styles.qrCardTop}>
                    <View
                      style={[
                        styles.qrIconWrap,
                        { backgroundColor: "#F0EDE8" },
                      ]}
                    >
                      <QrCode size={24} color={COLORS.gray} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.qrPeriodLabel, { color: COLORS.gray }]}
                      >
                        {periodInfo.label}
                      </Text>
                      <Text style={styles.qrDate}>{qr.date}</Text>
                    </View>
                    <View
                      style={[
                        styles.activeBadge,
                        { backgroundColor: "#F0EDE8" },
                      ]}
                    >
                      <Text
                        style={[styles.activeBadgeText, { color: COLORS.gray }]}
                      >
                        Nonaktif
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.qrCodeWrap, { opacity: 0.5 }]}>
                    <QRCode
                      value={qr.code}
                      size={140}
                      color={COLORS.gray}
                      backgroundColor="#F0EDE8"
                    />
                  </View>

                  <View style={styles.codeWrap}>
                    <Text style={[styles.codeText, { color: COLORS.gray }]}>
                      {qr.code}
                    </Text>
                  </View>

                  <View style={styles.qrActions}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(qr._id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={14} color="#E53935" />
                      <Text style={styles.deleteBtnText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 12,
    marginTop: 8,
  },

  // Period Selector
  periodList: { gap: 8, marginBottom: 20 },
  periodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    gap: 12,
  },
  periodCardActive: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  periodEmoji: { fontSize: 24 },
  periodLabel: { fontSize: 15, fontWeight: "700", color: COLORS.brown },
  periodLabelActive: { color: COLORS.white },
  periodTime: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  // Generate
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.brown,
    borderRadius: 14,
    height: 52,
    marginBottom: 24,
  },
  generateBtnText: { fontSize: 15, fontWeight: "700", color: COLORS.white },

  // QR Card
  qrCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  qrCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  qrIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  qrPeriodLabel: { fontSize: 15, fontWeight: "700", color: COLORS.brown },
  qrDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  activeBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1B5E20",
    textTransform: "uppercase",
  },

  qrCodeWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EDEBE8",
    borderStyle: "dashed",
    marginBottom: 12,
  },
  codeWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F4",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDEBE8",
    borderStyle: "dashed",
    marginBottom: 12,
  },
  codeText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.brown,
    letterSpacing: 4,
  },
  copyBtn: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  qrActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  deleteBtnText: { fontSize: 12, fontWeight: "600", color: "#E53935" },
  deactivateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  deactivateBtnText: { fontSize: 12, fontWeight: "600", color: "#E53935" },
});
