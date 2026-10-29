import { locations } from "@/app/data/id";
import { Link, useFocusEffect } from "expo-router";
import Card from "@/components/location-cards";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [savedLocations, setSavedLocations] = useState([...locations]);

  useFocusEffect(
    useCallback(() => {
      setSavedLocations([...locations]);
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>DESCUBRE ESPAÑA</Text>
        <Text style={styles.title}>MyPlaces</Text>
        <Text style={styles.subtitle}>Lugares para recordar</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{savedLocations.length} lugares</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Explora tu próximo destino</Text>
      <Link href="/afegir" asChild>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>＋ Añadir un lugar</Text>
        </Pressable>
      </Link>
      <FlatList
        data={savedLocations}
        keyExtractor={(location) => location.id}
        renderItem={({ item }) => <Card location={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E8",
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: "#AA151B",
  },
  eyebrow: {
    color: "#F1BF00",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 16,
    color: "#FFE9B0",
  },
  countBadge: {
    alignSelf: "flex-start",
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1BF00",
  },
  countText: {
    color: "#6F1115",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
    color: "#3D2B24",
    fontSize: 19,
    fontWeight: "700",
  },
  addButton: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F1BF00",
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: "#6F1115",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
