import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Registro: undefined;
  Olvide: undefined;
  Enviado: { email: string };
  Listo: undefined;
};

export type ProductosStackParamList = {
  Productos: undefined;
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
