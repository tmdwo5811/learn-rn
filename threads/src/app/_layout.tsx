// 앱 열자마자 처리하고자 하는 로직 구성 가능
import {Stack, useRouter} from "expo-router";
import {createContext, useContext, useEffect, useRef, useState} from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Asset} from "expo-asset";
import {Animated, Linking, StyleSheet, View} from "react-native";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import Toast, {BaseToast} from "react-native-toast-message";

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
    handleSuccess(notificationId) {
        console.log(`Notification with ID ${notificationId} was successfully displayed.`);
    },
    handleError(error) {
        console.error('Error displaying notification:', error);
    },
});

SplashScreen.preventAutoHideAsync().catch(() => {

})

export interface User {
    id: string;
    description: string;
    name: string;
    profileImageUrl: string;
    link: string;
    showInstagramBadge: boolean;
    isPrivate: boolean
}


export const AuthContext = createContext<{
    user?: User | null;
    login?: () => Promise<void>;
    logout?: () => Promise<void>;
    updateUser?: (user: User) => void;
}>({});


async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: {someData: "goes here"},
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
}

function AnimatedAppLoader({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isSplashReady, setIsSplashReady] = useState(false);

    const image = require("@/assets/images/react-logo.png");
    useEffect(() => {
        async function prepare() {
            await Asset.loadAsync(image);
            setIsSplashReady(true);
        }

        prepare();
    }, [image])
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
    const updateUser = (user: User) => {
        setUser(user);
        if (user) {
            AsyncStorage.setItem("user", JSON.stringify(user));
            return;
        }
        AsyncStorage.removeItem("user");
    }
    const logout = async () => {
        setUser(null);
        await Promise.all([
            SecureStore.deleteItemAsync("accessToken"),
            SecureStore.deleteItemAsync("refreshToken"),
            AsyncStorage.removeItem("user")
        ]);

    }
    if (!isSplashReady) {
        return null;
    }
    return (
        <AuthContext value={{user, login, logout, updateUser}}>
            <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
        </AuthContext>
    )
}

function AnimatedSplashScreen({children, image}: { children: React.ReactNode, image: number }) {
    const [isAppReady, setIsAppReady] = useState(false);
    const [isSplashAnimationComplete, setIsSplashAnimationComplete] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const animation = useRef(new Animated.Value(1)).current;
    const {updateUser} = useContext(AuthContext);
    const onImageLoaded = async () => {
        try {
            await AsyncStorage.getItem("user").then((user) => {
                updateUser?.(user ? JSON.parse(user) : null);
            })
            await SplashScreen.hideAsync();
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permissions not granted');
                return Linking.openSettings();
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
            });
            console.log('Expo Push Token:', token.data);
            setExpoPushToken(token.data);
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Look at that notification',
                    body: "I'm so proud of myself!",
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5
                },
            });
            console.log(`Notification scheduled with ID: ${notificationId}`);
        } catch (e) {
            console.log(e);
        } finally {
            setIsAppReady(true);
        }
    }

    useEffect(() => {
        if (expoPushToken) {
            sendPushNotification(expoPushToken);
        }
    }, [expoPushToken]);

    useEffect(() => {
        if (isAppReady) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true
            }).start(() => {
                setIsSplashAnimationComplete(true);
            });
        }
    }, [isAppReady]);

    const rotateValue = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["360deg", "0deg"]
    })
    return (
        <View style={{flex: 1}}>
            {isAppReady && children}
            {!isSplashAnimationComplete && (
                <Animated.View pointerEvents="none" style={[{
                    ...StyleSheet.absoluteFill,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Constants.expoConfig?.splash?.backgroundColor || "#fff",
                    opacity: animation
                },
                ]}>
                    <Animated.Image
                        source={image}
                        resizeMode={Constants.expoConfig?.splash?.resizeMode || "contain"}
                        style={{
                            width: Constants.expoConfig?.splash?.imageScale || 100,
                            resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
                            transform: [{scale: animation}, {rotate: rotateValue}]
                        }}
                        onLoadEnd={onImageLoaded}
                        fadeDuration={0}
                    />
                </Animated.View>
            )}
        </View>
    )
}

export default function RootLayout() {

    const toastConfig = {
        customToast: (props: any) => (
            <BaseToast
                style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    height: 40,
                    borderLeftWidth: 0,
                    shadowOpacity: 0,
                    justifyContent: "center",
                }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    alignItems: "center",
                    height: 40,
                }}
                text1Style={{
                    color: "black",
                    fontSize: 14,
                    fontWeight: "500",
                }}
                text1={props.text1}
                onPress={props.onPress}
            />
        ),
    };
    return (
        <AnimatedAppLoader>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="modal" options={{presentation: "modal"}}/>
            </Stack>
            <Toast config={toastConfig}/>
        </AnimatedAppLoader>
    )
}
