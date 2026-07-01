import {Text, TouchableOpacity, View} from "react-native";
import {usePathname, useRoutePath, useRouter} from "expo-router";
import NotFound from "@/app/+not-found";

export default function Index() {
    const router = useRouter();
    const pathname = usePathname();
    if(![
        "/activity",
        "/activity/follows",
        "/activity/replies",
        "/activity/mentions",
        "/activity/quotes",
        "/activity/verified"].includes(pathname)
    ) {
        return <NotFound />
    }
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity`)}>
                    <Text>All</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity/follows`)}>
                    <Text>Follows</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity/replies`)}>
                    <Text>Replies</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity/mentions`)}>
                    <Text>Mentions</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity/quotes`)}>
                    <Text>Quotes</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push(`/activity/verified`)}>
                    <Text>Verified</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
