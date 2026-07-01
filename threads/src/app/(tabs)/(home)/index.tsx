import {Text, TouchableOpacity, View} from "react-native";
import {usePathname, useRouter} from "expo-router";
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Index() {
    const router = useRouter();
    const pathName = usePathname();
    console.log("pathName", pathName);
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View>
                <TouchableOpacity onPress={() => router.push(`/`)}>
                    <Text style={{color: pathName ==="/" ?"red": "black"}}>For you</Text>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity onPress={() => router.push(`/following`)}>
                    <Text style={{color: pathName ==="/" ?"black": "red"}}>Following</Text>
                </TouchableOpacity>
            </View>
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
