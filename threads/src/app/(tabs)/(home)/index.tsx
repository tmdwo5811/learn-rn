import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {usePathname, useRouter} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const router = useRouter();
    const pathName = usePathname();
    const insets = useSafeAreaInsets();

    console.log("pathName", pathName);
    console.log("insets", insets);

    return (
        <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <View style={styles.tabContainer}>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.push(`/`)}>
                        <Text style={{color: pathName ==="/" ?"red": "black"}}>For you</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.push(`/following`)}>
                        <Text style={{color: pathName ==="/" ?"black": "red"}}>Following</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/1`)}>
                        <Text>게시글 1</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/2`)}>
                        <Text>게시글 2</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/3`)}>
                        <Text>게시글 3</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
      container: {
          flex: 1,
      },
    tabContainer: {
          flexDirection: "row",
    },
    tab: {
          flex: 1
    }
})