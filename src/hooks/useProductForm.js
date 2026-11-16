import { useCallback, useRef, useState } from 'react';

import { MESSAGES } from '../constants/messages';
import {
  PRODUCT_VALIDATION_ERROR,
  PRODUCT_FIELD_VALIDATORS,
  validateProductForm,
} from '../validation/productValidation';
import {
  PRODUCT_ERROR,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

// ---------------------------------------------------------------------------
// Estado y comportamiento del formulario de productos (alta y edición).
// Mismo criterio que el login: mientras escribe solo se limpian errores ya
// corregidos; después del primer intento de guardar, se actualizan en vivo.
// ---------------------------------------------------------------------------

const V = MESSAGES.productValidation;

const FIELD_ERROR_MESSAGES = {
  name: { [PRODUCT_VALIDATION_ERROR.REQUIRED]: V.nameRequired },
  category: { [PRODUCT_VALIDATION_ERROR.REQUIRED]: V.categoryRequired },
  description: {},
  price: {
    [PRODUCT_VALIDATION_ERROR.REQUIRED]: V.priceRequired,
    [PRODUCT_VALIDATION_ERROR.INVALID_NUMBER]: V.priceInvalid,
  },
  stock: {
    [PRODUCT_VALIDATION_ERROR.REQUIRED]: V.stockRequired,
    [PRODUCT_VALIDATION_ERROR.INVALID_NUMBER]: V.stockInvalid,
  },
};

const fieldMessage = (field, code) =>
  code
    ? FIELD_ERROR_MESSAGES[field][code] ||
      (code === PRODUCT_VALIDATION_ERROR.TOO_LONG ? V.tooLong : null)
    : null;

const E = MESSAGES.productErrors;

// También lo usa la lista de productos
export const PRODUCT_ERROR_MESSAGES = {
  [PRODUCT_ERROR.PERMISSION_DENIED]: E.permissionDenied,
  [PRODUCT_ERROR.NETWORK]: E.network,
  [PRODUCT_ERROR.NOT_FOUND]: E.notFound,
  [PRODUCT_ERROR.NOT_CONFIGURED]: E.serviceUnavailable,
  [PRODUCT_ERROR.UNKNOWN]: E.serviceUnavailable,
};

// Precio en formato local para el campo de texto (90000.5 → "90000,50")
const priceToInput = (price) =>
  typeof price === 'number' ? price.toFixed(2).replace('.', ',').replace(/,00$/, '') : '';

const toFormValues = (product) => ({
  name: product?.name ?? '',
  category: product?.category ?? '',
  description: product?.description ?? '',
  price: product ? priceToInput(product.price) : '',
  stock: product ? String(product.stock ?? 0) : '',
});

const EMPTY_ERRORS = { name: null, category: null, description: null, price: null, stock: null };

// `product`: el producto a editar, o undefined para crear uno nuevo.
// `onDone`: se llama después de guardar o eliminar correctamente.
export default function useProductForm(product, onDone) {
  const isEditing = !!product?.id;

  const [values, setValues] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Evita envíos duplicados aunque se toque dos veces antes del re-render
  const busyRef = useRef(false);

  const onChange = useCallback(
    (field) => (text) => {
      setValues((prev) => ({ ...prev, [field]: text }));
      setRequestError(null);
      setErrors((prev) => {
        const next = PRODUCT_FIELD_VALIDATORS[field](text);
        if (submitAttempted) return { ...prev, [field]: next };
        return prev[field] && !next ? { ...prev, [field]: null } : prev;
      });
    },
    [submitAttempted]
  );

  const run = async (setBusy, action) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setRequestError(null);

    const result = await action();

    busyRef.current = false;
    setBusy(false);

    if (result.ok) {
      onDone?.();
    } else {
      setRequestError(PRODUCT_ERROR_MESSAGES[result.category] || E.serviceUnavailable);
    }
  };

  const onSubmit = () => {
    setSubmitAttempted(true);
    const { errors: nextErrors, isValid, values: clean } = validateProductForm(values);
    setErrors(nextErrors);
    if (!isValid) return;

    run(setSaving, () => (isEditing ? updateProduct(product.id, clean) : createProduct(clean)));
  };

  const onDelete = () => {
    if (!isEditing) return;
    run(setDeleting, () => deleteProduct(product.id));
  };

  const fieldErrors = Object.fromEntries(
    Object.entries(errors).map(([field, code]) => [field, fieldMessage(field, code)])
  );

  return {
    isEditing,
    values,
    errors: fieldErrors,
    requestError,
    saving,
    deleting,
    onChange,
    onSubmit,
    onDelete,
  };
}
