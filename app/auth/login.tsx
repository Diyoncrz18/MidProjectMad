import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, IdCard, Lock, Eye, EyeOff, Utensils } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function LoginScreen() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!nim || !password) {
      Alert.alert('Peringatan', 'Silakan masukkan NIM dan Kata Sandi');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
      Alert.alert('Berhasil', 'Selamat datang!');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ padding: 20 }}>
             <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={COLORS.brown} />
             </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', padding: 20 }}>
            <View style={{ padding: 20, backgroundColor: `${COLORS.green}15`, borderRadius: 20 }}>
              <Utensils size={48} color={COLORS.green} />
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.brown, marginTop: 20 }}>Selamat Datang</Text>
          </View>

          <Card style={{ margin: 20, padding: 24 }}>
            <Text style={{ marginBottom: 8, fontWeight: '600' }}>NIM</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 12, height: 56, marginBottom: 20 }}>
              <IdCard size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
              <TextInput style={{ flex: 1 }} placeholder="Masukkan NIM" value={nim} onChangeText={setNim} keyboardType="numeric" />
            </View>

            <Text style={{ marginBottom: 8, fontWeight: '600' }}>Kata Sandi</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 12, height: 56, marginBottom: 20 }}>
              <Lock size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
              <TextInput style={{ flex: 1 }} placeholder="Masukkan Kata Sandi" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
              </TouchableOpacity>
            </View>

            <Button title={isLoading ? "Memproses..." : "Masuk"} onPress={handleLogin} variant="primary" />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}