import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { 
  MapPin, 
  CheckCircle, 
  Ticket, 
  Home, 
  CreditCard,
  Info,
  ExternalLink,
} from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function GuestScreen() {
  const handleOpenMaps = async () => {
    const url = 'https://maps.google.com/?q=Business+Office+Campus';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Tidak dapat membuka aplikasi peta');
    }
  };

  const handleContactFinance = () => {
    Alert.alert(
      'Hubungi Keuangan',
      'Silakan hubungi Business Office:\n\n📞 (021) 1234-5678\n📧 finance@campus.ac.id\n🕐 Senin-Jumat: 08:00-16:00',
      [
        { text: 'Tutup', style: 'cancel' },
        { text: 'Telepon', onPress: () => Linking.openURL('tel:+622112345678') }
      ]
    );
  };

  const steps = [
    { icon: MapPin, title: 'Kunjungi Business Office', desc: 'Datang ke kantor bisnis kampus', color: COLORS.green },
    { icon: CreditCard, title: 'Pembayaran', desc: 'Lakukan pembayaran/registrasi', color: COLORS.brown },
    { icon: Ticket, title: 'Terima Kartu Digital', desc: 'Dapatkan kartu makan digital', color: COLORS.green },
    { icon: Home, title: 'Scan QR di Pintu', desc: 'Tunjukkan QR code saat masuk', color: COLORS.brown },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            backgroundColor: `${COLORS.green}20`,
            justifyContent: 'center', alignItems: 'center', marginBottom: 16,
          }}>
            <Ticket size={32} color={COLORS.green} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.brown, textAlign: 'center', marginBottom: 8 }}>
            Akses Tamu / Outsider
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 20 }}>
            Informasi akses makan untuk mahasiswa luar asrama dan tamu
          </Text>
        </View>

        {/* Info Card */}
        <Card style={{ marginBottom: 24, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: `${COLORS.brown}10`,
              justifyContent: 'center', alignItems: 'center', marginRight: 12,
            }}>
              <Info size={20} color={COLORS.brown} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.brown, marginBottom: 6 }}>
                Persyaratan Akses
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.brownLight, lineHeight: 20 }}>
                Mahasiswa luar asrama atau tamu dapat makan di kafetaria setelah mendapatkan kartu makan melalui Business Office dengan melakukan pembayaran terlebih dahulu.
              </Text>
            </View>
          </View>
        </Card>

        {/* Steps */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.brown, marginBottom: 16 }}>
          Langkah-Langkah
        </Text>
        
        <View style={{ marginBottom: 24 }}>
          {steps.map((step, index) => (
            <View key={index}>
              <Card style={{
                padding: 16, marginBottom: 12, flexDirection: 'row',
                alignItems: 'center', borderLeftWidth: 4, borderLeftColor: step.color,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: `${step.color}15`,
                  justifyContent: 'center', alignItems: 'center', marginRight: 16,
                }}>
                  <step.icon size={22} color={step.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.brown, marginBottom: 2 }}>
                    {index + 1}. {step.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.gray }}>{step.desc}</Text>
                </View>
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: `${COLORS.green}10`,
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <CheckCircle size={18} color={COLORS.green} />
                </View>
              </Card>
              {index < steps.length - 1 && (
                <View style={{ width: 2, height: 20, backgroundColor: '#E0E0E0', marginLeft: 42, marginBottom: -6 }} />
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.brown, marginBottom: 16 }}>
            Aksi Cepat
          </Text>
          
          <Button title="📍 Lokasi Business Office" onPress={handleOpenMaps} variant="primary" style={{ marginBottom: 12 }} />
          <Button title="📞 Hubungi Keuangan" onPress={handleContactFinance} variant="outline" style={{ marginBottom: 12 }} />
          
          <TouchableOpacity
            onPress={() => Alert.alert('Jam Operasional', 'Business Office:\nSenin - Jumat: 08:00 - 16:00\nSabtu: 08:00 - 12:00\nMinggu: Tutup')}
            style={{
              backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E0E0E0',
              borderRadius: 12, padding: 16, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: `${COLORS.brown}10`,
                justifyContent: 'center', alignItems: 'center', marginRight: 12,
              }}>
                <Text style={{ fontSize: 20 }}>🕐</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.brown }}>Jam Operasional</Text>
            </View>
            <ExternalLink size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Decorative Elements */}
        <View style={{
          position: 'absolute', bottom: -48, right: -48,
          width: 160, height: 160, borderRadius: 80,
          backgroundColor: `${COLORS.green}08`,
        }} />
      </ScrollView>
    </SafeAreaView>
  );
} 