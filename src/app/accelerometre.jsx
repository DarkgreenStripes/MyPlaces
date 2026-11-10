import { Accelerometer } from "expo-sensors";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function AccelerometerScreen() {
  const [reading, setReading] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const subscription = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      subscription.current?.remove();
    };
  }, []);

  async function startReading() {
    setIsStarting(true);
    setError("");

    try {
      const permission = await Accelerometer.requestPermissionsAsync();
      if (!permission.granted) {
        setError(
          Platform.OS === "web"
            ? "El navegador ha bloqueado el acceso al movimiento. Permítelo en los ajustes del sitio y recarga la página. En iPhone, usa Safari y activa «Movimiento y orientación»."
            : Platform.OS === "ios"
              ? "Permiso de movimiento denegado. Actívalo en Ajustes > Privacidad y seguridad > Movimiento y forma física."
              : "No se pudo acceder al sensor de movimiento. Comprueba los permisos y ajustes del dispositivo.",
        );
        return;
      }

      const available = await Accelerometer.isAvailableAsync();
      if (!available) {
        setError(
          Platform.OS === "web"
            ? "Este navegador no ofrece un acelerómetro. En un ordenador no suele haber nada que habilitar; prueba desde un móvil físico. En iPhone, usa Safari con una conexión segura (HTTPS)."
            : "El acelerómetro no está disponible en este dispositivo. Prueba en un móvil físico, no en un emulador.",
        );
        return;
      }

      if (!isMounted.current) return;

      Accelerometer.setUpdateInterval(250);
      subscription.current = Accelerometer.addListener(setReading);
      setIsReading(true);
    } catch (requestError) {
      console.error("No se pudo iniciar el acelerómetro.", requestError);
      if (isMounted.current) {
        setError("No se pudieron obtener lecturas del acelerómetro.");
      }
    } finally {
      if (isMounted.current) setIsStarting(false);
    }
  }

  function stopReading() {
    subscription.current?.remove();
    subscription.current = null;
    setIsReading(false);
    setReading(null);
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
        Inicia las lecturas y mueve el dispositivo para observar la aceleración
        en los ejes X, Y y Z. Los valores se expresan en g.
      </Text>

      <View accessibilityLiveRegion="polite" style={styles.readingCard}>
        {["x", "y", "z"].map((axis) => (
          <Text key={axis} style={styles.reading}>
            {axis.toUpperCase()}: {reading ? reading[axis].toFixed(3) : "—"} g
          </Text>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isStarting}
        onPress={isReading ? stopReading : startReading}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.buttonPressed,
          isStarting && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.actionText}>
          {isStarting
            ? "Iniciando..."
            : isReading
              ? "Detener lecturas"
              : "Iniciar lecturas"}
        </Text>
      </Pressable>

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
  buttonDisabled: {
    opacity: 0.6,
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
