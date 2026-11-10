import { Accelerometer } from "expo-sensors";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function AccelerometerScreen() {
  const [reading, setReading] = useState({ x: 0, y: 0, z: 0 });
  const [shouldListen, setShouldListen] = useState(Platform.OS !== "web");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shouldListen) return;

    let active = true;
    let subscription;

    async function listenToAccelerometer() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (!active) return;

        if (!available) {
          setError(
            Platform.OS === "web"
              ? "Este navegador no ofrece un acelerómetro. Prueba desde un móvil físico; en web móvil se necesita HTTPS."
              : "El acelerómetro no está disponible en este dispositivo. Prueba en un móvil físico, no en un emulador.",
          );
          return;
        }

        Accelerometer.setUpdateInterval(250);
        subscription = Accelerometer.addListener(setReading);
      } catch (sensorError) {
        console.error("No se pudo iniciar el acelerómetro.", sensorError);
        if (active) {
          setError("No se pudieron obtener lecturas del acelerómetro.");
        }
      }
    }

    listenToAccelerometer();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [shouldListen]);

  async function requestWebPermission() {
    try {
      const permission = await Accelerometer.requestPermissionsAsync();
      if (!permission.granted) {
        setError(
          "El navegador no concedió permiso de movimiento. Usa un móvil compatible y permite el acceso cuando el navegador lo solicite.",
        );
        return;
      }

      setError("");
      setShouldListen(true);
    } catch (permissionError) {
      console.error("No se pudo solicitar permiso de movimiento.", permissionError);
      setError("No se pudo solicitar permiso de movimiento en este navegador.");
    }
  }

  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backText}>← Volver al inicio</Text>
        </Pressable>
      </Link>

      <Text style={styles.title}>Acelerómetro</Text>
      <Text style={styles.description}>
        Mueve el dispositivo para observar la aceleración en los ejes X, Y y Z.
        Los valores se expresan en g.
      </Text>

      <View accessibilityLiveRegion="polite" style={styles.readingCard}>
        {["x", "y", "z"].map((axis) => (
          <Text key={axis} style={styles.reading}>
            {axis.toUpperCase()}: {reading[axis].toFixed(2)} g
          </Text>
        ))}
      </View>

      {Platform.OS === "web" && !shouldListen ? (
        <Pressable
          accessibilityRole="button"
          onPress={requestWebPermission}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.actionText}>Permitir movimiento e iniciar</Text>
        </Pressable>
      ) : null}

      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
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
    marginBottom: 10,
    color: "#3D2B24",
    fontSize: 24,
    fontWeight: "700",
  },
  description: {
    marginBottom: 20,
    color: "#6F5C4E",
    fontSize: 15,
    lineHeight: 22,
  },
  readingCard: {
    marginBottom: 16,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  reading: {
    color: "#3D2B24",
    fontSize: 18,
    lineHeight: 32,
    fontWeight: "600",
  },
  actionButton: {
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#AA151B",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  error: {
    marginTop: 16,
    color: "#AA151B",
    fontWeight: "600",
  },
});
