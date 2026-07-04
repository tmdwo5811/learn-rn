import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {useRouter, usePathname} from "expo-router";
import {FlashList} from "@shopify/flash-list";
import {useEffect, useState} from "react";
import Post, {Post as PostType} from "@/components/Post";
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        console.log("path", path);
        setPosts([]);
        fetch(`http://localhost:3000/posts?type=${path.split("/").pop()}`, {})
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
            })
    }, [path]);

    const onEndReached = () => {
        if (posts.length <= 0) {
            return;
        }

        fetch(`http://localhost:3000/posts?type=${path.split("/").pop()}&cursor=${posts.at(-1)?.id}`, {})
            .then((res) => res.json())
            .then((data) => {
                if (data.posts.length > 0) {
                    setPosts([...posts, ...data.posts]);
                }
            });
    }

    const [posts, setPosts] = useState<PostType[]>([]);

    return (
        <View style={[styles.container, colorScheme === "dark" ? styles.containerDark : styles.containerLight]}>
            <FlashList data={posts} renderItem={({item}) => <Post item={item}/>} onEndReached={onEndReached}/>
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
