import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default function DiscoverScreen() {
  const [query, setQuery] = useState("Barcelona");
  const [searchTerm, setSearchTerm] = useState("Barcelona");
  const [requestId, setRequestId] = useState(0);
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function loadPlaces() {
      try {
        const url = `${API_URL}?name=${encodeURIComponent(searchTerm)}&count=10&language=ca&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        const results = data.results === undefined ? [] : data.results;
        if (!Array.isArray(results)) {
          throw new Error("La resposta de l'API no té el format esperat.");
        }

        if (active) {
          setPlaces(results);
          setStatus("success");
        }
      } catch (requestError) {
        console.error("No s'han pogut carregar les ciutats.", requestError);
        if (active) setStatus("error");
      }
    }

    loadPlaces();

    return () => {
      active = false;
    };
  }, [searchTerm, requestId]);

  function handleSearch() {
    const term = query.trim();
    if (!term) return;
    setStatus("loading");
    setSearchTerm(term);
    setRequestId((id) => id + 1);
  }

  function handleRetry() {
    setStatus("loading");
    setRequestId((id) => id + 1);
  }

  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backText}>← Volver al inicio</Text>
        </Pressable>
      </Link>
      <Text style={styles.title}>Descubre ciudades</Text>
      <TextInput
        accessibilityLabel="Nombre de la ciudad"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        placeholder="Nombre de la ciudad"
        returnKeyType="search"
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        onPress={handleSearch}
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.searchButtonText}>Buscar</Text>
      </Pressable>

      {status === "loading" ? (
        <View style={styles.status}>
          <ActivityIndicator color="#AA151B" />
          <Text>Cargando...</Text>
        </View>
      ) : status === "error" ? (
        <View style={styles.status}>
          <Text style={styles.statusText}>
            No se han podido cargar las ciudades.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleRetry}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : places.length === 0 ? (
        <Text style={styles.statusText}>No se han encontrado ciudades.</Text>
      ) : status === "success" ? (
        <FlatList
          data={places}
          keyExtractor={(place) => String(place.id)}
          renderItem={({ item }) => (
            <View style={styles.place}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text>
                {[item.admin1, item.country].filter(Boolean).join(", ")}
              </Text>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF9E8",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F1BF00",
  },
  backText: {
    color: "#6F1115",
    fontWeight: "700",
  },
  title: {
    marginBottom: 16,
    color: "#3D2B24",
    fontSize: 24,
    fontWeight: "700",
  },
  input: {
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E4D9C8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  searchButton: {
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#AA151B",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  status: {
    paddingVertical: 20,
    textAlign: "center",
  },
  statusText: {
    paddingVertical: 20,
    color: "#AA151B",
    textAlign: "center",
  },
  retryButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F1BF00",
  },
  retryButtonText: {
    color: "#6F1115",
    fontWeight: "700",
  },
  place: {
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  placeName: {
    marginBottom: 4,
    color: "#3D2B24",
    fontSize: 17,
    fontWeight: "700",
  },
});
