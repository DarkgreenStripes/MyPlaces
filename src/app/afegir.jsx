import { addLocation } from "@/components/location-storage";
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
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveLocation() {
    const trimmedName = locationName.trim();

    if (!trimmedName) {
      setErrorMessage("El nombre del lugar es obligatorio.");
      return;
    }

    setIsSaving(true);
    try {
      await addLocation({
        nombre: trimmedName,
        categoria: "Personalizado",
        descripcion: locationDescription.trim(),
      });
      router.replace("/");
    } catch (saveError) {
      console.error("No se pudo guardar el lugar.", saveError);
      setErrorMessage("No se pudo guardar el lugar. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

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
          value={locationName}
          onChangeText={(text) => {
            setLocationName(text);
            if (errorMessage) {
              setErrorMessage("");
            }
          }}
          placeholder="Nombre del lugar"
          placeholderTextColor="#8B8178"
          returnKeyType="next"
          style={styles.input}
        />
        {errorMessage ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {errorMessage}
          </Text>
        ) : null}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          accessibilityLabel="Descripción del lugar"
          value={locationDescription}
          onChangeText={setLocationDescription}
          placeholder="¿Qué te gustaría recordar?"
          placeholderTextColor="#8B8178"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.descriptionInput]}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleSaveLocation}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            (pressed || isSaving) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Guardando..." : "Guardar lugar"}
          </Text>
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
