import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const res = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      Alert.alert("Error", "Unable to load user data");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userToken");
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.fullName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Organization Access Section */}
        {user.organizationAccess && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organization Access</Text>
            
            {user.organizationAccess.AgoraFarming && (
              <View style={styles.orgCard}>
                <View style={styles.orgHeader}>
                  <View style={[styles.orgIcon, { backgroundColor: '#10B981' }]}>
                    <Text style={styles.orgIconText}>AF</Text>
                  </View>
                  <Text style={styles.orgName}>Agora Farming</Text>
                </View>
                {user.organizationAccess.AgoraFarming.email?.support?.enabled && (
                  <Text style={styles.orgDetail}>• Support Email Access</Text>
                )}
                {user.organizationAccess.AgoraFarming.email?.info?.enabled && (
                  <Text style={styles.orgDetail}>• Info Email Access</Text>
                )}
              </View>
            )}

            {user.organizationAccess.LHCPL && (
              <View style={styles.orgCard}>
                <View style={styles.orgHeader}>
                  <View style={[styles.orgIcon, { backgroundColor: '#3B82F6' }]}>
                    <Text style={styles.orgIconText}>LC</Text>
                  </View>
                  <Text style={styles.orgName}>LHCPL</Text>
                </View>
                {user.organizationAccess.LHCPL.email?.support?.enabled && (
                  <Text style={styles.orgDetail}>• Support Email Access</Text>
                )}
                {user.organizationAccess.LHCPL.email?.info?.enabled && (
                  <Text style={styles.orgDetail}>• Info Email Access</Text>
                )}
              </View>
            )}

            {user.organizationAccess.hostinger?.enabled && (
              <View style={styles.orgCard}>
                <View style={styles.orgHeader}>
                  <View style={[styles.orgIcon, { backgroundColor: '#6366F1' }]}>
                    <Text style={styles.orgIconText}>HT</Text>
                  </View>
                  <Text style={styles.orgName}>Hostinger</Text>
                </View>
                <Text style={styles.orgDetail}>• Hosting Access</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 110,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: "#6B7280",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginLeft: 4,
  },
  orgCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  orgHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  orgIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orgIconText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  orgName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  orgDetail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});