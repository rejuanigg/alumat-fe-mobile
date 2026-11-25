import type { Persistence } from '@firebase/auth';

/**
 * Firebase incluye `getReactNativePersistence` solo en su build para React Native
 * (Metro lo resuelve con la condición "react-native"), pero los tipos públicos no lo declaran.
 */
declare module '@firebase/auth' {
  interface ReactNativeAsyncStorage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
