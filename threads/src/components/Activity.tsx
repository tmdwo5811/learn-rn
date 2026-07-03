import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useState} from "react";

type ActivityItemProps = {
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

// 활동 종류별 아바타 우하단에 표시할 배지 아이콘/색상
const typeToBadge: Record<
    string,
    {name: React.ComponentProps<typeof Ionicons>["name"]; color: string}
> = {
    like: {name: "heart", color: "#ff2d55"},
    follow: {name: "person", color: "#8e44ef"},
    reply: {name: "chatbubble", color: "#3a8fff"},
    mention: {name: "at", color: "#00b894"},
    repost: {name: "repeat", color: "#00c853"},
    quote: {name: "chatbox-ellipses", color: "#ff9500"},
    verified: {name: "checkmark-circle", color: "#3a8fff"},
};

export default function ActivityItem({
    username,
    avatar,
    timeAgo,
    content,
    type,
    postId,
    otherCount,
    reply,
}: ActivityItemProps) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [isFollowing, setIsFollowing] = useState(false);

    const badge = typeToBadge[type];

    const handlePress = () => {
        if (postId) {
            router.push(`/posts/${postId}`);
        } else {
            router.push(`/${username}`);
        }
    };

    return (
        <Pressable
            style={[styles.container, isDark ? styles.borderDark : styles.borderLight]}
            onPress={handlePress}
        >
            {/* 아바타 + 종류 배지 */}
            <TouchableOpacity onPress={() => router.push(`/${username}`)}>
                <View style={styles.avatarWrapper}>
                    <Image source={{uri: avatar}} style={styles.avatar} />
                    {badge && (
                        <View style={[styles.badge, {backgroundColor: badge.color}]}>
                            <Ionicons name={badge.name} size={12} color="white" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* 본문 */}
            <View style={styles.body}>
                <View style={styles.headerRow}>
                    <Text style={[styles.username, isDark ? styles.textDark : styles.textLight]}>
                        {username}
                        {otherCount ? (
                            <Text style={styles.subText}> 외 {otherCount}명</Text>
                        ) : null}
                    </Text>
                    <Text style={styles.timeAgo}>{timeAgo}</Text>
                </View>

                {!!content && (
                    <Text style={[styles.content, isDark ? styles.textDark : styles.textLight]}>
                        {content}
                    </Text>
                )}

                {!!reply && (
                    <View style={[styles.replyBox, isDark ? styles.borderDark : styles.borderLight]}>
                        <Text style={styles.subText} numberOfLines={2}>
                            {reply}
                        </Text>
                    </View>
                )}
            </View>

            {/* follow 종류일 때만 팔로우 버튼 */}
            {type === "follow" && (
                <TouchableOpacity
                    style={[
                        styles.followButton,
                        isFollowing
                            ? styles.followButtonActive
                            : isDark
                              ? styles.followButtonDark
                              : styles.followButtonLight,
                    ]}
                    onPress={() => setIsFollowing((prev) => !prev)}
                >
                    <Text
                        style={[
                            styles.followButtonText,
                            isFollowing
                                ? styles.followButtonTextActive
                                : isDark
                                  ? styles.textDark
                                  : styles.textLight,
                        ]}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Text>
                </TouchableOpacity>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: "flex-start",
    },
    borderLight: {
        borderColor: "#ddd",
    },
    borderDark: {
        borderColor: "#333",
    },
    avatarWrapper: {
        width: 40,
        height: 40,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
    },
    badge: {
        position: "absolute",
        right: -4,
        bottom: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    body: {
        flex: 1,
        marginLeft: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    username: {
        fontWeight: "700",
        fontSize: 15,
    },
    timeAgo: {
        marginLeft: 6,
        fontSize: 13,
        color: "#999",
    },
    content: {
        marginTop: 2,
        fontSize: 14,
        lineHeight: 19,
    },
    subText: {
        color: "#999",
        fontSize: 13,
        fontWeight: "400",
    },
    replyBox: {
        marginTop: 8,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 12,
    },
    followButton: {
        marginLeft: 8,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#888",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    followButtonLight: {
        backgroundColor: "white",
    },
    followButtonDark: {
        backgroundColor: "#101010",
    },
    followButtonActive: {
        backgroundColor: "transparent",
    },
    followButtonText: {
        fontWeight: "700",
        fontSize: 14,
    },
    followButtonTextActive: {
        color: "#999",
    },
    textLight: {
        color: "black",
    },
    textDark: {
        color: "white",
    },
});
