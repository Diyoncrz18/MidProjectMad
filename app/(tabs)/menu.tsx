import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/Card';

type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export default function MenuScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<MealPeriod>('lunch');

  const menuData = {
    breakfast: [
      { id: '1', name: 'Nasi Uduk', desc: 'Dengan ayam goreng & sambal', tag: 'halal', icon: '🍚', calories: '350 kcal' },
      { id: '2', name: 'Bubur Ayam', desc: 'Bubur hangat dengan suwiran ayam', tag: 'halal', icon: '🥣', calories: '280 kcal' },
      { id: '3', name: 'Roti Bakar', desc: 'Roti bakar coklat keju', tag: 'vegetarian', icon: '🍞', calories: '320 kcal' },
    ],
    lunch: [
      { id: '4', name: 'Nasi Goreng Kampung', desc: 'Dengan telur mata sapi & acar', tag: 'halal', icon: '🍚', calories: '520 kcal' },
      { id: '5', name: 'Ayam Bakar Bumbu Rujak', desc: 'Pedas manis gurih', tag: 'pedas', icon: '🍗', calories: '480 kcal' },
      { id: '6', name: 'Sayur Asem', desc: 'Segar dengan jagung manis', tag: 'vegan', icon: '🥗', calories: '180 kcal' },
      { id: '7', name: 'Ikan Bakar', desc: 'Ikan nila bakar sambal dabu-dabu', tag: 'halal', icon: '🐟', calories: '420 kcal' },
    ],
    dinner: [
      { id: '8', name: 'Mie Goreng', desc: 'Mie goreng dengan sayuran & telur', tag: 'halal', icon: '🍜', calories: '450 kcal' },
      { id: '9', name: 'Nasi Campur', desc: 'Nasi dengan lauk pauk pilihan', tag: 'halal', icon: '🍛', calories: '550 kcal' },
      { id: '10', name: 'Cap Cay', desc: 'Tumis sayuran dengan bakso', tag: 'halal', icon: '🥘', calories: '320 kcal' },
    ],
  };

  const periods = [
    { id: 'breakfast' as MealPeriod, label: 'Sarapan', time: '06:30-10:00' },
    { id: 'lunch' as MealPeriod, label: 'Makan Siang', time: '11:30-14:00' },
    { id: 'dinner' as MealPeriod, label: 'Makan Malam', time: '17:00-20:00' },
  ];

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'halal':
        return { bg: '#E8F5E9', text: COLORS.green };
      case 'vegetarian':
        return { bg: '#FFF3E0', text: '#F57C00' };
      case 'vegan':
        return { bg: '#E8F5E9', text: '#43A047' };
      case 'pedas':
        return { bg: '#FFEBEE', text: '#E53935' };
      default:
        return { bg: '#F5F5F5', text: COLORS.gray };
    }
  };

  const currentMenu = menuData[selectedPeriod];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.brown, marginBottom: 16 }}>
          Menu Hari Ini
        </Text>
        
        {/* Period Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                backgroundColor: selectedPeriod === period.id 
                  ? `${COLORS.green}20` 
                  : COLORS.white,
                borderWidth: 1,
                borderColor: selectedPeriod === period.id 
                  ? COLORS.green 
                  : '#E0E0E0',
                minWidth: 120,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: selectedPeriod === period.id ? 'bold' : '600',
                color: selectedPeriod === period.id ? COLORS.green : COLORS.brownLight,
                textAlign: 'center',
              }}>
                {period.label}
              </Text>
              <Text style={{
                fontSize: 11,
                color: selectedPeriod === period.id ? COLORS.green : COLORS.gray,
                marginTop: 2,
              }}>
                {period.time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {currentMenu.map((item, index) => {
            const tagStyle = getTagColor(item.tag);
            return (
              <Card 
                key={item.id}
                style={{
                  width: '48%',
                  marginBottom: 15,
                  padding: 16,
                }}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  backgroundColor: tagStyle.bg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: COLORS.brown,
                  marginBottom: 4,
                }}>
                  {item.name}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.gray,
                  marginBottom: 8,
                }}>
                  {item.desc}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: tagStyle.bg,
                    borderRadius: 4,
                  }}>
                    <Text style={{
                      fontSize: 11,
                      color: tagStyle.text,
                      fontWeight: 'bold',
                    }}>
                      {item.tag.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: COLORS.gray }}>
                    {item.calories}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}