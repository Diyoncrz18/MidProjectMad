import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function GuestScreen() {
  useEffect(() => {
    router.replace("/(tabs)/profile");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.cream,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: COLORS.gray }}>Mengarahkan...</Text>
    </View>
  );
}
