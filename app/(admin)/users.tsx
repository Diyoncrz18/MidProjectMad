import { useMutation, useQuery } from "convex/react";
import { Edit3, Search, Trash2, UserPlus, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
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

type FilterStatus = "semua" | "aktif" | "nonaktif";

export default function UsersScreen() {
  const students = useQuery(api.students.list) ?? [];
  const addStudent = useMutation(api.students.add);
  const updateStudent = useMutation(api.students.update);
  const removeStudent = useMutation(api.students.remove);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNim, setNewNim] = useState("");
  const [newAsrama, setNewAsrama] = useState("");
  const [newKamar, setNewKamar] = useState("");

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nim.includes(search);
    const matchesFilter = filterStatus === "semua" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = async () => {
    if (!newName || !newNim || !newAsrama || !newKamar) {
      Alert.alert("Peringatan", "Semua field harus diisi");
      return;
    }
    const result = await addStudent({
      name: newName,
      nim: newNim,
      asrama: newAsrama,
      kamar: newKamar,
    });
    if (!result.success) {
      Alert.alert("Gagal", result.error || "Gagal menambahkan");
      return;
    }
    setNewName("");
    setNewNim("");
    setNewAsrama("");
    setNewKamar("");
    setShowAddModal(false);
  };

  const handleToggleStatus = async (id: Id<"users">, currentStatus: string) => {
    await updateStudent({
      id,
      name: students.find((s) => s._id === id)!.name,
      nim: students.find((s) => s._id === id)!.nim,
      asrama: students.find((s) => s._id === id)!.asrama || "",
      kamar: students.find((s) => s._id === id)!.kamar || "",
      status: currentStatus === "aktif" ? "nonaktif" : "aktif",
    });
  };

  const handleDelete = (id: Id<"users">, name: string) => {
    Alert.alert("Hapus Mahasiswa", `Yakin ingin menghapus ${name}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeStudent({ id }),
      },
    ]);
  };

  const statusCounts = {
    semua: students.length,
    aktif: students.filter((s) => s.status === "aktif").length,
    nonaktif: students.filter((s) => s.status === "nonaktif").length,
  };

  const renderStudent = ({ item }: { item: (typeof students)[0] }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentTop}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentNim}>{item.nim}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === "aktif"
              ? styles.statusAktif
              : styles.statusNonaktif,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === "aktif" ? "#1B5E20" : "#E53935" },
            ]}
          >
            {item.status === "aktif" ? "Aktif" : "Nonaktif"}
          </Text>
        </View>
      </View>
      <View style={styles.studentInfo}>
        <View style={styles.studentInfoItem}>
          <Text style={styles.studentInfoLabel}>Asrama</Text>
          <Text style={styles.studentInfoValue}>{item.asrama}</Text>
        </View>
        <View style={styles.studentInfoItem}>
          <Text style={styles.studentInfoLabel}>Kamar</Text>
          <Text style={styles.studentInfoValue}>{item.kamar}</Text>
        </View>
      </View>
      <View style={styles.studentActions}>
        <TouchableOpacity
          style={styles.actionBtnToggle}
          onPress={() => handleToggleStatus(item._id, item.status)}
          activeOpacity={0.7}
        >
          <Edit3 size={14} color={COLORS.brownLight} />
          <Text style={styles.actionBtnToggleText}>
            {item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtnDelete}
          onPress={() => handleDelete(item._id, item.name)}
          activeOpacity={0.7}
        >
          <Trash2 size={14} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Kelola Mahasiswa</Text>
          <Text style={styles.headerSub}>
            {students.length} mahasiswa terdaftar
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.7}
        >
          <UserPlus size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={18} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama atau NIM..."
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(["semua", "aktif", "nonaktif"] as FilterStatus[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterTab,
              filterStatus === f && styles.filterTabActive,
            ]}
            onPress={() => setFilterStatus(f)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterLabel,
                filterStatus === f && styles.filterLabelActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Students List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderStudent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Users size={40} color={COLORS.gray} />
            <Text style={styles.emptyText}>Tidak ada mahasiswa ditemukan</Text>
          </View>
        }
      />

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Mahasiswa</Text>

            <Text style={styles.modalLabel}>Nama Lengkap</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Masukkan nama"
              placeholderTextColor={COLORS.gray}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.modalLabel}>NIM</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Masukkan NIM"
              placeholderTextColor={COLORS.gray}
              value={newNim}
              onChangeText={setNewNim}
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Asrama</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contoh: Blok A"
              placeholderTextColor={COLORS.gray}
              value={newAsrama}
              onChangeText={setNewAsrama}
            />

            <Text style={styles.modalLabel}>Kamar</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contoh: A-204"
              placeholderTextColor={COLORS.gray}
              value={newKamar}
              onChangeText={setNewKamar}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAdd}
                activeOpacity={0.7}
              >
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
  headerSub: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
    fontWeight: "500",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brown,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.brown,
    fontWeight: "500",
  },

  // Filter
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  filterTabActive: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  filterLabel: { fontSize: 12, fontWeight: "600", color: COLORS.gray },
  filterLabelActive: { color: COLORS.white, fontWeight: "700" },

  // List
  listContent: { paddingHorizontal: 24, paddingBottom: 20 },

  // Student Card
  studentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  studentTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  studentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F0EDE8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brown,
  },
  studentName: { fontSize: 15, fontWeight: "700", color: COLORS.brown },
  studentNim: { fontSize: 12, color: COLORS.gray, marginTop: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusAktif: { backgroundColor: "#E8F5E9" },
  statusNonaktif: { backgroundColor: "#FFEBEE" },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  studentInfo: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F2EE",
    marginBottom: 12,
  },
  studentInfoItem: {},
  studentInfoLabel: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
    marginBottom: 2,
  },
  studentInfoValue: { fontSize: 13, fontWeight: "600", color: COLORS.brown },
  studentActions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  actionBtnToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FAF5EF",
  },
  actionBtnToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.brownLight,
  },
  actionBtnDelete: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF0F0",
  },

  // Empty
  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.gray, fontWeight: "500" },

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
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.brown,
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.brown,
    marginBottom: 6,
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
    marginBottom: 14,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 6 },
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
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.brown,
  },
  modalSaveText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
});
