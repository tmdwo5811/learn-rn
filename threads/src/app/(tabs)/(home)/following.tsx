import {StyleSheet, Text, TouchableOpacity, useColorScheme, View, PanResponder} from "react-native";
import {useRouter, usePathname} from "expo-router";
import {FlashList} from "@shopify/flash-list";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import Post, {Post as PostType} from "@/components/Post";
import * as Haptics from "expo-haptics";
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {AnimationContext} from "@/app/(tabs)/(home)/_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);
// 주소는 변경되지만 화면은 공유해서 사용하는 영역
export default function Following() {
    const colorScheme = useColorScheme();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const isReadyToRefresh = useSharedValue(false); // pull down refresh를 위한 상태값
    const path = usePathname();

    // 아래 값들은 useRef 같이 자주 바뀌되 렌더링을 트리거하지 않아야 하는 값들을 useSharedValue로 관리
    // 네이티브단 에서 애니메이션을 수행할 때, JS 스레드와 네이티브 스레드 간의 통신을 최소화하기 위해 useSharedValue를 사용
    const scrollPosition = useSharedValue(0);
    const {pullDownPosition} = useContext(AnimationContext);

    useEffect(() => {
        fetch(`http://localhost:3000/posts?type=following`, {})
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
            });
    }, [path]);

    const onEndReached = useCallback(() => {
        const cursor = posts.at(-1)?.id;
        fetch(
            `http://localhost:3000/posts?type=following&${cursor ? `&cursor=${cursor}` : ""}`,
            {}
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.posts.length > 0) {
                    setPosts((prev) => [...prev, ...data.posts]);
                }
            });
    }, [posts, path])

    const onRefresh = (done: () => void) => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        fetch(`http://localhost:3000/posts`, {})
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
            })
            .finally(() => done());
    }

    const onPanRelease = () => {
        pullDownPosition.value = withTiming(isReadyToRefresh.value ? 60 : 0, {duration: 180}); // 땡긴 후 손을 떼면 pullDownPosition 초기화
        if (isReadyToRefresh.value) {
            onRefresh(() => {
                pullDownPosition.value = withTiming(0, {
                    duration: 180
                });
            });
        }
    }

    const panResponderRef = useRef(
        PanResponder.create({
            // 맨 위(스크롤 top)에서 아래로 당길 때만 제스처를 가져온다.
            // 그 외에는 FlashList가 정상적으로 스크롤하도록 양보한다.
            onMoveShouldSetPanResponder: (event, gestureState) => {
                return scrollPosition.value <= 0 && gestureState.dy > 0;
            },
            onPanResponderMove: (event, gestureState) => {
                // 스크롤 하다보면 해당 함수가 호출됨
                console.log("onPanResponderMove", gestureState.dy); // y 축으로 얼마나 변했는가?
                const max = 120;
                pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0); // pullDownPosition에 현재 땡긴 거리 저장

                if (pullDownPosition.value >= max / 2 && !isReadyToRefresh.value) {
                    isReadyToRefresh.value = true;
                }

                if (pullDownPosition.value < max / 2 && isReadyToRefresh.value) {
                    isReadyToRefresh.value = false;
                }
            },
            onPanResponderRelease: onPanRelease,
            onPanResponderTerminate: onPanRelease
        })
    )

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            console.log("onScroll", event.contentOffset.y);
            scrollPosition.value = event.contentOffset.y;
        }
    });

    const pullDownStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: pullDownPosition.value}],
        };
    });

    return (
        // 고정된 회색 backdrop 레이어. 평상시엔 아래 흰색 목록이 완전히 덮어 안 보이고,
        // 당길 때 흰색 목록이 내려가면서 이 회색이 상단 틈으로 드러난다.
        <View style={[
            styles.container,
            colorScheme === "dark" ? styles.backdropDark : styles.backdropLight
        ]}>
            <Animated.View
                style={[
                    styles.container,
                    colorScheme === "dark" ? styles.containerDark : styles.containerLight,
                    pullDownStyle
                ]}
                {...panResponderRef.current.panHandlers}
            >
                <AnimatedFlashList
                    data={posts}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    renderItem={({item}) => <Post item={item}/>}
                    onEndReached={onEndReached}/>
            </Animated.View>
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
    backdropLight: {
        backgroundColor: "#eee" // 당길 때 드러나는 연한 회색
    },
    backdropDark: {
        backgroundColor: "#222"
    },
    textLight: {
        color: "white"
    },
    textDark: {
        color: "dark"
    },
});
