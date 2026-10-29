import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#AA151B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: "#FFF9E8" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "MyPlaces" }} />
      <Stack.Screen name="afegir" options={{ title: "Añadir lugar" }} />
      <Stack.Screen
        name="detall/location-detail"
        options={{ title: "Detalles del lugar" }}
      />
    </Stack>
  );
}
