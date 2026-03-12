import { useMutation, useQuery } from "convex/react";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
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
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type DayKey =
  | "senin"
  | "selasa"
  | "rabu"
  | "kamis"
  | "jumat"
  | "sabtu"
  | "minggu";
type MealPeriod = "pagi" | "siang" | "sore";

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "senin", label: "Senin", short: "Sen" },
  { key: "selasa", label: "Selasa", short: "Sel" },
  { key: "rabu", label: "Rabu", short: "Rab" },
  { key: "kamis", label: "Kamis", short: "Kam" },
  { key: "jumat", label: "Jumat", short: "Jum" },
  { key: "sabtu", label: "Sabtu", short: "Sab" },
  { key: "minggu", label: "Minggu", short: "Min" },
];

const PERIODS: { key: MealPeriod; label: string }[] = [
  { key: "pagi", label: "Sarapan" },
  { key: "siang", label: "Makan Siang" },
  { key: "sore", label: "Makan Malam" },
];

const EMOJI_OPTIONS = [
  "🍚",
  "🍗",
  "🥗",
  "🍜",
  "🍲",
  "🥚",
  "🍞",
  "🧃",
  "🍌",
  "☕",
  "🍳",
  "🥘",
];

export default function MenuManageScreen() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("senin");
  const [selectedPeriod, setSelectedPeriod] = useState<MealPeriod>("pagi");

  const [showModal, setShowModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<Id<"menuItems"> | null>(
    null,
  );
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("🍚");

  const allMenuItems = useQuery(api.menuItems.listAll) ?? [];
  const addMenuItem = useMutation(api.menuItems.add);
  const updateMenuItem = useMutation(api.menuItems.update);
  const removeMenuItem = useMutation(api.menuItems.remove);

  // Group items by day and period
  const getItemsByDayPeriod = (day: string, period: string) =>
    allMenuItems.filter((m) => m.day === day && m.period === period);

  const currentItems = getItemsByDayPeriod(selectedDay, selectedPeriod);

  const openAdd = () => {
    setEditingItemId(null);
    setFormName("");
    setFormDesc("");
    setFormIcon("🍚");
    setShowModal(true);
  };

  const openEdit = (item: (typeof allMenuItems)[0]) => {
    setEditingItemId(item._id);
    setFormName(item.name);
    setFormDesc(item.desc);
    setFormIcon(item.icon);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert("Peringatan", "Nama menu harus diisi");
      return;
    }

    if (editingItemId) {
      await updateMenuItem({
        id: editingItemId,
        name: formName.trim(),
        desc: formDesc.trim(),
        icon: formIcon,
      });
    } else {
      await addMenuItem({
        day: selectedDay,
        period: selectedPeriod,
        name: formName.trim(),
        desc: formDesc.trim(),
        icon: formIcon,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: Id<"menuItems">, name: string) => {
    Alert.alert("Hapus Menu", `Yakin ingin menghapus "${name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeMenuItem({ id }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Menu</Text>
        <Text style={styles.headerSub}>Update menu makan harian</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayScrollContent}
        >
          {DAYS.map((day) => {
            const isActive = selectedDay === day.key;
            const count =
              getItemsByDayPeriod(day.key, "pagi").length +
              getItemsByDayPeriod(day.key, "siang").length +
              getItemsByDayPeriod(day.key, "sore").length;
            return (
              <TouchableOpacity
                key={day.key}
                style={[styles.dayChip, isActive && styles.dayChipActive]}
                onPress={() => setSelectedDay(day.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayChipText,
                    isActive && styles.dayChipTextActive,
                  ]}
                >
                  {day.short}
                </Text>
                <View
                  style={[
                    styles.dayCount,
                    isActive && { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayCountText,
                      isActive && { color: COLORS.white },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Period Tabs */}
        <View style={styles.periodTabs}>
          {PERIODS.map((p) => {
            const isActive = selectedPeriod === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodTab, isActive && styles.periodTabActive]}
                onPress={() => setSelectedPeriod(p.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodLabel,
                    isActive && styles.periodLabelActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Current Items */}
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>
            {currentItems.length} menu tersedia
          </Text>
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={openAdd}
            activeOpacity={0.7}
          >
            <Plus size={16} color={COLORS.white} />
            <Text style={styles.addItemBtnText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {currentItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 40 }}>🍽️</Text>
            <Text style={styles.emptyText}>
              Belum ada menu untuk periode ini
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={openAdd}
              activeOpacity={0.7}
            >
              <Plus size={16} color={COLORS.brown} />
              <Text style={styles.emptyAddText}>Tambah Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentItems.map((item, idx) => (
            <View key={item._id} style={styles.menuCard}>
              <View style={styles.menuCardLeft}>
                <View style={styles.menuNumBadge}>
                  <Text style={styles.menuNumText}>{idx + 1}</Text>
                </View>
                <View style={styles.menuEmojiWrap}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  {item.desc ? (
                    <Text style={styles.menuDesc}>{item.desc}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.menuCardActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEdit(item)}
                  activeOpacity={0.7}
                >
                  <Edit3 size={14} color={COLORS.brownLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item._id, item.name)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={14} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItemId ? "Edit Menu" : "Tambah Menu"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={22} color={COLORS.brown} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Emoji</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.emojiRow}
            >
              {EMOJI_OPTIONS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.emojiOption,
                    formIcon === e && styles.emojiOptionActive,
                  ]}
                  onPress={() => setFormIcon(e)}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Nama Menu</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contoh: Nasi Goreng"
              placeholderTextColor={COLORS.gray}
              value={formName}
              onChangeText={setFormName}
            />

            <Text style={styles.modalLabel}>Deskripsi (opsional)</Text>
            <TextInput
              style={[
                styles.modalInput,
                { height: 72, textAlignVertical: "top" },
              ]}
              placeholder="Contoh: Nasi goreng spesial dengan telur"
              placeholderTextColor={COLORS.gray}
              value={formDesc}
              onChangeText={setFormDesc}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Save size={16} color={COLORS.white} />
                <Text style={styles.modalSaveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
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
  headerSub: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
    fontWeight: "500",
  },
  scrollContent: { paddingBottom: 20 },

  // Day Selector
  dayScrollContent: { paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  dayChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    gap: 8,
  },
  dayChipActive: { backgroundColor: COLORS.brown, borderColor: COLORS.brown },
  dayChipText: { fontSize: 13, fontWeight: "600", color: COLORS.brown },
  dayChipTextActive: { color: COLORS.white },
  dayCount: {
    backgroundColor: "#F0EDE8",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  dayCountText: { fontSize: 11, fontWeight: "700", color: COLORS.brownLight },

  // Period
  periodTabs: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#F0EDE8",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  periodTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  periodIcon: { fontSize: 14 },
  periodLabel: { fontSize: 12, fontWeight: "600", color: COLORS.gray },
  periodLabelActive: { color: COLORS.brown, fontWeight: "700" },

  // Items
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  itemsTitle: { fontSize: 14, fontWeight: "600", color: COLORS.gray },
  addItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brown,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addItemBtnText: { fontSize: 12, fontWeight: "700", color: COLORS.white },

  // Empty
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: { fontSize: 14, color: COLORS.gray },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EDE8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyAddText: { fontSize: 13, fontWeight: "600", color: COLORS.brown },

  // Menu Card
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  menuCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  menuNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },
  menuNumText: { fontSize: 11, fontWeight: "700", color: COLORS.white },
  menuEmojiWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
  },
  menuName: { fontSize: 14, fontWeight: "700", color: COLORS.brown },
  menuDesc: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  menuCardActions: { flexDirection: "row", gap: 6 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FAF5EF",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.brown },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.brown,
    marginBottom: 8,
    marginTop: 4,
  },
  emojiRow: { gap: 8, marginBottom: 12 },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FAF7F4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiOptionActive: {
    borderColor: COLORS.brown,
    backgroundColor: "#F0EDE8",
  },
  modalInput: {
    backgroundColor: "#FAF7F4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDEBE8",
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.brown,
    marginBottom: 12,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0EDE8",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.brownLight,
  },
  modalSaveBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.brown,
  },
  modalSaveText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
});
