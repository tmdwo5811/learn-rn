// 앱 열자마자 처리하고자 하는 로직 구성 가능
import {Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{presentation: "modal"}} />
      </Stack>
  )
}
