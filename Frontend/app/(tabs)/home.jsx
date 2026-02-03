import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, SafeAreaView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

export default function Home() {
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

    if (!user) {
        return (
            <View style={styles.center}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your credentials...</Text>
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
                <Text style={styles.headerTitle}>My Credentials</Text>
            </LinearGradient>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Credentials Section */}
                <Text style={styles.sectionTitle}>Your Access</Text>

                {user.organizationAccess?.AgoraFarming?.email?.support?.enabled && (
                    <CredentialCard
                        title="Agora Farming"
                        subtitle="Support Email"
                        email={user.organizationAccess.AgoraFarming.email.support.email}
                        password={user.organizationAccess.AgoraFarming.email.support.password}
                        icon="AF"
                        color="#10B981"
                    />
                )}

                {user.organizationAccess?.AgoraFarming?.email?.info?.enabled && (
                    <CredentialCard
                        title="Agora Farming"
                        subtitle="Info Email"
                        email={user.organizationAccess.AgoraFarming.email.info.email}
                        password={user.organizationAccess.AgoraFarming.email.info.password}
                        icon="AF"
                        color="#10B981"
                    />
                )}

                {user.organizationAccess?.LHCPL?.email?.support?.enabled && (
                    <CredentialCard
                        title="LHCPL"
                        subtitle="Support Email"
                        email={user.organizationAccess.LHCPL.email.support.email}
                        password={user.organizationAccess.LHCPL.email.support.password}
                        icon="LC"
                        color="#3B82F6"
                    />
                )}

                {user.organizationAccess?.LHCPL?.email?.info?.enabled && (
                    <CredentialCard
                        title="LHCPL"
                        subtitle="Info Email"
                        email={user.organizationAccess.LHCPL.email.info.email}
                        password={user.organizationAccess.LHCPL.email.info.password}
                        icon="LC"
                        color="#3B82F6"
                    />
                )}

                {user.organizationAccess?.hostinger?.enabled && (
                    <CredentialCard
                        title="Hostinger"
                        subtitle="Web Hosting"
                        email={user.organizationAccess.hostinger.email}
                        password={user.organizationAccess.hostinger.password}
                        icon="HT"
                        color="#6366F1"
                    />
                )}

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

function CredentialCard({ title, subtitle, email, password, icon, color }) {
    const [showPassword, setShowPassword] = useState(false);

    const copyToClipboard = async (text, type) => {
        await Clipboard.setStringAsync(text);
        Alert.alert("Copied!", `${type} copied to clipboard`);
    };

    return (
        <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSubtitle}>{subtitle}</Text>
                </View>
            </View>

            {/* Email Row */}
            <View style={styles.credentialRow}>
                <View style={styles.credentialInfo}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value} numberOfLines={1}>{email}</Text>
                </View>
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(email, "Email")}
                >
                    <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
            </View>

            {/* Password Row */}
            <View style={styles.credentialRow}>
                <View style={styles.credentialInfo}>
                    <Text style={styles.label}>Password</Text>
                    <Text style={styles.value}>
                        {showPassword ? password : "••••••••"}
                    </Text>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.buttonText}>{showPassword ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(password, "Password")}
                    >
                        <Text style={styles.copyText}>Copy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        padding: 16,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
        marginLeft: 4,
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    icon: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
    credentialRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        backgroundColor: "#F9FAFB",
        padding: 12,
        borderRadius: 12,
    },
    credentialInfo: {
        flex: 1,
        marginRight: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "500",
    },
    buttonGroup: {
        flexDirection: "row",
        gap: 8,
    },
    copyButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#6366F1",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    copyText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    eyeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
    },
    bottomPadding: {
        height: 20,
    },
});