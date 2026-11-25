import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';

import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Columns } from '../components/Columns';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { FormScreen } from '../components/FormScreen';
import { Hero } from '../components/Hero';
import { ImagePickerField } from '../components/ImagePickerField';
import { SelectField } from '../components/SelectField';
import { TextField } from '../components/TextField';
import { useProducts } from '../context/ProductsContext';
import { useForm, type FieldRules } from '../hooks/useForm';
import type { ProductNotice, ProductosStackParamList } from '../navigation/types';
import { CATEGORIES, ServiceError, type Category, type Product } from '../services/types';
import { colors, spacing, type } from '../theme/tokens';
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

/** Compara valores del formulario para saber si hay cambios sin guardar. */
const sameValues = (a: Values, b: Values) => (Object.keys(a) as (keyof Values)[]).every((k) => a[k] === b[k]);

export function ProductoForm({ navigation, route }: Props) {
  const { products, loading } = useProducts();
  const id = route.params?.id;
  const live = id === undefined ? undefined : products.find((p) => p.id === id);

  // Guardamos la primera versión que encontramos del producto: si otra persona lo elimina mientras
  // se edita, el formulario no se desarma (se pierden los cambios) sino que avisa y bloquea el guardado.
  const [snapshot, setSnapshot] = useState<Product | undefined>(live);
  useEffect(() => {
    if (!snapshot && live) setSnapshot(live);
  }, [snapshot, live]);

  if (id === undefined) return <ProductoFormBody key="new" navigation={navigation} available />;

  const product = snapshot ?? live;
  if (!product) {
    return (
      <FormScreen bottomInset={false} header={<Hero height={200} title={'Editar\nproducto'} onBack={navigation.goBack} />}>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loading} />
        ) : (
          <View style={styles.missing}>
            <Text style={[type.heading, styles.ink]}>No encontramos este producto</Text>
            <Text style={[type.body, styles.muted]}>
              Puede que se haya eliminado. Si fue así, lo podés recuperar desde la pestaña Eliminados del listado.
            </Text>
            <Button title="Volver a productos" onPress={() => navigation.popTo('Productos')} />
          </View>
        )}
      </FormScreen>
    );
  }
  return <ProductoFormBody key={id} navigation={navigation} product={product} available={live !== undefined} />;
}

type BodyProps = {
  navigation: Props['navigation'];
  /** Producto a editar; si no viene, el formulario crea uno nuevo. */
  product?: Product;
  /** false si el producto se eliminó mientras estaba abierto el formulario. */
  available: boolean;
};

function ProductoFormBody({ navigation, product, available }: BodyProps) {
  const { create, update } = useProducts();
  const editing = product !== undefined;
  const [initial] = useState(() => toValues(product));

  const form = useForm<Values>(initial, editing ? BASE_RULES : CREATE_RULES);
  const { values: v, errors, setValue, validateField, register, focus } = form;
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  // Refs (y no estado) porque se leen en el mismo tick: evitan doble envío y salir a mitad de un guardado.
  const savingRef = useRef(false);
  const leavingRef = useRef(false);

  const dirty = !sameValues(v, initial);

  // Cubre todas las formas de salir: flecha del encabezado, "Cancelar", botón atrás de Android y gesto de iOS.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (leavingRef.current) return;
        if (savingRef.current) {
          e.preventDefault(); // no se sale mientras se guarda: el resultado quedaría sin informar
          return;
        }
        if (!dirty) return;
        e.preventDefault();
        setPendingLeave(() => () => {
          leavingRef.current = true;
          navigation.dispatch(e.data.action);
        });
      }),
    [navigation, dirty],
  );

  const scrollTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const submit = async () => {
    if (savingRef.current) return;
    setBanner(null);
    if (editing && !available) {
      setBanner({
        kind: 'error',
        message: 'Este producto se eliminó mientras lo editabas. Recuperalo desde Eliminados para volver a modificarlo.',
      });
      scrollTop();
      return;
    }
    if (!form.validateAll()) {
      // La imagen y la categoría no reciben foco de teclado: subimos para que se vea el error.
      if ((!editing && !v.image) || !v.category) scrollTop();
      return;
    }
    savingRef.current = true;
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
        await update(product.id, input);
      } else {
        await create(input);
      }
      const notice: ProductNotice = {
        kind: editing ? 'updated' : 'created',
        name: input.name,
        key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      savingRef.current = false;
      leavingRef.current = true;
      navigation.popTo('Productos', { notice });
    } catch (e) {
      savingRef.current = false;
      setSaving(false);
      setBanner({
        kind: 'error',
        message: e instanceof ServiceError ? e.message : 'No pudimos guardar el producto. Probá de nuevo.',
      });
      scrollTop();
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
      {editing && !available ? (
        <Banner
          kind="error"
          message="Este producto se eliminó mientras lo editabas. Los cambios no se pueden guardar hasta que lo recuperes."
        />
      ) : null}
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
      <Button
        title={editing ? 'Guardar cambios' : 'Crear producto'}
        large
        onPress={() => void submit()}
        loading={saving}
        disabled={editing && !available}
      />
      <Button title="Cancelar" variant="secondary" onPress={navigation.goBack} disabled={saving} />
      <ConfirmSheet
        visible={pendingLeave !== null}
        title="¿Descartar los cambios?"
        description="Si salís ahora, se pierde lo que cargaste en el formulario."
        confirmLabel="Sí, descartar"
        cancelLabel="Seguir editando"
        onConfirm={() => {
          const leave = pendingLeave;
          setPendingLeave(null);
          leave?.();
        }}
        onCancel={() => setPendingLeave(null)}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: spacing.xl },
  missing: { gap: spacing.sm },
  ink: { color: colors.ink },
  muted: { color: colors.muted },
});

