import { useMutation, useQuery } from "convex/react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
    Camera,
    CheckCircle,
    Clock,
    Info,
    MapPin,
    RotateCcw,
    ShieldCheck,
    User,
    Utensils,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Badge } from "../../components/Badge";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

const getCurrentMealPeriod = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return "Sarapan";
  if (hour >= 11 && hour < 14) return "Makan Siang";
  return "Makan Malam";
};

const getCurrentTime = () =>
  new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function QRCodeScreen() {
  const { user } = useAuth();
  const validate = useMutation(api.qrCodes.validate);

  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const todayMeals = useQuery(
    api.mealRecords.userTodayMeals,
    user ? { userId: user._id, date: dateStr } : "skip",
  );

  const [scanState, setScanState] = useState<"camera" | "success">("camera");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ period: string } | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const scanLock = useRef(false);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanLock.current || !user) return;
    scanLock.current = true;
    try {
      const result = await validate({ code: data, userId: user._id });
      if (!result.success) {
        Alert.alert("Gagal", result.error ?? "QR Code tidak valid");
        scanLock.current = false;
        return;
      }
      setScannedData(data);
      setScanResult({ period: result.period ?? "" });
      setScanState("success");
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "QR Code tidak valid");
      scanLock.current = false;
    }
  };

  const handleReset = () => {
    scanLock.current = false;
    setScannedData(null);
    setScanResult(null);
    setScanState("camera");
  };

  const hasMeal = (period: string) =>
    todayMeals?.some((m) => m.period === period) ?? false;

  // ─── PERMISSION HANDLING ──────────────────────────────────
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={COLORS.brown} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
        <View style={styles.centeredContent}>
          <View style={styles.permissionIcon}>
            <Camera size={40} color={COLORS.brownLight} />
          </View>
          <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
          <Text style={styles.permissionDesc}>
            Untuk memindai QR Code kafetaria, aplikasi memerlukan akses ke
            kamera perangkat Anda.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionBtnText}>Izinkan Kamera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── SUCCESS STATE ────────────────────────────────────────────
  if (scanState === "success") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
        <ScrollView
          contentContainerStyle={styles.successScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Header */}
          <View style={styles.successHeader}>
            <View style={styles.successCircle}>
              <CheckCircle size={44} color={COLORS.white} strokeWidth={2.5} />
            </View>
            <Text style={styles.successTitle}>Verifikasi Berhasil</Text>
            <View style={styles.successTimeBadge}>
              <Clock size={12} color={COLORS.green} />
              <Text style={styles.successTimeText}>
                {getCurrentTime()} · {getCurrentMealPeriod()}
              </Text>
            </View>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileCardAccent} />
            <View style={styles.profileContent}>
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {(user?.name ?? "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.profileName}>{user?.name ?? "-"}</Text>
                  <Text style={styles.profileNim}>{user?.nim ?? "-"}</Text>
                  <View style={styles.verifiedRow}>
                    <ShieldCheck size={14} color={COLORS.green} />
                    <Text style={styles.verifiedText}>Terverifikasi</Text>
                  </View>
                </View>
              </View>

              <View style={styles.profileDivider}>
                <View style={styles.dividerCircleLeft} />
                <View style={styles.dividerLine} />
                <View style={styles.dividerCircleRight} />
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconWrap}>
                    <Utensils size={14} color={COLORS.brownLight} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Fakultas</Text>
                    <Text style={styles.detailValue}>
                      {user?.fakultas ?? "-"}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconWrap}>
                    <MapPin size={14} color={COLORS.brownLight} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Asrama</Text>
                    <Text style={styles.detailValue}>
                      {user?.asrama ?? "-"}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconWrap}>
                    <User size={14} color={COLORS.brownLight} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Kamar</Text>
                    <Text style={styles.detailValue}>{user?.kamar ?? "-"}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconWrap}>
                    <Info size={14} color={COLORS.brownLight} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Angkatan</Text>
                    <Text style={styles.detailValue}>
                      {user?.angkatan ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statusBadgeRow}>
                <Badge
                  status="available"
                  customText="Mahasiswa Aktif"
                  size="sm"
                />
                <Badge
                  status="available"
                  customText="Penghuni Asrama"
                  size="sm"
                />
              </View>
            </View>
          </View>

          {/* Meal Status */}
          <Text style={styles.mealSectionTitle}>Status Makan Hari Ini</Text>
          <View style={styles.mealGrid}>
            <View
              style={[
                styles.mealCard,
                hasMeal("sarapan")
                  ? styles.mealCardUsed
                  : styles.mealCardAvailable,
              ]}
            >
              <Text style={styles.mealEmoji}>☀️</Text>
              <Text style={styles.mealLabel}>Sarapan</Text>
              {hasMeal("sarapan") ? (
                <View style={styles.mealBadgeUsed}>
                  <CheckCircle size={10} color={COLORS.white} />
                  <Text style={styles.mealBadgeText}>Sudah</Text>
                </View>
              ) : (
                <View style={styles.mealBadgeAvail}>
                  <Text style={styles.mealBadgeTextGreen}>Tersedia</Text>
                </View>
              )}
              <Text style={styles.mealTime}>06:00 - 09:00</Text>
            </View>
            <View
              style={[
                styles.mealCard,
                hasMeal("siang")
                  ? styles.mealCardUsed
                  : styles.mealCardAvailable,
              ]}
            >
              <Text style={styles.mealEmoji}>🍚</Text>
              <Text style={styles.mealLabel}>Siang</Text>
              {hasMeal("siang") ? (
                <View style={styles.mealBadgeUsed}>
                  <CheckCircle size={10} color={COLORS.white} />
                  <Text style={styles.mealBadgeText}>Sudah</Text>
                </View>
              ) : (
                <View style={styles.mealBadgeAvail}>
                  <Text style={styles.mealBadgeTextGreen}>Tersedia</Text>
                </View>
              )}
              <Text style={styles.mealTime}>11:00 - 13:30</Text>
            </View>
            <View
              style={[
                styles.mealCard,
                hasMeal("malam")
                  ? styles.mealCardUsed
                  : styles.mealCardAvailable,
              ]}
            >
              <Text style={styles.mealEmoji}>🌙</Text>
              <Text style={styles.mealLabel}>Malam</Text>
              {hasMeal("malam") ? (
                <View style={styles.mealBadgeUsed}>
                  <CheckCircle size={10} color={COLORS.white} />
                  <Text style={styles.mealBadgeText}>Sudah</Text>
                </View>
              ) : (
                <View style={styles.mealBadgeAvail}>
                  <Text style={styles.mealBadgeTextGreen}>Tersedia</Text>
                </View>
              )}
              <Text style={styles.mealTime}>17:00 - 19:30</Text>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <RotateCcw size={18} color={COLORS.white} />
            <Text style={styles.resetText}>Scan Ulang</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── CAMERA / SCANNER STATE ───────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.cameraWrapper}>
        {/* Camera */}
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarCodeScanned}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top */}
          <View style={styles.overlayTop}>
            <Text style={styles.cameraTitle}>Scan QR Kafetaria</Text>
            <Text style={styles.cameraSubtitle}>
              Arahkan kamera ke QR Code untuk verifikasi
            </Text>
          </View>

          {/* Scan Frame */}
          <View style={styles.scanFrameRow}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.overlaySide} />
          </View>

          {/* Bottom */}
          <View style={styles.overlayBottom}>
            <View style={styles.cameraInfoCard}>
              <View style={styles.cameraInfoAvatar}>
                <User color={COLORS.white} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cameraInfoName}>{user?.name ?? "-"}</Text>
                <Text style={styles.cameraInfoDetail}>
                  {user?.nim ?? "-"} · {user?.fakultas ?? "-"}
                </Text>
              </View>
              <View style={styles.cameraInfoStatus}>
                <Text style={styles.statusActiveText}>Aktif</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const SCAN_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  // ─── PERMISSION ──────────────────────────
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#F0EDE8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 10,
    textAlign: "center",
  },
  permissionDesc: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  permissionBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permissionBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },

  // ─── CAMERA ──────────────────────────
  cameraWrapper: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  overlayTop: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cameraTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 6,
  },
  cameraSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  scanFrameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlaySide: {
    flex: 1,
    height: SCAN_SIZE,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  scanFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: COLORS.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  overlayBottom: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  cameraInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    width: "100%",
  },
  cameraInfoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cameraInfoName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  cameraInfoDetail: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  cameraInfoStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  statusActiveText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },

  // ─── SUCCESS STATE ──────────────────────────
  successScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.brown,
    textAlign: "center",
    marginBottom: 8,
  },
  successTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(27, 94, 32, 0.06)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  successTimeText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "600",
  },

  profileCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  profileCardAccent: {
    height: 5,
    backgroundColor: COLORS.green,
  },
  profileContent: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 22,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.brown,
  },
  profileNim: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "600",
  },

  profileDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerCircleLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.cream,
    marginLeft: -36,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E8E0D8",
  },
  dividerCircleRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.cream,
    marginRight: -36,
  },

  detailGrid: { gap: 14 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brown,
    marginTop: 1,
  },
  statusBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },

  mealSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  mealGrid: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 24,
  },
  mealCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  mealCardUsed: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E8E8E8",
  },
  mealCardAvailable: {
    backgroundColor: "rgba(27, 94, 32, 0.04)",
    borderColor: "rgba(27, 94, 32, 0.12)",
  },
  mealEmoji: { fontSize: 24, marginBottom: 6 },
  mealLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 6,
  },
  mealBadgeUsed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  mealBadgeText: { fontSize: 9, fontWeight: "700", color: COLORS.white },
  mealBadgeAvail: {
    backgroundColor: "rgba(27, 94, 32, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  mealBadgeTextGreen: { fontSize: 9, fontWeight: "700", color: COLORS.green },
  mealTime: { fontSize: 9, color: COLORS.gray, fontWeight: "500" },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brown,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  resetText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
});
