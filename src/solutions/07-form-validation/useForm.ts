import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { ValidationRule } from './validators';

// Form field configuration
interface FieldConfig<T> {
  initialValue: T;
  validators?: ValidationRule<T>[];
}

// Form configuration type
type FormConfig<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

// Return type of useForm hook
interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (name: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: FormEvent) => void;
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  setFieldError: (name: keyof T, error: string) => void;
  resetForm: () => void;
}

// SOLUTION: Implement the useForm hook
export function useForm<T extends Record<string, unknown>>(
  config: FormConfig<T>
): UseFormReturn<T> {
  // SOLUTION 2: Initialize state for field values
  const getInitialValues = (): T => {
    const values = {} as T;
    for (const key in config) {
      values[key] = config[key].initialValue as T[typeof key];
    }
    return values;
  };

  const [values, setValues] = useState<T>(getInitialValues);

  // SOLUTION 3: Initialize state for errors
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});

  // SOLUTION 4: Initialize state for touched fields
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  // SOLUTION 5: Initialize submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SOLUTION 6: Implement validateField function
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const fieldConfig = config[name];
      const validators = fieldConfig.validators || [];

      for (const validator of validators) {
        const error = validator(value as never, values as Record<string, unknown>);
        if (error) {
          return error;
        }
      }

      return undefined;
    },
    [config, values]
  );

  // SOLUTION 7: Implement validateAllFields function
  const validateAllFields = useCallback((): boolean => {
    const newErrors: { [K in keyof T]?: string } = {};
    let isValid = true;

    for (const key in config) {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [config, values, validateField]);

  // SOLUTION 8: Implement handleChange
  const handleChange = useCallback(
    (name: keyof T) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked.toString()
          : e.target.value;

        setValues((prev) => ({
          ...prev,
          [name]: value,
        }));

        // Validate on change if field has been touched
        if (touched[name]) {
          const error = validateField(name, value as T[keyof T]);
          setErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
      },
    [touched, validateField]
  );

  // SOLUTION 9: Implement handleBlur
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField, values]
  );

  // SOLUTION 10: Implement handleSubmit
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e: FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched: { [K in keyof T]?: boolean } = {};
        for (const key in config) {
          allTouched[key] = true;
        }
        setTouched(allTouched);

        // Validate all fields
        const isValid = validateAllFields();

        if (isValid) {
          setIsSubmitting(true);
          try {
            await onSubmit(values);
          } catch (error) {
            console.error('Form submission error:', error);
          } finally {
            setIsSubmitting(false);
          }
        }
      },
    [config, validateAllFields, values]
  );

  // SOLUTION 11: Implement setFieldValue
  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // SOLUTION 12: Implement setFieldError
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // SOLUTION 13: Implement resetForm
  const resetForm = useCallback(() => {
    setValues(getInitialValues());
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  // SOLUTION 14: Calculate isValid
  const isValid = Object.values(errors).every((error) => !error) &&
    Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
}

export default useForm;
