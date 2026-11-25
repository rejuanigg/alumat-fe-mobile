import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Registro: undefined;
  Olvide: undefined;
  Enviado: { email: string };
  Listo: undefined;
};

/** Aviso que el formulario de producto le deja al listado al volver. */
export type ProductNotice = {
  kind: 'created' | 'updated';
  name: string;
  /** Identificador único del aviso: evita mostrar dos veces el mismo mensaje. */
  key: string;
};

export type ProductosStackParamList = {
  Productos: { notice?: ProductNotice } | undefined;
  ProductoForm: { id?: string } | undefined;
};

export type PerfilStackParamList = {
  Perfil: undefined;
  EditarPerfil: undefined;
};

export type AppTabsParamList = {
  Inicio: undefined;
  ProductosTab: NavigatorScreenParams<ProductosStackParamList>;
  PerfilTab: NavigatorScreenParams<PerfilStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList, AppTabsParamList {}
  }
}
