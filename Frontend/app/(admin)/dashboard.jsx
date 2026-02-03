import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";

export default function AdminDashboard() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [orgAccess, setOrgAccess] = useState({
    AgoraFarming: {
      email: {
        support: {
          enabled: false,
          email: "",
          password: "",
        },
        info: {
          enabled: false,
          email: "",
          password: "",
        },
      },
    },
    LHCPL: {
      email: {
        support: {
          enabled: false,
          email: "",
          password: "",
        },
        info: {
          enabled: false,
          email: "",
          password: "",
        },
      },
    },
    hostinger: {
      enabled: false,
      email: "",
      password: "",
    },
  });

  const getToken = async () => {
    return await AsyncStorage.getItem("adminToken");
  };

  // 🔹 Toggle email access
  const toggleEmailAccess = (org, type) => {
    setOrgAccess(prev => ({
      ...prev,
      [org]: {
        ...prev[org],
        email: {
          ...prev[org].email,
          [type]: {
            ...prev[org].email[type],
            enabled: !prev[org].email[type].enabled,
          },
        },
      },
    }));
  };

  // 🔹 Toggle global hostinger
  const toggleHostinger = () => {
    setOrgAccess(prev => ({
      ...prev,
      hostinger: {
        ...prev.hostinger,
        enabled: !prev.hostinger.enabled,
      },
    }));
  };

  // 🔹 Create User
  const createUser = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Validation Error", "All user fields are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      await API.post(
        "/admin/create-user",
        {
          fullName,
          email,
          password,
          organizationAccess: orgAccess,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "User created successfully");

      // 🔄 reset
      setFullName("");
      setEmail("");
      setPassword("");
      setOrgAccess({
        AgoraFarming: {
          email: {
            support: { enabled: false, email: "", password: "" },
            info: { enabled: false, email: "", password: "" },
          },
        },
        LHCPL: {
          email: {
            support: { enabled: false, email: "", password: "" },
            info: { enabled: false, email: "", password: "" },
          },
        },
        hostinger: { enabled: false, email: "", password: "" },
      });
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage user access and permissions</Text>
        {/* <Text style={styles.headerSubtitle}>Manage user access and permissions</Text> */}
      </View>

      {/* Organization Access Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Access Control</Text>

        {/* ================= AGORA ================= */}
        <View style={styles.orgCard}>
          <View style={styles.orgHeader}>
            <Text style={styles.orgName}>Agora Farming</Text>
          </View>

          {/* Support Email */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>Support Email</Text>
              <Text style={styles.permissionDescription}>
                Access to support@agorafarming.com
              </Text>
            </View>
            <Switch
              value={orgAccess.AgoraFarming.email.support.enabled}
              onValueChange={() => toggleEmailAccess("AgoraFarming", "support")}
              trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
              thumbColor={orgAccess.AgoraFarming.email.support.enabled ? "#22C55E" : "#F3F4F6"}
            />
          </View>

          <View style={styles.divider} />

          {/* Info Email */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>Info Email</Text>
              <Text style={styles.permissionDescription}>
                Access to info@agorafarming.com
              </Text>
            </View>
            <Switch
              value={orgAccess.AgoraFarming.email.info.enabled}
              onValueChange={() => toggleEmailAccess("AgoraFarming", "info")}
              trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
              thumbColor={orgAccess.AgoraFarming.email.info.enabled ? "#22C55E" : "#F3F4F6"}
            />
          </View>
        </View>

        {/* ================= LHCPL ================= */}
        <View style={styles.orgCard}>
          <View style={styles.orgHeader}>
            <Text style={styles.orgName}>LHCPL</Text>
          </View>

          {/* Support Email */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>Support Email</Text>
              <Text style={styles.permissionDescription}>
                Access to support@lhcpl.com
              </Text>
            </View>
            <Switch
              value={orgAccess.LHCPL.email.support.enabled}
              onValueChange={() => toggleEmailAccess("LHCPL", "support")}
              trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
              thumbColor={orgAccess.LHCPL.email.support.enabled ? "#22C55E" : "#F3F4F6"}
            />
          </View>

          <View style={styles.divider} />

          {/* Info Email */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>Info Email</Text>
              <Text style={styles.permissionDescription}>
                Access to info@lhcpl.com
              </Text>
            </View>
            <Switch
              value={orgAccess.LHCPL.email.info.enabled}
              onValueChange={() => toggleEmailAccess("LHCPL", "info")}
              trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
              thumbColor={orgAccess.LHCPL.email.info.enabled ? "#22C55E" : "#F3F4F6"}
            />
          </View>
        </View>

        {/* ================= HOSTINGER (GLOBAL) ================= */}
        <View style={styles.orgCard}>
          <View style={styles.orgHeader}>
            <Text style={styles.orgName}>🌐 Hostinger</Text>
          </View>

          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>Global Access</Text>
              <Text style={styles.permissionDescription}>
                Enable Hostinger platform access
              </Text>
            </View>
            <Switch
              value={orgAccess.hostinger.enabled}
              onValueChange={toggleHostinger}
              trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
              thumbColor={orgAccess.hostinger.enabled ? "#22C55E" : "#F3F4F6"}
            />
          </View>
        </View>
      </View>

      {/* ================= USER CREATION ================= */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Create New User</Text>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Email</Text>
            <TextInput
              placeholder="user@company.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="Enter secure password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            onPress={createUser}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating User..." : "Create User"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
  },
  // header: {
  //   marginBottom: 32,
  //   paddingTop: 20,
  // },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  // headerSubtitle: {
  //   fontSize: 16,
  //   color: "#6B7280",
  // },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
  },
  orgCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orgHeader: {
    marginBottom: 16,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});