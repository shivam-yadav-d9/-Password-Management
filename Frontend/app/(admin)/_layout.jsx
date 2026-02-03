import { Drawer } from "expo-router/drawer";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("adminToken").then((token) => {
      setAllowed(!!token);
    });
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("adminToken");
    router.replace("/(auth)/login");
  };

  if (allowed === null) return null;
  if (!allowed) return <Redirect href="/(auth)/login" />;

  return (
    <>
      <StatusBar style="light" backgroundColor="#2563EB" />

      <Drawer
        screenOptions={{
          headerTitle: "Admin Dashboard",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#2563EB" },
          headerTintColor: "#FFFFFF",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ paddingRight: 16 }}>
              <Ionicons name="log-out-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen name="dashboard" options={{ drawerLabel: "Dashboard" }} />
        <Drawer.Screen name="users" options={{ drawerLabel: "All Users" }} />
        <Drawer.Screen name="update-user" options={{ drawerLabel: "Delete User" }} />
        <Drawer.Screen
          name="organization"
          options={{ drawerLabel: "Organization" }}
        />
      </Drawer>
    </>
  );
}
