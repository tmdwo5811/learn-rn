import { Tabs, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Fragment, useState} from "react";
import {Modal, View, Text, TouchableOpacity} from "react-native";

export default function TabLayout() {
    const router =  useRouter();
    const isLoggedIn = true;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    }

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    }

    return (
        <>
            <Tabs
                backBehavior="history"
                screenOptions={{
                    headerShown: false,
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
                                color={focused ? "black" : "gray"} />
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
                                color={focused ? "black" : "gray"} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="add"
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault() // 페이지 이동하지 않게 아무일도 일어나지 않음
                            if(!isLoggedIn){
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
                                color={focused ? "black" : "gray"} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="activity"
                    listeners={{
                        tabPress: (e) => {
                            if(!isLoggedIn){
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
                                 color={focused ? "black" : "gray"} />
                         )
                     }}/>
                <Tabs.Screen
                    name="[username]"
                    listeners={{
                        tabPress: (e) => {
                            if(!isLoggedIn){
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
                        padding: 20}}>
                        <Text>로그인 모달</Text>
                        <TouchableOpacity onPress={closeLoginModal}>
                            <Ionicons name={"close"} size={24} color="#555" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}