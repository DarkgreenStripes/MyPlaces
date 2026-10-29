import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Card({ location }) {
  return (
    <Link
      href={{
        pathname: "/detall/location-detail",
        params: { id: location.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ${location.nombre}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.cardContent}>
          <View style={styles.numberBadge}>
            <Text style={styles.number}>{location.id.padStart(2, "0")}</Text>
          </View>
          <View style={styles.textContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.category}>{location.categoria}</Text>
            </View>
            <Text style={styles.name}>{location.nombre}</Text>
            <Text style={styles.action}>VER LUGAR  ›</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 5,
    borderLeftColor: "#F1BF00",
    shadowColor: "#5A301C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  numberBadge: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#FFF1BD",
  },
  number: {
    color: "#AA151B",
    fontSize: 17,
    fontWeight: "800",
  },
  textContent: {
    flex: 1,
    marginLeft: 14,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#FCE8E5",
  },
  name: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#3D2B24",
  },
  category: {
    color: "#922027",
    fontSize: 12,
    fontWeight: "600",
  },
  action: {
    marginTop: 10,
    color: "#AA151B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
