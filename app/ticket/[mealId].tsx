import React from 'react';
import { SafeAreaView, Text, View, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ticket as TicketIcon, User } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export default function TicketDetailScreen() {
  const { mealId } = useLocalSearchParams();
  
  const meals: Record<string, any> = {
    '1': { title: 'Sarapan', time: '06:30 - 10:00' },
    '2': { title: 'Makan Siang', time: '11:30 - 14:00' },
    '3': { title: 'Makan Malam', time: '17:00 - 20:00' },
  };
  
  const meal = meals[mealId as string] || meals['2'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" />
      
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ width: '100%', padding: 30, alignItems: 'center', borderWidth: 2, borderColor: COLORS.green }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.brown }}>{meal.title}</Text>
          <Text style={{ fontSize: 16, color: COLORS.gray, marginVertical: 8 }}>{meal.time}</Text>
          <Badge status="available" />
          
          <View style={{ marginVertical: 30, padding: 20, backgroundColor: '#F5F5F5', borderRadius: 15 }}>
            <TicketIcon size={100} color={COLORS.brown} />
            <Text style={{ textAlign: 'center', marginTop: 10, color: COLORS.gray }}>SCAN QR</Text>
          </View>

          <Button 
            title="Gunakan Tiket Sekarang" 
            variant="primary" 
            onPress={() => Alert.alert('Konfirmasi', 'Tunjukkan layar ini ke petugas kafetaria.')} 
          />
        </Card>

        <Card style={{ width: '100%', backgroundColor: '#FFF8E1', marginTop: 20, padding: 20, flexDirection: 'row', alignItems: 'center' }}>
           <View style={{ backgroundColor: COLORS.brown, padding: 10, borderRadius: 25, marginRight: 15 }}>
              <User color="white" size={20} />
           </View>
           <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.brown }}>Injil Zhena</Text>
              <Text style={{ color: COLORS.gray }}>ID: 2023001234</Text>
           </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}