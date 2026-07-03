import {Ionicons} from "@expo/vector-icons";
import {
    Pressable,
    Text,
    View,
    StyleSheet,
    TextInput,
    useColorScheme,
    Image,
    ScrollView,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../_layout";
import SideMenu from "../../components/SideMenu";
import {router} from "expo-router";

const lightTheme = {
    backgroundWhite: "white",
    backgroundBlack: "black",
    borderGray: "gray",
    iconBlack: "black",
    textBlack: "black",
    textWhite: "white",
    textGray: "gray",
    verifiedCheckColor: "#fff",
};

const darkTheme = {
    backgroundBlack: "#101010",
    backgroundWhite: "white",
    searchBarAreaBackgroundBlack: "#202020",
    searchBarBackground: "black",
    iconGray: "gray",
    textBlack: "black",
    textGray: "gray",
    textWhite: "white",
    verifiedCheckColor: "black",
};

type SearchUser = {
    id: string;
    name: string;
    username: string;
    profileImageUrl: string;
    bio: string;
    followers: number;
    isVerified: boolean;
};

export default function Index() {
    const insets = useSafeAreaInsets();
    const {user} = useContext(AuthContext);
    const isLoggedIn = !!user;
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/search?q=${searchQuery}`
                );
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("검색 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [searchQuery]);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    backgroundColor: isDark
                        ? darkTheme.backgroundBlack
                        : lightTheme.backgroundWhite,
                },
            ]}
        >
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isDark
                            ? darkTheme.backgroundBlack
                            : lightTheme.backgroundWhite,
                    },
                ]}
            >
                {isLoggedIn && (
                    <Pressable
                        style={styles.menuButton}
                        onPress={() => {
                            setIsSideMenuOpen(true);
                        }}
                    >
                        <Ionicons
                            name="menu"
                            size={24}
                            color={isDark ? darkTheme.textWhite : lightTheme.iconBlack}
                        />
                    </Pressable>
                )}
                <Image
                    source={{uri: "@/assets/images/react-logo.png"}}
                    style={styles.logo}
                />
                <SideMenu
                    isVisible={isSideMenuOpen}
                    onClose={() => setIsSideMenuOpen(false)}
                />
            </View>
            <View
                style={[
                    styles.searchBarArea,
                    {
                        backgroundColor: isDark
                            ? darkTheme.searchBarAreaBackgroundBlack
                            : lightTheme.backgroundWhite,
                    },
                ]}
            >
                <View
                    style={[
                        styles.searchBar,
                        {
                            backgroundColor: isDark
                                ? darkTheme.searchBarBackground
                                : lightTheme.backgroundWhite,
                            borderColor: lightTheme.borderGray,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Ionicons
                        name="search"
                        size={24}
                        color={isDark ? darkTheme.iconGray : lightTheme.iconBlack}
                    />
                    <TextInput
                        style={[
                            styles.searchInput,
                            {
                                color: isDark ? darkTheme.textWhite : lightTheme.textBlack,
                            },
                        ]}
                        placeholder="Search"
                        placeholderTextColor={lightTheme.textGray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>
            <ScrollView
                style={styles.searchResults}
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    style={[
                        styles.searchResultsTitle,
                        {color: isDark ? darkTheme.textWhite : lightTheme.textBlack},
                    ]}
                >
                    팔로우 추천
                </Text>
                <View style={styles.searchResultsList}>
                    {users.map((searchUser) => (
                        <Pressable
                            key={searchUser.id}
                            onPress={() => router.push(`/profile`)}
                            style={styles.searchResultsItemContainer}
                        >
                            <Image
                                source={{uri: searchUser.profileImageUrl}}
                                style={styles.searchResultsItemImage}
                            />
                            <View style={styles.searchResultsItemName}>
                                <View style={styles.searchResultsItemNameTextContainer}>
                                    <View>
                                        <View style={styles.searchResultsItemNameIdTextContainer}>
                                            <Text
                                                style={[
                                                    styles.searchResultsItemNameIdText,
                                                    {
                                                        color: isDark
                                                            ? darkTheme.textWhite
                                                            : lightTheme.textBlack,
                                                    },
                                                ]}
                                            >
                                                {searchUser.username}
                                            </Text>
                                            {searchUser.isVerified && (
                                                <View style={styles.searchResultsItemNameVerifiedIcon}>
                                                    <Ionicons
                                                        name="checkmark-sharp"
                                                        size={9}
                                                        color={
                                                            isDark
                                                                ? darkTheme.verifiedCheckColor
                                                                : lightTheme.verifiedCheckColor
                                                        }
                                                    />
                                                </View>
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                styles.searchResultsItemNameNicknameText,
                                                {
                                                    color: isDark
                                                        ? darkTheme.textGray
                                                        : lightTheme.textGray,
                                                },
                                            ]}
                                        >
                                            {searchUser.name}
                                        </Text>
                                    </View>
                                    <Pressable
                                        style={[
                                            styles.searchResultsItemFollowButton,
                                            {
                                                backgroundColor: isDark
                                                    ? darkTheme.backgroundWhite
                                                    : lightTheme.backgroundBlack,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.searchResultsItemFollowButtonText,
                                                {
                                                    color: isDark
                                                        ? darkTheme.textBlack
                                                        : lightTheme.textWhite,
                                                },
                                            ]}
                                        >
                                            팔로우
                                        </Text>
                                    </Pressable>
                                </View>
                                <Text
                                    style={[
                                        styles.searchResultsItemDescription,
                                        {
                                            color: isDark ? darkTheme.textWhite : lightTheme.textGray,
                                        },
                                    ]}
                                >
                                    {searchUser.bio}
                                </Text>
                                <View>
                                    <Text
                                        style={[
                                            styles.searchResultsItemNameFollowerCount,
                                            {
                                                color: isDark
                                                    ? darkTheme.textGray
                                                    : lightTheme.textGray,
                                            },
                                        ]}
                                    >
                                        팔로워 {searchUser.followers}명
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        width: 32,
        height: 32,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
    menuButton: {
        position: "absolute",
        left: 16,
    },
    searchBarArea: {
        flexDirection: "row",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    searchBar: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 30,
    },
    searchInput: {
        marginLeft: 10,
    },
    searchResults: {
        flex: 1,
    },
    searchResultsTitle: {
        fontSize: 16,
        fontWeight: "600",
        paddingTop: 15,
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    searchResultsList: {
        flexDirection: "column",
        paddingTop: 15,
        paddingLeft: 20,
    },
    searchResultsItemContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 15,
    },
    searchResultsItemImage: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 20,
    },
    searchResultsItemName: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 3,
        borderBottomWidth: 1,
        borderColor: "#333",
        paddingRight: 20,
        paddingBottom: 15,
    },
    searchResultsItemNameIdText: {
        fontSize: 16,
        fontWeight: "600",
    },
    searchResultsItemNameNicknameText: {
        fontSize: 16,
        fontWeight: "400",
    },
    searchResultsItemDescription: {
        marginTop: 5,
    },
    searchResultsItemFollowButton: {
        paddingHorizontal: 28,
        paddingVertical: 8,
        borderRadius: 8,
    },
    searchResultsItemFollowButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    searchResultsItemNameTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    searchResultsItemNameIdTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    searchResultsItemNameVerifiedIcon: {
        width: 14,
        height: 14,
        borderRadius: 9,
        backgroundColor: "#0095F6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dotted",
        borderColor: "#0095F6",
    },
    searchResultsItemNameFollowerCount: {
        fontSize: 14,
        marginTop: 12,
    },
});
