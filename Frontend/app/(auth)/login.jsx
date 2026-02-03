import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!email || !password) {
            Alert.alert("Validation Error", "Email and password are required");
            return;
        }

        setLoading(true);

        try {
            /**
             * 1️⃣ TRY ADMIN LOGIN
             */
            try {
                const adminRes = await API.post("/admin/login", {
                    email,
                    password,
                });

                await AsyncStorage.setItem("adminToken", adminRes.data.token);
                await AsyncStorage.removeItem("userToken");

                router.replace("/(admin)/dashboard");
                return;
            } catch {
                // not admin → try user
            }

            /**
             * 2️⃣ USER LOGIN
             */
            const userRes = await API.post("/auth/login", {
                email,
                password,
            });

            await AsyncStorage.setItem("userToken", userRes.data.token);
            await AsyncStorage.removeItem("adminToken");

            // ✅ CORRECT PATH
            router.replace("/(tabs)/home");
        } catch (err) {
            Alert.alert(
                "Login Failed",
                err.response?.data?.message || "Invalid credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Logo/Icon Section */}
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        Sign in to continue to your account
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            placeholder="Enter your password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={login}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    iconText: {
        fontSize: 36,
    },
    header: {
        marginBottom: 32,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
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
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: "#111827",
        backgroundColor: "#F9FAFB",
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 12,
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
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },

    infoBadge: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoText: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
});