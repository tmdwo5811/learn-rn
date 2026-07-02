import {Tabs, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import React, {useRef, useState} from "react";
import {Modal, View, Text, TouchableOpacity, Pressable, StyleSheet, Animated} from "react-native";
import {BottomTabBarButtonProps} from "expo-router/js-tabs";

const AnimatedTabBarButton = ({children, onPress, style, ref, ...restProps}: BottomTabBarButtonProps) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressOut = () => {
        // 어떤거를 어떤거로 옮기는것임(애니메이션)
        Animated.sequence([
            Animated.spring(scaleValue, {
                toValue: 1.2,
                useNativeDriver: true,
                speed: 100,
            }),
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                speed: 100,
            })
        ])
            .start();
    }
    const handlePressIn = () => {
    }
    return (
        <Pressable
            {...restProps}
            onPress={onPress}
            onPressIn={handlePressIn} // mouse down
            onPressOut={handlePressOut} // mouse up(뗄때)
            style={[
                {flex: 1, justifyContent: "center", alignItems: "center"},
                style,
            ]}
            android_ripple={{borderless: false, radius: 0}}
        >
            <Animated.View style={{transform: [{scale: scaleValue}]}}>
                {children}
            </Animated.View>
        </Pressable>
    );
}

export default function TabLayout() {
    const router = useRouter();
    const isLoggedIn = false;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    }

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    }

    const toLoginPage = () => {
        setIsLoginModalOpen(false);
        router.push("/login");
    }

    return (
        <>
            <Tabs
                backBehavior="history"
                screenOptions={{
                    headerShown: false,
                    tabBarButton: (props) => <AnimatedTabBarButton {...props}/>
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name="home"
                                size={24}
                                color={focused ? "black" : "gray"}/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name="search"
                                size={24}
                                color={focused ? "black" : "gray"}/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="add"
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault() // 페이지 이동하지 않게 아무일도 일어나지 않음
                            if (!isLoggedIn) {
                                openLoginModal();
                                return;
                            }
                            router.navigate("/modal");
                        }
                    }}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name="add"
                                size={24}
                                color={focused ? "black" : "gray"}/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="activity"
                    listeners={{
                        tabPress: (e) => {
                            if (!isLoggedIn) {
                                e.preventDefault() // 페이지 이동하지 않게 아무일도 일어나지 않음
                                openLoginModal();
                                return;
                            }
                        }
                    }}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name="heart-outline"
                                size={24}
                                color={focused ? "black" : "gray"}/>
                        )
                    }}/>
                <Tabs.Screen
                    name="[username]"
                    listeners={{
                        tabPress: (e) => {
                            if (!isLoggedIn) {
                                e.preventDefault() // 페이지 이동하지 않게 아무일도 일어나지 않음
                                openLoginModal();
                                return;
                            }
                        }
                    }}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={focused ? "black" : "gray"}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(post)/[username]/post/[postId]"
                    options={{
                        href: null
                    }}
                />
                <Tabs.Screen
                    name="following"
                    options={{
                        tabBarLabel: () => null,
                        href: null
                    }}
                />
            </Tabs>
            <Modal visible={isLoginModalOpen} transparent={true} animationType="slide">
                <View style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}>
                    <View style={{
                        backgroundColor: "white",
                        padding: 20
                    }}>
                        <Pressable onPress={toLoginPage}>
                            <Text>로그인 모달</Text>
                        </Pressable>

                        <TouchableOpacity onPress={closeLoginModal}>
                            <Ionicons name={"close"} size={24} color="#555"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({});