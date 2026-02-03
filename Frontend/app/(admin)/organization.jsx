import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";

/* ================= PAGE ================= */

export default function OrganizationCredentials() {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return setAuthorized(false);

      const res = await API.get("/admin/organization-credentials", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCredentials(res.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setAuthorized(false);
      } else {
        Alert.alert("Error", "Failed to load credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return <Redirect href="/(auth)/login" />;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading credentials…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#2563EB", "#4F46E5"]} style={styles.header}>
        <Text style={styles.headerTitle}>Organization Credentials</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        {/* AGORA */}
        <Text style={styles.sectionTitle}>Agora Farming</Text>
        <CredentialCard
          title="Support Email"
          organization="AgoraFarming"
          type="support"
          email={credentials.AgoraFarming.email.support.email}
          password={credentials.AgoraFarming.email.support.password}
        />
        <CredentialCard
          title="Info Email"
          organization="AgoraFarming"
          type="info"
          email={credentials.AgoraFarming.email.info.email}
          password={credentials.AgoraFarming.email.info.password}
        />

        {/* LHCPL */}
        <Text style={styles.sectionTitle}>LHCPL</Text>
        <CredentialCard
          title="Support Email"
          organization="LHCPL"
          type="support"
          email={credentials.LHCPL.email.support.email}
          password={credentials.LHCPL.email.support.password}
        />
        <CredentialCard
          title="Info Email"
          organization="LHCPL"
          type="info"
          email={credentials.LHCPL.email.info.email}
          password={credentials.LHCPL.email.info.password}
        />

        {/* HOSTINGER */}
        <Text style={styles.sectionTitle}>Hostinger</Text>
        <CredentialCard
          title="Global Access"
          organization="hostinger"
          type="global"
          email={credentials.hostinger.email}
          password={credentials.hostinger.password}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= CARD ================= */

function CredentialCard({ title, email, password, organization, type }) {
  const [editing, setEditing] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [passwordValue, setPasswordValue] = useState(password);
  const [saving, setSaving] = useState(false);

  const saveChanges = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("adminToken");

      await API.put(
        "/admin/organization-credentials",
        { organization, type, email: emailValue, password: passwordValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Credentials updated");
      setEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update credentials");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={emailValue}
        editable={editing}
        onChangeText={setEmailValue}
        style={[styles.input, !editing && styles.readOnly]}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={passwordValue}
        editable={editing}
        onChangeText={setPasswordValue}
        style={[styles.input, !editing && styles.readOnly]}
      />

      {!editing ? (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.saveBtn}
            disabled={saving}
            onPress={saveChanges}
          >
            <Text style={styles.btnText}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setEmailValue(email);
              setPasswordValue(password);
              setEditing(false);
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  readOnly: {
    backgroundColor: "#F9FAFB",
  },
  editBtn: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cancelText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
