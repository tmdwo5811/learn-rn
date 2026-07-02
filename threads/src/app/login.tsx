import {Redirect, useRouter} from "expo-router";
import {Pressable, Text, View, StyleSheet} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function Login() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const isLoggedIn = false;
    if (isLoggedIn) {
        return <Redirect href="/(tabs)"/>
    }

    const onLogin = async () => {
        const resp = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                username: "testusername",
                password: "testpw"
            })
        })
        resp.json().then(data => {
            console.log("data", data)
        })
    }

    return (
        <View style={{paddingTop: insets.top}}>
            <Pressable onPress={() => router.back()}>
                <Text>Back</Text>
            </Pressable>
            <Pressable style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.loginButtonText}>
                    Login
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: "center",
    },
    loginButtonText: {
        color: "white",
        fontWeight: "bold",
    }
})