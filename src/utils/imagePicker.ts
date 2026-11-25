import { getInfoAsync } from 'expo-file-system/legacy';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
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

  // Sin edición ni compresión al elegir: así se valida el archivo original; después se comprime.
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
  try {
    const uri = await compressToDataUrl(asset, kind);
    return { status: 'ok', image: { uri, name } };
  } catch {
    return { status: 'error', message: 'No pudimos procesar la imagen. Probá con otra.' };
  }
}

/** Límite del texto base64 que guardamos en Firestore (los documentos admiten hasta 1 MiB). */
const MAX_DATA_URL_CHARS = 700_000;

/**
 * Las imágenes se guardan dentro del documento de Firestore (sin Firebase Storage),
 * así que se reducen y comprimen a JPEG antes de guardarlas.
 */
async function compressToDataUrl(asset: ImagePicker.ImagePickerAsset, kind: 'product' | 'profile'): Promise<string> {
  const attempts =
    kind === 'profile'
      ? [{ maxWidth: 400, compress: 0.7 }, { maxWidth: 300, compress: 0.5 }]
      : [{ maxWidth: 900, compress: 0.6 }, { maxWidth: 700, compress: 0.5 }, { maxWidth: 500, compress: 0.4 }];
  let dataUrl = '';
  for (const { maxWidth, compress } of attempts) {
    const context = ImageManipulator.manipulate(asset.uri);
    if (asset.width > maxWidth) context.resize({ width: maxWidth });
    const image = await context.renderAsync();
    const result = await image.saveAsync({ base64: true, compress, format: SaveFormat.JPEG });
    dataUrl = `data:image/jpeg;base64,${result.base64 ?? ''}`;
    if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl;
  }
  throw new Error('La imagen sigue siendo demasiado grande');
}
