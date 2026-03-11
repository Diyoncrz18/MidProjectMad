import React, { useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { QrCode, User, ShieldCheck, Info } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

const { width } = Dimensions.get('window');

export default function QRCodeScreen() {
  const scanLinePos = useSharedValue(0);

  // Animasi garis scanner
  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(200, {
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePos.value }],
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      
      <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.brown, marginBottom: 8 }}>
          Akses Masuk Kafetaria
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.gray, marginBottom: 24, textAlign: 'center' }}>
          Tunjukkan QR Code ini ke mesin pemindai di pintu masuk
        </Text>

        {/* QR Code Card */}
        <Card style={styles.qrCard}>
          <View style={styles.qrContainer}>
            {/* Background Decorative Squares */}
            <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 }]} />
            
            {/* Placeholder QR Icon */}
            <QrCode size={180} color={COLORS.brown} strokeWidth={1.5} />
            
            {/* Animated Scan Line */}
            <Animated.View style={[styles.scanLine, animatedStyle]} />
          </View>

          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <Badge status="available" customText="TERDAFTAR / VERIFIED" size="lg" />
            <Text style={{ fontSize: 12, color: COLORS.gray, marginTop: 8 }}>
              Valid hingga: 20:00 WIB
            </Text>
          </View>
        </Card>

        {/* User Info Card */}
        <Card style={styles.userInfoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatarContainer}>
              <User color="white" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.brown }}>Injil Zhena</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: COLORS.gray, marginRight: 8 }}>NIM: 2023001234</Text>
                <ShieldCheck size={14} color={COLORS.green} />
              </View>
            </View>
          </View>
        </Card>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Info size={16} color={COLORS.brownLight} style={{ marginRight: 10 }} />
          <Text style={styles.infoText}>
            Data otomatis terverifikasi dengan database asrama saat dipindai.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    borderRadius: 24,
  },
  qrContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.green,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfoCard: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  avatarContainer: {
    backgroundColor: COLORS.brown,
    padding: 12,
    borderRadius: 30,
    marginRight: 15,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    opacity: 0.7,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.brownLight,
    textAlign: 'center',
  }
});
