import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// "Recordar": guarda SOLO el correo para completar el campo la próxima vez.
// No mantiene la sesión ni guarda la contraseña (eso requeriría tokens en
// almacenamiento cifrado, p. ej. expo-secure-store).
// Si falla el almacenamiento, el login sigue funcionando igual.
// ---------------------------------------------------------------------------
const KEY = '@login/rememberedEmail';

export async function getRememberedEmail() {
  try {
    return (await AsyncStorage.getItem(KEY)) || '';
  } catch (e) {
    return '';
  }
}

export async function saveRememberedEmail(email) {
  try {
    await AsyncStorage.setItem(KEY, email);
  } catch (e) {
    // Sin efecto: recordar el correo es solo una comodidad
  }
}

export async function clearRememberedEmail() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    // Sin efecto
  }
}
