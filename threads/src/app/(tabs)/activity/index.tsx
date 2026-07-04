import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    useColorScheme,
    Image,
    ScrollView,
} from "react-native";
import {usePathname, useRouter} from "expo-router";
import NotFound from "../../+not-found";
import {Ionicons} from "@expo/vector-icons";
import SideMenu from "../../../components/SideMenu";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../_layout";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ActivityItem from "../../../components/Activity";

type ActivityItemData = {
    id: string;
    username: string;
    avatar: string;
    timeAgo: string;
    content: string;
    type: string;
    postId?: string;
    otherCount?: number;
    likes?: number;
    reply?: string;
};

const pathnameToType: Record<string, string> = {
    "/activity": "all",
    "/activity/follows": "follows",
    "/activity/replies": "replies",
    "/activity/mentions": "mentions",
    "/activity/quotes": "quotes",
    "/activity/reposts": "reposts",
    "/activity/verified": "verified",
};

export default function Index() {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const {user} = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isLoggedIn = !!user;
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [activities, setActivities] = useState<ActivityItemData[]>([]);

    useEffect(() => {
        const typeParam = pathnameToType[pathname] || "all";
        const fetchActivities = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/activity?type=${typeParam}`
                );
                const data = await response.json();
                setActivities(data.activities ?? []);
            } catch (error) {
                console.error("활동 목록 조회 실패", error);
            }
        };
        fetchActivities();
    }, [pathname]);

    if (
        ![
            "/activity",
            "/activity/follows",
            "/activity/replies",
            "/activity/mentions",
            "/activity/quotes",
            "/activity/reposts",
            "/activity/verified",
        ].includes(pathname)
    ) {
        return <NotFound/>;
    }

    return (
        <View
            style={[
                styles.container,
                {paddingTop: insets.top, paddingBottom: insets.bottom},
                colorScheme === "dark" ? styles.containerDark : styles.containerLight,
            ]}
        >
            <View
                style={[
                    styles.header,
                    colorScheme === "dark" ? styles.headerDark : styles.headerLight,
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
                            color={colorScheme === "dark" ? "gray" : "black"}
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
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabBarScroll}
                contentContainerStyle={styles.tabBarContent}
            >
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/follows" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/follows`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Follows
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/replies" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/replies`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Replies
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/mentions" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/mentions`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Mentions
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/quotes" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/quotes`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Quotes
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/reposts" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/reposts`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Reposts
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            colorScheme === "dark"
                                ? styles.tabButtonDark
                                : styles.tabButtonLight,
                            pathname === "/activity/verified" &&
                            (colorScheme === "dark"
                                ? styles.tabButtonActiveDark
                                : styles.tabButtonActiveLight),
                        ]}
                        onPress={() => router.replace(`/activity/verified`)}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                colorScheme === "dark"
                                    ? styles.tabButtonTextDark
                                    : styles.tabButtonTextLight,
                            ]}
                        >
                            Verified
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ScrollView>
                {activities.map((activity) => (
                    <ActivityItem
                        key={activity.id}
                        id={activity.id}
                        username={activity.username}
                        timeAgo={activity.timeAgo}
                        content={activity.content}
                        type={activity.type}
                        avatar={activity.avatar}
                        postId={activity.postId}
                        otherCount={activity.otherCount}
                        likes={activity.likes}
                        reply={activity.reply}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLight: {
        backgroundColor: "white",
    },
    containerDark: {
        backgroundColor: "#101010",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
    headerLight: {
        backgroundColor: "white",
    },
    headerDark: {
        backgroundColor: "#101010",
    },
    menuButton: {
        position: "absolute",
        left: 16,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 7,
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#aaa",
        backgroundColor: "#101010",
    },
    tabButtonLight: {
        backgroundColor: "white",
    },
    tabButtonDark: {
        backgroundColor: "#101010",
    },
    tabButtonActiveLight: {
        backgroundColor: "#eee",
    },
    tabButtonActiveDark: {
        backgroundColor: "#202020",
    },
    tabButtonText: {
        fontSize: 16,
        fontWeight: "900",
    },
    tabButtonTextLight: {
        color: "black",
    },
    tabButtonTextDark: {
        color: "white",
    },
    tabBarScroll: {
        height: 60,
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
    },
    tabBarContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    logo: {
        width: 32,
        height: 32,
    },
});
