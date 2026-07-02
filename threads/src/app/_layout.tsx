// 앱 열자마자 처리하고자 하는 로직 구성 가능
import {Stack, useRouter} from "expo-router";
import {createContext, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext<{
    user?: User | null;
    login?: () => Promise<void>;
    logout?: () => Promise<void>;
}>({});

interface User {
    id: string;
    description: string;
    username: string;
    profileImageUrl: string;
}

export default function RootLayout() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const login = async () => {
        console.log("login called")
        const resp = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                username: "testusername",
                password: "testpw"
            })
        })
        resp.json()
            .then(data => {
                console.log("accessToken", data.accessToken, "refreshToken", data.refreshToken)
                setUser(data.user);
                return Promise.all([
                    SecureStore.setItemAsync("refreshToken", data.refreshToken),
                    SecureStore.setItemAsync("accessToken", data.accessToken),
                    AsyncStorage.setItem("user", JSON.stringify(data.user))
                ]);
            }).then(() => {
            router.push("/(tabs)")
        })
    }
    const logout = async () => {
        setUser(null);
        await Promise.all([
            SecureStore.deleteItemAsync("accessToken"),
            SecureStore.deleteItemAsync("refreshToken"),
            AsyncStorage.removeItem("user")
        ]);

    }
    useEffect(() => {
        AsyncStorage.getItem("user").then((user) => {
            setUser(user ? JSON.parse(user) : null);
        })
        // TODO: access/login token 이 유효한지 확인


    }, [])

    return (
        <AuthContext value={{user, login, logout}}>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="modal" options={{presentation: "modal"}}/>
            </Stack>
        </AuthContext>

    )
}
