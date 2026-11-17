import { useState } from 'react';

import { colors } from '../theme/tokens';
import { IconButton } from './IconButton';
import { TextField, type TextFieldProps } from './TextField';

type Props = Omit<TextFieldProps, 'secureTextEntry' | 'trailing'>;

export function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!visible}
      trailing={
        <IconButton
          icon={visible ? 'eyeOff' : 'eye'}
          label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onPress={() => setVisible((v) => !v)}
          color={colors.muted}
          style={{ marginRight: 2 }}
        />
      }
    />
  );
}
