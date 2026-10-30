import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_LIST_KEY = "location_list";

export async function getLocationList() {
  const storedLocations = await AsyncStorage.getItem(LOCATION_LIST_KEY);

  if (storedLocations === null) {
    return [];
  }

  const locationList = JSON.parse(storedLocations);

  if (!Array.isArray(locationList)) {
    throw new Error("La lista guardada de lugares no es válida.");
  }

  return locationList;
}

export async function addLocation(location) {
  const locationList = await getLocationList();
  let nextId = locationList.length + 1;

  while (locationList.some((savedLocation) => savedLocation.id === String(nextId))) {
    nextId += 1;
  }

  const newLocation = {
    id: String(nextId),
    nombre: location.nombre,
    categoria: location.categoria,
    descripcion: location.descripcion,
  };
  locationList.push(newLocation);

  await AsyncStorage.setItem(
    LOCATION_LIST_KEY,
    JSON.stringify(locationList),
  );

  return locationList;
}

export async function removeLocation(id) {
  const locationList = await getLocationList();
  const updatedLocationList = locationList.filter(
    (location) => location.id !== id,
  );

  await AsyncStorage.setItem(
    LOCATION_LIST_KEY,
    JSON.stringify(updatedLocationList),
  );

  return updatedLocationList;
}
