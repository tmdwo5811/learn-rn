import {
    createMaterialTopTabNavigator,
    type MaterialTopTabNavigationOptions,
    type MaterialTopTabNavigationEventMap,
} from "expo-router/js-top-tabs";
import {Slot, useLocalSearchParams, useRouter, withLayoutContext} from "expo-router";
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import React, {createContext, useContext, useState} from "react";
import {AuthContext} from "@/app/_layout";
import {ParamListBase, TabNavigationState} from "expo-router/react-navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import SideMenu from "@/components/SideMenu";
import Animated, {SharedValue, useSharedValue, useAnimatedStyle} from "react-native-reanimated";
import {BlurView} from "expo-blur";

const {Navigator} = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export const AnimationContext = createContext<{ pullDownPosition: SharedValue<number> }>({
    pullDownPosition: null as any,
})

export default function TabLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const {username} = useLocalSearchParams();
    const {user, login, logout} = useContext(AuthContext);
    const isLoggedIn = !!user;
    const pullDownPosition = useSharedValue(0);

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${pullDownPosition.value * 2}deg`
                }
            ]
        }
    })

    return (
        <AnimationContext value={{pullDownPosition}}>
            <View style={[
                styles.container,
                {paddingTop: insets.top, paddingBottom: insets.bottom},
                colorScheme === "dark" ? styles.containerDark : styles.containerLight
            ]}>
                <BlurView style={[styles.header, colorScheme === "dark" ? styles.headerDark : styles.headerLight]}
                          intensity={colorScheme === "dark" ? 5 : 70}>
                    {isLoggedIn && (
                        <Pressable style={styles.menuButton} onPress={() => {
                            setIsSideMenuOpen(true)
                        }}>
                            <Ionicons name="menu" size={24} color={colorScheme === "dark" ? "grey" : "black"}/>
                        </Pressable>
                    )}
                    <SideMenu isVisible={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)}/>
                    <Animated.Image
                        source={require("@/assets/images/react-logo.png")}
                        style={[styles.headerLogo, rotateStyle]}
                    />
                    {!isLoggedIn && (
                        <TouchableOpacity style={styles.loginButton} onPress={() => router.navigate(`/login`)}>
                            <Text style={styles.loginButtonText}>로그인</Text>
                        </TouchableOpacity>
                    )}
                </BlurView>
                {isLoggedIn ? (
                    <MaterialTopTabs
                        screenOptions={{
                            lazy: true,
                            tabBarStyle: {
                                backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
                                shadowColor: "transparent",
                                position: "relative"
                            },
                            tabBarPressColor: "transparent",
                            tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#555",
                            tabBarIndicatorStyle: {
                                backgroundColor: colorScheme === "dark" ? "#fff" : "#555",
                                height: 1,
                            },
                            tabBarIndicatorContainerStyle: {
                                backgroundColor: colorScheme === "dark" ? "#555" : "#aaa",
                                position: "absolute",
                                top: 48,
                                height: 1
                            }
                        }}
                    >
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
        </AnimationContext>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLight: {
        backgroundColor: "white"
    },
    containerDark: {
        backgroundColor: "black"
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        height: 50,
    },
    headerLight: {
        backgroundColor: "white"
    },
    headerDark: {
        backgroundColor: "black"
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