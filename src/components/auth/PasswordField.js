import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

import AuthField from './AuthField';
import { TENANT } from '../../config/tenantConfig';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Campo de contraseña: oculta por defecto (secureTextEntry) con botón de ojo
// para mostrar/ocultar. No modifica nunca lo que se escribe y permite
// autocompletado, gestores de contraseñas y pegar desde el portapapeles.
// - showLabel / hideLabel: textos accesibles del botón (desde el catálogo)
// - autoComplete: 'current-password' en login, 'new-password' en registro
// ---------------------------------------------------------------------------
export default function PasswordField({
  showLabel,
  hideLabel,
  Icon = Lock,
  autoComplete = 'current-password',
  ...fieldProps
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      Icon={Icon}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete={autoComplete}
      textContentType={autoComplete === 'new-password' ? 'newPassword' : 'password'}
      importantForAutofill="yes"
      right={
        <Pressable
          style={styles.eyeButton}
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? hideLabel : showLabel}
          // 22 de ícono + 4 de padding + 13 de hitSlop por lado ≈ 56 dp (mín. 48)
          hitSlop={13}
        >
          {visible ? (
            <EyeOff size={22} color={COLORS.text} strokeWidth={1.75} />
          ) : (
            <Eye size={22} color={COLORS.text} strokeWidth={1.75} />
          )}
        </Pressable>
      }
      {...fieldProps}
    />
  );
}

const styles = StyleSheet.create({
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
