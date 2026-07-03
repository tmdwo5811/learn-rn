import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {useRouter} from "expo-router";
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    return (
        <View style={[styles.container, colorScheme === "dark" ? styles.containerDark : styles.containerLight]}>
            <View>
                <TouchableOpacity onPress={() => router.push(`/@santj5811/post/1`)}>
                    <Text style={colorScheme === "dark" ? styles.textLight : styles.textDark}>게시글 1</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/@santj5811/post/2`)}>
                    <Text style={colorScheme === "dark" ? styles.textLight : styles.textDark}>게시글 2</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/@santj5811/post/3`)}>
                    <Text style={colorScheme === "dark" ? styles.textLight : styles.textDark}>게시글 3</Text>
                </TouchableOpacity>
            </View>
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
