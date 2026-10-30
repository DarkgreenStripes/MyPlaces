import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getLocationList } from "@/components/location-storage";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function LocationDetail() {
  const { id } = useLocalSearchParams();
  const locationId = typeof id === "string" ? id : undefined;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    getLocationList()
      .then((locationList) => {
        if (isActive) {
          setLocation(
            locationList.find((item) => item.id === locationId) ?? null,
          );
        }
      })
      .catch((error) => {
        console.error("No se pudo cargar el lugar.", error);
        if (isActive) {
          setLoadError("No se pudo cargar el lugar.");
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [locationId]);

  if (loading || loadError || !location) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.eyebrow}>MYPLACES</Text>
          <Text style={styles.title}>
            {loading
              ? "Cargando lugar..."
              : loadError || "No se encuentra el lugar."}
          </Text>
          <Link href="/" style={styles.backButton}>
            Volver a la lista
          </Link>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TU PRÓXIMA PARADA</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.category}>{location.categoria}</Text>
        </View>
        <Text style={styles.title}>{location.nombre}</Text>
        <View style={styles.accentLine} />
      </View>
      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Sobre este lugar</Text>
        <Text style={styles.description}>{location.descripcion}</Text>
      </View>
      <Link href="/" style={styles.backButton}>
        ‹  Volver a todos los lugares
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF9E8",
  },
  hero: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#AA151B",
  },
  eyebrow: {
    color: "#F1BF00",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F1BF00",
  },
  category: {
    color: "#6F1115",
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    marginTop: 14,
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  accentLine: {
    width: 48,
    height: 4,
    marginTop: 20,
    borderRadius: 2,
    backgroundColor: "#F1BF00",
  },
  descriptionCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#5A301C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#AA151B",
    fontSize: 18,
    fontWeight: "700",
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
    color: "#493B32",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F1BF00",
    color: "#6F1115",
    fontSize: 16,
    fontWeight: "700",
  },
  errorCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#AA151B",
  },
});
