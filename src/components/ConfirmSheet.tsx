import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmSheet({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onCancel} title={title} description={description}>
      <Button title={confirmLabel} variant="destructive" onPress={onConfirm} loading={loading} />
      <Button title={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} />
    </BottomSheet>
  );
}
