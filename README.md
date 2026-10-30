# MyPlaces

Aplicación móvil hecha con React Native, Expo y JavaScript para guardar y
consultar lugares de interés.

## Apartado A: navegación y componentes

El apartado A pide una pantalla principal con una lista de lugares, una pantalla
de detalle, navegación entre ambas, un identificador para cada lugar y al menos
un componente reutilizable. MyPlaces lo resuelve así:

- **Lista principal:** `src/app/index.jsx` carga los lugares guardados con
  `getLocationList()` y los muestra con `FlatList`. Cada elemento usa su `id`
  como clave.
- **Identificador:** cada lugar guardado tiene un `id` único. Ese mismo
  identificador se envía al abrir el detalle.
- **Componente reutilizable:** `src/components/location-cards.jsx` recibe un
  lugar y dibuja su tarjeta. La pantalla principal reutiliza el componente para
  cada elemento de la lista.
- **Navegación:** al pulsar una tarjeta, Expo Router abre
  `/detall/location?id=<id>`. La configuración de pantallas está en
  `src/app/_layout.jsx`.
- **Detalle:** `src/app/detall/location-detail.jsx` lee el parámetro `id`,
  busca el lugar en la lista guardada y muestra su nombre, categoría y
  descripción. Si el identificador no existe, informa del problema y permite
  volver a la lista.

### Recorrido de los datos

almacenamiento local → `index.jsx` → tarjeta reutilizable → ruta de detalle con
el `id` → consulta del lugar guardado → pantalla de detalle.

## Apartado B: formulario y validación

El apartado B pide una pantalla para añadir un lugar con nombre y descripción,
impedir que se guarde con el nombre vacío, informar del error y permitir volver
a la lista. MyPlaces lo resuelve así:

- **Acceso al formulario:** el botón «Añadir un lugar» de
  `src/app/index.jsx` abre la ruta `/afegir`.
- **Campos del formulario:** `src/app/afegir.jsx` tiene un `TextInput` para el
  nombre y otro para la descripción. Sus valores se controlan con estado de
  React y `onChangeText`.
- **Validación:** antes de guardar se aplica `trim()` al nombre. Si queda
  vacío, se muestra un mensaje de error. Al escribir de nuevo, el mensaje
  desaparece.
- **Visualización del error:** en `afegir.jsx`, la expresión condicional
  `{error ? (...) : null}` muestra el componente de texto solo cuando `error`
  contiene un mensaje; si está vacío, no se renderiza nada. El atributo
  `accessibilityLiveRegion="polite"` hace que los lectores de pantalla anuncien
  el mensaje cuando aparece, sin interrumpir lo que estaban leyendo.
- **Guardar:** si el nombre es válido, se guardan el nombre y la descripción
  recortados mediante `addLocation()` en `src/components/location-storage.jsx`.
  La categoría de los lugares añadidos es «Personalizado». Una vez guardado,
  se vuelve a la lista.
- **Volver a la lista:** el enlace «Volver a la lista» permite salir del
  formulario sin guardar.

### Recorrido de los datos

`index.jsx` → formulario `/afegir` → validación del nombre con `trim()` →
`addLocation()` → almacenamiento local → lista y detalle actualizados.

## Apartado C: persistencia local

El apartado C pide guardar los lugares en el dispositivo, recuperarlos al
reiniciar la aplicación, permitir eliminarlos y contemplar que la lista
inicialmente esté vacía. MyPlaces lo resuelve con AsyncStorage:

- **Almacenamiento:** `src/components/location-storage.jsx` centraliza las
  operaciones de lectura, alta y eliminación. La lista se guarda como JSON en
  AsyncStorage con la clave `location_list`.
- **Lista inicialmente vacía:** `getLocationList()` devuelve una lista vacía
  (`[]`) cuando todavía no existe ningún dato guardado. No se cargan lugares
  de ejemplo desde `src/app/data/id.js`.
- **Recuperación:** al abrir la pantalla principal,
  `src/app/index.jsx` llama a `getLocationList()` y muestra el resultado. La
  pantalla de detalle también lee la lista persistida para encontrar el lugar
  seleccionado. Así, los lugares siguen disponibles tras cerrar y volver a
  abrir la aplicación.
- **Alta persistente:** `addLocation()` agrega el lugar a la lista y guarda de
  nuevo la lista completa en AsyncStorage. Asigna un identificador que no esté
  ya en uso.
- **Eliminación:** cada tarjeta de `src/components/location-cards.jsx` tiene
  un botón «Eliminar». La pantalla principal llama a `removeLocation()` para
  quitar el lugar y guardar la lista actualizada. Si no quedan lugares, se
  muestra un mensaje indicando que la lista está vacía.
- **Errores:** si no se puede cargar, guardar o eliminar un lugar, se informa
  del error en la interfaz y no se presenta la operación como completada.

### Recorrido de la persistencia

`afegir.jsx` → `addLocation()` → AsyncStorage (`location_list`) →
`getLocationList()` → `index.jsx` y detalle.

Para eliminar: botón de la tarjeta → `removeLocation()` → AsyncStorage →
lista actualizada.

## Ejecutar la aplicación

Instala las dependencias con `npm install` y luego inicia Expo:

```bash
npx expo start
```
