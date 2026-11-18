import { getInfoAsync } from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

import { validateImageFormat, validateImageSize } from './validators';

export type PickedImage = { uri: string; name: string };
export type PickResult =
  | { status: 'ok'; image: PickedImage }
  | { status: 'cancel' }
  | { status: 'error'; message: string };

const PERMISSION_MESSAGE =
  'Necesitamos permiso para acceder a tus fotos. Activalo desde la configuración del teléfono.';

async function fileSize(asset: ImagePicker.ImagePickerAsset): Promise<number | undefined> {
  if (typeof asset.fileSize === 'number') return asset.fileSize;
  try {
    const info = await getInfoAsync(asset.uri);
    return info.exists ? info.size : undefined;
  } catch {
    return undefined; // p. ej. en web: no se puede consultar el archivo
  }
}

/** Abre la galería y valida formato (PNG, JPG, WEBP) y tamaño (máx. 2 MB). */
export async function pickImage(kind: 'product' | 'profile'): Promise<PickResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { status: 'error', message: PERMISSION_MESSAGE };

  // Sin edición ni compresión: así se valida el archivo original que eligió el usuario.
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) return { status: 'cancel' };
  const asset = result.assets[0];
  if (!asset) return { status: 'cancel' };

  const formatError = validateImageFormat(asset);
  if (formatError) return { status: 'error', message: formatError };

  const size = await fileSize(asset);
  const sizeError = size === undefined ? undefined : validateImageSize(size, kind);
  if (sizeError) return { status: 'error', message: sizeError };

  const name = asset.fileName ?? asset.uri.split('/').pop()?.split('?')[0] ?? 'imagen';
  return { status: 'ok', image: { uri: asset.uri, name } };
}
