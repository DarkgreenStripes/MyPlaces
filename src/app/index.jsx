import LocationCard from "@/components/location-cards";
import { getLocationList, removeLocation } from "@/components/location-storage";
import * as Location from "expo-location";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const savedLocationCount = savedLocations.length;

  useEffect(() => {
    async function loadLocations() {
      try {
        const locationList = await getLocationList();
        setSavedLocations(locationList);
        setLoadError("");
      } catch (error) {
        console.error("No se pudieron cargar los lugares.", error);
        setLoadError("No se pudieron cargar los lugares.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLocations();
  }, []);

  async function handleDeleteLocation(id) {
    setIsDeleting(true);
    try {
      const locationList = await removeLocation(id);
      setSavedLocations(locationList);
      setLoadError("");
    } catch (error) {
      console.error("No se pudo eliminar el lugar.", error);
      setLoadError("No se pudo eliminar el lugar.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleGetLocation() {
    setIsGettingLocation(true);
    setCoordinates(null);
    setLocationError("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Debes conceder permiso de ubicación para mostrar las coordenadas.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.error("No se pudo obtener la ubicación.", error);
      setLocationError(
        "No se pudo obtener la ubicación. Inténtalo de nuevo más tarde.",
      );
    } finally {
      setIsGettingLocation(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>DESCUBRE ESPAÑA</Text>
        <Text style={styles.title}>MyPlaces</Text>
        <Text style={styles.subtitle}>Lugares para recordar</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {savedLocationCount}{" "}
            {savedLocationCount === 1 ? "lugar" : "lugares"}
          </Text>
        </View>
      </View>
      {loadError ? (
        <Text accessibilityLiveRegion="polite" style={styles.loadError}>
          {loadError}
        </Text>
      ) : null}
      <Text style={styles.sectionTitle}>Explora tu próximo destino</Text>
      <Link href="/descobreix" asChild>
        <Pressable accessibilityRole="button" style={styles.discoverButton}>
          <Text style={styles.discoverButtonText}>Descubre ciudades →</Text>
        </Pressable>
      </Link>
      <Link href="/accelerometre" asChild>
        <Pressable accessibilityRole="button" style={styles.sensorButton}>
          <Text style={styles.sensorButtonText}>Probar acelerómetro →</Text>
        </Pressable>
      </Link>
      <Text style={styles.locationExplanation}>
        Solo accederemos a tu ubicación cuando lo solicites para mostrar las
        coordenadas. No se utiliza en segundo plano.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={handleGetLocation}
        disabled={isGettingLocation}
        style={({ pressed }) => [
          styles.locationButton,
          (pressed || isGettingLocation) && styles.locationButtonPressed,
        ]}
      >
        <Text style={styles.locationButtonText}>
          {isGettingLocation
            ? "Obteniendo ubicación..."
            : "Utiliza mi ubicación"}
        </Text>
      </Pressable>
      {locationError ? (
        <Text accessibilityLiveRegion="polite" style={styles.locationError}>
          {locationError}
        </Text>
      ) : null}
      {coordinates ? (
        <View accessibilityLiveRegion="polite" style={styles.coordinatesCard}>
          <Text style={styles.coordinatesTitle}>Tu ubicación</Text>
          <Text style={styles.coordinatesText}>
            Latitud: {coordinates.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinatesText}>
            Longitud: {coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>Tu lista</Text>
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
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onDelete={handleDeleteLocation}
            isDeleting={isDeleting}
          />
        )}
        ListEmptyComponent={
          !isLoading && !loadError ? (
            <Text style={styles.emptyMessage}>
              No tienes lugares guardados todavía.
            </Text>
          ) : null
        }
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
  loadError: {
    marginHorizontal: 20,
    marginTop: 16,
    color: "#AA151B",
    fontSize: 14,
    fontWeight: "600",
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
  discoverButton: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#AA151B",
  },
  discoverButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sensorButton: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#6F1115",
  },
  sensorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  locationButton: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#AA151B",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  locationExplanation: {
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#6F5C4E",
    fontSize: 14,
    lineHeight: 20,
  },
  locationButtonPressed: {
    opacity: 0.8,
  },
  locationButtonText: {
    color: "#6F1115",
    fontSize: 16,
    fontWeight: "700",
  },
  locationError: {
    marginHorizontal: 20,
    marginBottom: 14,
    color: "#AA151B",
    fontSize: 14,
    fontWeight: "600",
  },
  coordinatesCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  coordinatesTitle: {
    marginBottom: 6,
    color: "#3D2B24",
    fontSize: 15,
    fontWeight: "700",
  },
  coordinatesText: {
    color: "#6F5C4E",
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyMessage: {
    paddingVertical: 24,
    color: "#6F5C4E",
    fontSize: 15,
    textAlign: "center",
  },
});
