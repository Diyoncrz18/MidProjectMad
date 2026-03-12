import { useMutation } from "convex/react";
import { router } from "expo-router";
import {
    Eye,
    EyeOff,
    GraduationCap,
    IdCard,
    Lock,
    ShieldCheck,
    UtensilsCrossed,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

type Role = "mahasiswa" | "admin";

export default function LoginScreen() {
  const [role, setRole] = useState<Role>("mahasiswa");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useMutation(api.auth.login);
  const seedAdmin = useMutation(api.auth.seedAdmin);
  const seedDemoAccounts = useMutation(api.auth.seedDemoAccounts);
  const { setUser } = useAuth();

  // Seed demo accounts on first load
  useEffect(() => {
    seedDemoAccounts().catch(() => {});
  }, []);

  const isMahasiswa = role === "mahasiswa";

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert(
        "Peringatan",
        `Silakan masukkan ${isMahasiswa ? "NIM" : "ID Admin"} dan Kata Sandi`,
      );
      return;
    }
    setIsLoading(true);
    try {
      // Ensure admin exists on first login attempt
      if (role === "admin") {
        await seedAdmin();
      }

      const result = await login({
        identifier,
        password,
        role,
      });

      if (!result.success) {
        Alert.alert("Gagal", result.error || "Login gagal");
        return;
      }

      setUser(result.user as any);

      if (isMahasiswa) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(admin)" as any);
      }
      Alert.alert("Berhasil", "Selamat datang!");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.brandSection}>
            <View style={styles.logoWrap}>
              <UtensilsCrossed size={32} color={COLORS.white} />
            </View>
            <Text style={styles.brandTitle}>CAFETARIA</Text>
            <Text style={styles.brandSub}>Sistem Manajemen Makan Asrama</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            {/* Role Selector */}
            <Text style={styles.cardTitle}>Masuk sebagai</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleTab, isMahasiswa && styles.roleTabActive]}
                onPress={() => {
                  setRole("mahasiswa");
                  setIdentifier("");
                }}
                activeOpacity={0.7}
              >
                <GraduationCap
                  size={18}
                  color={isMahasiswa ? COLORS.white : COLORS.gray}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    isMahasiswa && styles.roleLabelActive,
                  ]}
                >
                  Mahasiswa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, !isMahasiswa && styles.roleTabActive]}
                onPress={() => {
                  setRole("admin");
                  setIdentifier("");
                }}
                activeOpacity={0.7}
              >
                <ShieldCheck
                  size={18}
                  color={!isMahasiswa ? COLORS.white : COLORS.gray}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    !isMahasiswa && styles.roleLabelActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Identifier Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {isMahasiswa ? "NIM" : "ID Admin"}
              </Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputIconWrap}>
                  <IdCard size={18} color={COLORS.brownLight} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={
                    isMahasiswa ? "Masukkan NIM" : "Masukkan ID Admin"
                  }
                  placeholderTextColor={COLORS.gray}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType={isMahasiswa ? "numeric" : "default"}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Kata Sandi</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputIconWrap}>
                  <Lock size={18} color={COLORS.brownLight} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan Kata Sandi"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={COLORS.gray} />
                  ) : (
                    <Eye size={18} color={COLORS.gray} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>© 2026 MadMid · Universitas</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Brand
  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.brown,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
    fontWeight: "500",
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 12,
    textAlign: "center",
  },

  // Role Selector
  roleSelector: {
    flexDirection: "row",
    backgroundColor: "#F0EDE8",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 11,
    gap: 8,
  },
  roleTabActive: {
    backgroundColor: COLORS.brown,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.gray,
  },
  roleLabelActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  // Fields
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.brown,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF7F4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDEBE8",
    height: 52,
    paddingHorizontal: 4,
  },
  inputIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.brown,
    fontWeight: "500",
    paddingVertical: 0,
  },
  eyeBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Forgot
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.brownLight,
    fontWeight: "600",
  },

  // Login Button
  loginBtn: {
    backgroundColor: COLORS.brown,
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 24,
    fontWeight: "500",
  },
});
