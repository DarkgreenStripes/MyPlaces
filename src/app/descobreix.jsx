import { Link } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
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
const NETWORK_TYPES = {
  wifi: "Wi-Fi",
  cellular: "Datos móviles",
  ethernet: "Ethernet",
  none: "Sin conexión",
};

export default function DiscoverScreen() {
  const { type, isConnected, isInternetReachable } = useNetInfo();
  const isOffline =
    isConnected === false || isInternetReachable === false;
  const isCheckingConnection = isConnected === null;
  const [query, setQuery] = useState("Barcelona");
  const [searchTerm, setSearchTerm] = useState("Barcelona");
  const [requestId, setRequestId] = useState(0);
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    if (isConnected !== true || isOffline) return;

    const controller = new AbortController();

    async function loadPlaces() {
      try {
        const url = `${API_URL}?name=${encodeURIComponent(searchTerm)}&count=10&language=es&format=json`;
        const response = await fetch(url, { signal: controller.signal });

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
        if (active) {
          console.error("No se pudieron cargar las ciudades.", requestError);
          setStatus("error");
        }
      }
    }

    loadPlaces();

    return () => {
      active = false;
      controller.abort();
    };
  }, [searchTerm, requestId, isConnected, isOffline]);

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

  const connectionLabel = isCheckingConnection
    ? "Comprobando conexión..."
    : isOffline
      ? "Sin conexión a Internet"
      : "Conectado";

  let searchContent = null;

  if (isCheckingConnection) {
    searchContent = (
      <View style={styles.status}>
        <ActivityIndicator color="#AA151B" />
        <Text>Comprobando conexión...</Text>
      </View>
    );
  } else if (isOffline) {
    searchContent = (
      <Text style={styles.statusText}>
        No hay conexión a Internet. La búsqueda se reanudará al recuperar la conexión.
      </Text>
    );
  } else if (status === "loading") {
    searchContent = (
      <View style={styles.status}>
        <ActivityIndicator color="#AA151B" />
        <Text>Cargando...</Text>
      </View>
    );
  } else if (status === "error") {
    searchContent = (
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
    );
  } else if (places.length === 0) {
    searchContent = (
      <Text style={styles.statusText}>No se han encontrado ciudades.</Text>
    );
  } else if (status === "success") {
    searchContent = (
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
    );
  }

  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backText}>← Volver al inicio</Text>
        </Pressable>
      </Link>
      <Text style={styles.title}>Descubre ciudades</Text>
      <View
        accessibilityLiveRegion="polite"
        style={[
          styles.connectionStatus,
          isOffline
            ? styles.connectionOffline
            : isCheckingConnection
              ? styles.connectionUnknown
              : styles.connectionOnline,
        ]}
      >
        <Text style={styles.connectionText}>
          {connectionLabel} · {NETWORK_TYPES[type] || "Tipo desconocido"}
        </Text>
      </View>
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

      {searchContent}
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
  connectionStatus: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  connectionOnline: {
    backgroundColor: "#E6F4EA",
  },
  connectionOffline: {
    backgroundColor: "#FCE8E6",
  },
  connectionUnknown: {
    backgroundColor: "#FFF4CC",
  },
  connectionText: {
    color: "#3D2B24",
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
