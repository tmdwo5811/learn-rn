import { Tabs, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    const router =  useRouter();
    return (
        <Tabs
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
    );
}