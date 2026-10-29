import { locations } from "@/app/data/id";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddLocationScreen() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const guardarLocalidad = () => {
    const nombreNuevo = nombre.trim();

    if (!nombreNuevo) {
      setError("El nombre del lugar es obligatorio.");
      return;
    }

    const nextId = locations.length + 1;

    locations.push({
      id: String(nextId),
      nombre: nombreNuevo,
      categoria: "Personalizado",
      descripcion: descripcion.trim(),
    });

    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formCard}>
        <Text style={styles.eyebrow}>NUEVO LUGAR</Text>
        <Text style={styles.title}>Añade un sitio para recordar</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          accessibilityLabel="Nombre del lugar"
          value={nombre}
          onChangeText={(text) => {
            setNombre(text);
            if (error) setError("");
          }}
          placeholder="Nombre del lugar"
          placeholderTextColor="#8B8178"
          returnKeyType="next"
          style={styles.input}
        />
        {error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          accessibilityLabel="Descripción del lugar"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="¿Qué te gustaría recordar?"
          placeholderTextColor="#8B8178"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.descriptionInput]}
        />

        <Pressable
          accessibilityRole="button"
          onPress={guardarLocalidad}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>Guardar lugar</Text>
        </Pressable>

        <Link href="/" style={styles.backButton}>
          Volver a la lista
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF9E8",
  },
  formCard: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#5A301C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  eyebrow: {
    color: "#AA151B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    marginTop: 8,
    marginBottom: 22,
    color: "#3D2B24",
    fontSize: 25,
    fontWeight: "700",
  },
  label: {
    marginBottom: 8,
    color: "#3D2B24",
    fontSize: 15,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E4D9C8",
    borderRadius: 12,
    color: "#3D2B24",
    fontSize: 16,
    backgroundColor: "#FFFCF5",
  },
  descriptionInput: {
    minHeight: 120,
  },
  error: {
    marginTop: -10,
    marginBottom: 16,
    color: "#AA151B",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    alignItems: "center",
    marginTop: 4,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#AA151B",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    alignSelf: "center",
    marginTop: 20,
    padding: 8,
    color: "#6F1115",
    fontSize: 15,
    fontWeight: "700",
  },
});
