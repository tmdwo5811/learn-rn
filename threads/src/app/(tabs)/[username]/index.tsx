import {StyleSheet, Text, View} from "react-native";
import React from "react";

export default function Index() {


    return (
        <View style={styles.tabBar}>
            <Text>게시글 목록 화면</Text>
        </View>

    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})