import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";

export default function UpdateUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");

      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem("adminToken");

      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "User deleted successfully");
      fetchUsers();
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.email}>{item.email}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                Alert.alert(
                  "Delete User",
                  "Are you sure you want to delete this user?",
                  [
                    { text: "Cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteUser(item._id),
                    },
                  ]
                )
              }
            >
              <Text style={styles.deleteText}>Delete User</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600" },
  email: { color: "#6B7280", marginBottom: 12 },

  deleteBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
