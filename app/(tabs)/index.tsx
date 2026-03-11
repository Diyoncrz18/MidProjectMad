import React from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { User, Ticket } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

export default function HomeScreen() {
  const meals = [
    { id: '1', title: 'Sarapan', sub: 'Breakfast', time: '06:30 - 10:00', status: 'available' as const },
    { id: '2', title: 'Makan Siang', sub: 'Lunch', time: '11:30 - 14:00', status: 'available' as const },
    { id: '3', title: 'Makan Malam', sub: 'Dinner', time: '17:00 - 20:00', status: 'used' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.brown, marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.brown }}>CampusDine</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }}>
            <User size={20} color={COLORS.brown} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {meals.map((meal) => (
          <Card key={meal.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.brown }}>{meal.title}</Text>
              <Text style={{ fontSize: 16, color: COLORS.brownLight }}>{meal.sub}</Text>
              <Text style={{ fontSize: 14, color: COLORS.gray }}>{meal.time}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Badge status={meal.status} />
              <TouchableOpacity 
                disabled={meal.status === 'used'}
                onPress={() => router.push(`/ticket/${meal.id}`)}
                style={{ marginTop: 10 }}
              >
                <Ticket size={24} color={meal.status === 'available' ? COLORS.brown : COLORS.gray} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}