import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
import type { ScrollViewInstance } from 'react-native';

import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Columns } from '../components/Columns';
import { FormScreen } from '../components/FormScreen';
import { Hero } from '../components/Hero';
import { ImagePickerField } from '../components/ImagePickerField';
import { SelectField } from '../components/SelectField';
import { TextField } from '../components/TextField';
import { useProducts } from '../context/ProductsContext';
import { useForm, type FieldRules } from '../hooks/useForm';
import type { ProductosStackParamList } from '../navigation/types';
import { CATEGORIES, ServiceError, type Category, type Product } from '../services/types';
import { priceToInput } from '../utils/format';
import {
  parsePrice,
  validateCategory,
  validateDescription,
  validatePrice,
  validateProductImage,
  validateProductName,
  validateStock,
} from '../utils/validators';

type Props = NativeStackScreenProps<ProductosStackParamList, 'ProductoForm'>;

type Values = {
  image: string | null;
  imageName: string | null;
  name: string;
  category: Category | '';
  price: string;
  stock: string;
  description: string;
};

const toValues = (p?: Product): Values => ({
  image: p?.imageUri ?? null,
  imageName: p?.imageName ?? null,
  name: p?.name ?? '',
  category: p?.category ?? '',
  price: p ? priceToInput(p.price) : '',
  stock: p ? String(p.stock) : '',
  description: p?.description ?? '',
});

const BASE_RULES: FieldRules<Values> = {
  name: validateProductName,
  category: validateCategory,
  price: validatePrice,
  stock: validateStock,
  description: validateDescription,
};
const CREATE_RULES: FieldRules<Values> = { image: validateProductImage, ...BASE_RULES };

export function ProductoForm({ navigation, route }: Props) {
  const { products, create, update } = useProducts();
  const id = route.params?.id;
  const editing = id !== undefined;
  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const form = useForm<Values>(toValues(product), editing ? BASE_RULES : CREATE_RULES);
  const { values: v, errors, setValue, validateField, register, focus } = form;
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const submit = async () => {
    setBanner(null);
    if (!form.validateAll()) {
      // La imagen y la categoría no reciben foco de teclado: subimos para que se vea el error.
      if ((!editing && !v.image) || !v.category) scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setSaving(true);
    try {
      const input = {
        name: v.name.trim(),
        category: v.category as Category,
        price: parsePrice(v.price),
        stock: Number(v.stock.trim()),
        description: v.description.trim(),
        imageUri: v.image,
        imageName: v.imageName,
      };
      if (editing) {
        await update(id, input);
      } else {
        const created = await create(input);
        // A partir de acá el formulario edita el producto recién creado.
        navigation.setParams({ id: created.id });
      }
      setBanner({ kind: 'success', message: 'Producto guardado correctamente.' });
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (e) {
      setBanner({
        kind: 'error',
        message: e instanceof ServiceError ? e.message : 'No pudimos guardar el producto. Probá de nuevo.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen
      scrollRef={scrollRef}
      bottomInset={false}
      header={
        <Hero height={200} title={editing ? 'Editar\nproducto' : 'Nuevo\nproducto'} onBack={navigation.goBack} />
      }
    >
      {banner ? <Banner kind={banner.kind} message={banner.message} /> : null}
      <ImagePickerField
        label="Imagen"
        value={v.image ? { uri: v.image, name: v.imageName ?? 'imagen' } : null}
        onChange={(img) => {
          setValue('imageName', img?.name ?? null);
          setValue('image', img?.uri ?? null);
          if (!img && !editing) validateField('image');
        }}
        error={errors.image}
      />
      <TextField
        ref={register('name')}
        label="Nombre"
        placeholder="Ej: Ventana corrediza 120 × 100"
        value={v.name}
        onChangeText={(t) => setValue('name', t)}
        onBlur={() => validateField('name')}
        error={errors.name}
        autoCapitalize="sentences"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('price')}
      />
      <SelectField
        label="Categoría"
        value={v.category}
        options={CATEGORIES}
        placeholder="Elegí una categoría"
        onChange={(c) => setValue('category', c)}
        onClose={() => validateField('category')}
        error={errors.category}
      />
      <Columns>
        <TextField
          ref={register('price')}
          label="Precio ($)"
          placeholder="125000"
          value={v.price}
          onChangeText={(t) => setValue('price', t)}
          onBlur={() => validateField('price')}
          error={errors.price}
          keyboardType="decimal-pad"
          inputMode="decimal"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focus('stock')}
        />
        <TextField
          ref={register('stock')}
          label="Stock"
          placeholder="0"
          value={v.stock}
          onChangeText={(t) => setValue('stock', t)}
          onBlur={() => validateField('stock')}
          error={errors.stock}
          keyboardType="number-pad"
          inputMode="numeric"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focus('description')}
        />
      </Columns>
      <TextField
        ref={register('description')}
        label="Descripción (opcional)"
        placeholder="Medidas, color, línea…"
        value={v.description}
        onChangeText={(t) => setValue('description', t)}
        onBlur={() => validateField('description')}
        error={errors.description}
        hint={`${v.description.length}/200`}
        multiline
        numberOfLines={4}
      />
      <Button title="Guardar producto" large onPress={() => void submit()} loading={saving} />
      <Button title="Cancelar" variant="secondary" onPress={navigation.goBack} disabled={saving} />
    </FormScreen>
  );
}

