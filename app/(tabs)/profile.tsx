import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
    Building2,
    Calendar,
    Camera,
    GraduationCap,
    IdCard,
    LogOut,
    Mail,
    MapPin,
    Shield,
    User,
} from "lucide-react-native";
import React from "react";
import {
    Alert,
    Image,
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

type InfoItem = {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
};

function InfoRow({ item, isLast }: { item: InfoItem; isLast: boolean }) {
  const Icon = item.icon;
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={styles.infoIconWrap}>
        <Icon size={16} color={COLORS.brownLight} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{item.label}</Text>
        <Text style={styles.infoValue}>{item.value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const studentInfo: InfoItem[] = [
    { icon: IdCard, label: "NIM", value: user?.nim ?? "-" },
    { icon: GraduationCap, label: "Jurusan", value: user?.jurusan ?? "-" },
    { icon: Building2, label: "Fakultas", value: user?.fakultas ?? "-" },
    { icon: Calendar, label: "Angkatan", value: user?.angkatan ?? "-" },
    { icon: Mail, label: "Email", value: user?.email ?? "-" },
  ];

  const dormInfo: InfoItem[] = [
    { icon: MapPin, label: "Asrama", value: user?.asrama ?? "-" },
    { icon: Shield, label: "Kamar", value: user?.kamar ?? "-" },
  ];

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi memerlukan akses ke galeri untuk mengubah foto profil.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // Profile image picked – could be saved via mutation
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Camera size={12} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{user?.name ?? "-"}</Text>
          <Text style={styles.profileNim}>{user?.nim ?? "-"}</Text>
          <View style={styles.semesterBadge}>
            <Text style={styles.semesterText}>
              Semester {user?.semester ?? "-"}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Makan Tersisa</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Total Makan</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statusActiveBadge}>
              <Text style={styles.statusActiveText}>Aktif</Text>
            </View>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>

        {/* Data Mahasiswa */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <User size={16} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Data Mahasiswa</Text>
          </View>
          <View style={styles.sectionCard}>
            {studentInfo.map((item, i) => (
              <InfoRow
                key={item.label}
                item={item}
                isLast={i === studentInfo.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Data Asrama */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIconWrap, { backgroundColor: "#1B5E20" }]}
            >
              <MapPin size={16} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Data Asrama</Text>
          </View>
          <View style={styles.sectionCard}>
            {dormInfo.map((item, i) => (
              <InfoRow
                key={item.label}
                item={item}
                isLast={i === dormInfo.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#E53935" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  // Profile Card
  profileCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 28,
  },
  editBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.brown,
    marginBottom: 4,
  },
  profileNim: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
    marginBottom: 12,
  },
  semesterBadge: {
    backgroundColor: "#F0EDE8",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  semesterText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brownLight,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.brown,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
  },
  statusActiveBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusActiveText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B5E20",
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brown,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    overflow: "hidden",
  },

  // Info Row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F2EE",
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.brown,
    fontWeight: "600",
  },

  // Action Buttons
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  actionBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.brown,
  },

  // Logout
  logoutBtn: {
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
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E53935",
  },
});
