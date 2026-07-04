import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {useRouter, usePathname} from "expo-router";
import {FlashList} from "@shopify/flash-list";
import {useCallback, useEffect, useState} from "react";
import Post, {Post as PostType} from "@/components/Post";
import * as Haptics from "expo-haptics";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {onScrollPhaseChange} from "@expo/ui/swift-ui/modifiers";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const colorScheme = useColorScheme();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const path = usePathname();
    useEffect(() => {
        fetch(`http://localhost:3000/posts`, {})
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
            });
    }, [path]);

    const onEndReached = useCallback(() => {
        const cursor = posts.at(-1)?.id;
        fetch(
            `http://localhost:3000/posts?${cursor ? `&cursor=${cursor}` : ""}`,
            {}
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.posts.length > 0) {
                    setPosts((prev) => [...prev, ...data.posts]);
                }
            });
    }, [posts, path])

    const onRefresh = () => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        fetch(`http://localhost:3000/posts`, {})
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
            })
            .finally(() => setRefreshing(false));
    }

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            console.log("onScroll", event.contentOffset.y);
        }
    });

    return (
        <View style={[styles.container, colorScheme === "dark" ? styles.containerDark : styles.containerLight]}>
            <AnimatedFlashList
                data={posts}
                refreshing={refreshing}
                refreshControl={<View/>}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                renderItem={({item}) => <Post item={item}/>}
                onEndReached={onEndReached}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLight: {
        backgroundColor: "white"
    },
    containerDark: {
        backgroundColor: "black"
    },
    textLight: {
        color: "white"
    },
    textDark: {
        color: "dark"
    },
});
