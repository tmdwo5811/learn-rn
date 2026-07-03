import {
    createMaterialTopTabNavigator,
    type MaterialTopTabNavigationOptions,
    type MaterialTopTabNavigationEventMap,
} from "expo-router/js-top-tabs";
import {useLocalSearchParams, withLayoutContext} from "expo-router";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import React, {useContext, useState} from "react";
import {AuthContext} from "@/app/_layout";
import {ParamListBase, TabNavigationState} from "expo-router/react-navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import SideMenu from "@/components/SideMenu";

const {Navigator} = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const {username} = useLocalSearchParams();
    const {user, login, logout} = useContext(AuthContext);
    const isLoggedIn = !!user;
    return (
        <View style={[
            styles.container,
            {paddingTop: insets.top, paddingBottom: insets.bottom}
        ]}>
            <View style={styles.header}>
                {isLoggedIn && (
                    <Pressable style={styles.menuButton} onPress={() => {
                        setIsSideMenuOpen(true)
                    }}>
                        <Ionicons name="menu" size={24} color="black"/>
                    </Pressable>
                )}
                <SideMenu isVisible={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)}/>
            </View>
            <View style={styles.profile}>
                <View style={styles.profileHeader}>
                    <Image source={{uri: user?.profileImageUrl}} style={styles.profileAvatar}></Image>
                    <Text>{user?.username}</Text>
                    <Text>{user?.id}</Text>
                    <Text>{user?.description}</Text>
                </View>
            </View>
            <MaterialTopTabs
                screenOptions={{
                    lazy: true,
                    tabBarStyle: {
                        backgroundColor: "white",
                        shadowColor: "transparent",
                        position: "relative"
                    },
                    tabBarPressColor: "transparent",
                    tabBarActiveTintColor: "#555",
                    tabBarIndicatorStyle: {
                        backgroundColor: "black",
                        height: 1,
                    },
                    tabBarIndicatorContainerStyle: {
                        backgroundColor: "#aaa",
                        position: "absolute",
                        top: 48,
                        height: 1
                    }
                }}>
                <MaterialTopTabs.Screen name="index" options={{title: "Threads"}}/>
                <MaterialTopTabs.Screen name="replies" options={{title: "Replies"}}/>
                <MaterialTopTabs.Screen name="reposts" options={{title: "Reposts"}}/>
            </MaterialTopTabs>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile: {},
    profileHeader: {},
    profileAvatar: {
        width: 50,
        height: 50,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50
    },
    menuButton: {
        position: "absolute",
        left: 20,
        top: 10
    },
})