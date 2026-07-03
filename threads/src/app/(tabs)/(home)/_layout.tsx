import {
    createMaterialTopTabNavigator,
    type MaterialTopTabNavigationOptions,
    type MaterialTopTabNavigationEventMap,
} from "expo-router/js-top-tabs";
import {Slot, useLocalSearchParams, usePathname, useRouter, withLayoutContext} from "expo-router";
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useContext, useState} from "react";
import {AuthContext} from "@/app/_layout";
import {ParamListBase, TabNavigationState} from "expo-router/react-navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import SideMenu from "@/components/SideMenu";
import {BlurView} from "expo-blur";

const {Navigator} = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const pathName = usePathname();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const {username} = useLocalSearchParams();
    const {user, login, logout} = useContext(AuthContext);
    const isLoggedIn = !!user;
    return (
        <View style={[
            styles.container,
            {paddingTop: insets.top, paddingBottom: insets.bottom}
        ]}>
            <BlurView style={styles.header} intensity={70}>
                {isLoggedIn && (
                    <Pressable style={styles.menuButton} onPress={() => {
                        setIsSideMenuOpen(true)
                    }}>
                        <Ionicons name="menu" size={24} color="black"/>
                    </Pressable>
                )}
                <SideMenu isVisible={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)}/>
                <Image
                    source={require("@/assets/images/react-logo.png")}
                    style={styles.headerLogo}
                />
                {!isLoggedIn && (
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.navigate(`/login`)}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                )}
            </BlurView>
            {isLoggedIn ? (
                <MaterialTopTabs>
                    <MaterialTopTabs.Screen name="index" options={{title: "For you"}}/>
                    <MaterialTopTabs.Screen
                        name="following"
                        options={{title: "Following"}}
                    />
                </MaterialTopTabs>
            ) : (
                <Slot/>
            )}
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
    },
    headerLogo: {
        width: 42,
        height: 42
    },
    menuButton: {
        position: "absolute",
        left: 20,
        top: 10
    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    loginButton: {
        position: "absolute",
        right: 16,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    loginButtonText: {
        color: "white"
    },
    tabContainer: {
        flexDirection: "row",
    },
})