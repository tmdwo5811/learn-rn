import {Text, TouchableOpacity, View, StyleSheet, Image, Dimensions} from "react-native";
import {usePathname, useRouter} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {BlurView} from "expo-blur";
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const router = useRouter();
    const pathName = usePathname();
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;

    console.log("pathName", pathName);
    console.log("insets", insets);

    const {width, height} = Dimensions.get("window");
    console.log(`화면 너비: ${width}dp, 화면 높이: ${height}dp`);

    return (
        <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <BlurView style={styles.header} intensity={70}>
                <Image
                    source={require("@/assets/images/react-logo.png")}
                    style={styles.headerLogo}
                />
                {!isLoggedIn && (
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.navigate(`/login`)}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                )}
            </BlurView>
            {isLoggedIn && (<View style={styles.tabContainer}>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.navigate(`/`)}>
                        <Text style={{color: pathName ==="/" ?"red": "black"}}>For you</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => router.navigate(`/following`)}>
                        <Text style={{color: pathName ==="/" ?"black": "red"}}>Following</Text>
                    </TouchableOpacity>
                </View>
            </View>)}

                <View>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/1`)}>
                        <Text>게시글 1</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/2`)}>
                        <Text>게시글 2</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => router.push(`/@santj5811/post/3`)}>
                        <Text>게시글 3</Text>
                    </TouchableOpacity>
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
      flex: 1,
      alignItems:"center"
    },
    header: {
      alignItems: "center",
    },
    headerLogo: {
      width: 42,
      height: 42
    },
    loginButton: {
          position: "absolute",
        right: 10,
        top:0,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    loginButtonText: {
          color: "white"
    }
})