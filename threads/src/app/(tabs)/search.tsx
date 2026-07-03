import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext, User} from "@/app/_layout";
import {Ionicons} from "@expo/vector-icons";
import SideMenu from "@/components/SideMenu";
import {BlurView} from "expo-blur";
import {useRouter} from "expo-router";
import hairlineWidth = StyleSheet.hairlineWidth;
import {Button} from "@expo/ui";

function FollowSuggestionList() {
    const [users, setUsers] = useState<{
        id: string;
        username: string;
        name: string;
        description: string;
        profileImageUrl: string;
        isFollow: boolean;
        followerCount: number;
        isVerified: boolean;
    }[]>([]);
    useEffect(() => {
        fetch("/follow-suggestions", {
            method: "GET"
        }).then(response => response.json().then(data => {
            console.log("follow-suggestions", data)
            const users = data.users;
            setUsers(users);
        })).catch(error => {
            console.error("Error fetching follow suggestions:", error);
        });
    }, []);
    return (
        <FlatList
            data={users} keyExtractor={(user) => user.id} renderItem={({item}) =>
            <View style={{padding: 15}}>
                <Image source={{uri: item.profileImageUrl}} style={{borderRadius: 100, width: 50, height: 50}}></Image>
                <TouchableOpacity style={styles.followButton} onPress={() => {
                    setUsers(prevUsers => prevUsers.map(user => {
                        if (user.id === item.id) {
                            return {...user, isFollow: !user.isFollow};
                        }
                        return user;
                    }));
                }}>
                    <Text style={{fontWeight: "bold"}}>{item.isFollow ? "Follow Back" : "Follow"}</Text>
                </TouchableOpacity>
                <Text>{item.name}</Text>
                <Text>{item.username}</Text>
                <Text>{item.description}</Text>
                <Text>{item.followerCount} followers</Text>
                <Text>{item.isVerified ? "Verified" : "Not Verified"}</Text>

            </View>
        }>
        </FlatList>
    )
}


export default function Index() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    console.log("colorScheme", colorScheme)
    const router = useRouter();

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {user, login, logout} = useContext(AuthContext);
    const isLoggedIn = !!user;
    return (
        <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <BlurView style={[styles.header, colorScheme === "dark" ? styles.headerDark : styles.headerLight]}
                      intensity={colorScheme === "dark" ? 5 : 70}>
                {isLoggedIn && (
                    <Pressable style={styles.menuButton} onPress={() => {
                        setIsSideMenuOpen(true)
                    }}>
                        <Ionicons name="menu" size={24} color={colorScheme === "dark" ? "grey" : "black"}/>
                    </Pressable>
                )}
                <Image
                    source={require("@/assets/images/react-logo.png")}
                    style={styles.headerLogo}
                />
                <SideMenu isVisible={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)}/>
                <Pressable style={styles.menuButton} onPress={() => {
                    setIsSideMenuOpen(true)
                }}><Ionicons name="menu" size={24} color="black"/>
                </Pressable>
                <SideMenu isVisible={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)}/>
            </BlurView>
            <View style={styles.searchBar}>
                <TextInput style={styles.searchInput}
                           placeholder="Search"
                           value={searchQuery}
                           onChangeText={setSearchQuery}/>
            </View>
            <View style={styles.fieldTitle}>
                <Text style={styles.fieldTitleText}>
                    Follow suggestions
                </Text>
            </View>
            <FollowSuggestionList/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        height: 50,
    },
    menuButton: {
        position: "absolute",
        right: 20,
        top: 10
    },
    searchBar: {
        marginTop: 10,
        alignItems: "center",
    },
    searchInput: {
        width: "90%",
        height: 40,
        borderColor: "gray",
        borderWidth: hairlineWidth,
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    fieldTitle: {
        padding: 10,
        borderWidth: 1
    },
    fieldTitleText: {
        fontSize: 16,
        fontWeight: "bold"
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
    followButton: {
        position: "absolute",
        right: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 35,
        backgroundColor: "#fff",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 15,
    }
})