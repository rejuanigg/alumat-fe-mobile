import { useCallback, useRef, useState } from 'react';
import type { TextInputInstance } from 'react-native';

type Values = Record<string, string | boolean | null>;
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FieldRules<T extends Values> = { [K in keyof T]?: (value: T[K], all: T) => string | undefined };

/**
 * Manejo de formularios:
 * - valida al salir del campo (blur) y al enviar;
 * - después de un error, revalida mientras se escribe;
 * - al enviar con errores muestra todos y lleva el foco al primero.
 *
 * `rules` debe ser estable (constante de módulo o `useMemo`).
 */
export function useForm<T extends Values>(initial: T, rules: FieldRules<T>) {
  const [values, setValuesState] = useState<T>(initial);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const valuesRef = useRef<T>(initial);
  const hadError = useRef(new Set<keyof T>());
  const refs = useRef<Partial<Record<keyof T, TextInputInstance | null>>>({});
  const check = useCallback(<K extends keyof T>(key: K, all: T) => rules[key]?.(all[key], all), [rules]);

  const applyError = useCallback((key: keyof T, msg: string | undefined) => {
    if (msg) hadError.current.add(key);
    setErrors((prev) => (prev[key] === msg ? prev : { ...prev, [key]: msg }));
  }, []);

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const next = { ...valuesRef.current, [key]: value };
      valuesRef.current = next;
      setValuesState(next);
      if (hadError.current.has(key)) applyError(key, check(key, next));
    },
    [applyError, check],
  );

  const validateField = useCallback(
    (key: keyof T) => applyError(key, check(key, valuesRef.current)),
    [applyError, check],
  );

  /** Valida todos los campos; devuelve true si no hay errores. */
  const validateAll = useCallback((): boolean => {
    const all = valuesRef.current;
    const next: FormErrors<T> = {};
    let first: keyof T | undefined; // primer campo con error que puede recibir foco
    let invalid = false;
    for (const key of Object.keys(all) as (keyof T)[]) {
      const msg = check(key, all);
      if (msg) {
        next[key] = msg;
        hadError.current.add(key);
        if (first === undefined && refs.current[key]) first = key;
        invalid = true;
      }
    }
    setErrors(next);
    if (first !== undefined) refs.current[first]?.focus();
    return !invalid;
  }, [check]);

  const register = useCallback(
    (key: keyof T) => (el: TextInputInstance | null) => {
      refs.current[key] = el;
    },
    [],
  );

  const focus = useCallback((key: keyof T) => refs.current[key]?.focus(), []);

  const reset = useCallback((next: T) => {
    valuesRef.current = next;
    hadError.current.clear();
    setValuesState(next);
    setErrors({});
  }, []);

  return { values, errors, setValue, validateField, validateAll, register, focus, reset };
}
