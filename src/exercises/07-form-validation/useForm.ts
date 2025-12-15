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

// Form state for a single field
interface FieldState<T> {
  value: T;
  error: string | undefined;
  touched: boolean;
}

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

// TODO 1: Implement the useForm hook
export function useForm<T extends Record<string, unknown>>(
  config: FormConfig<T>
): UseFormReturn<T> {
  // TODO 2: Initialize state for field values
  // Extract initial values from config
  const getInitialValues = (): T => {
    const values = {} as T;
    // YOUR CODE HERE - Loop through config and extract initialValue
    return values;
  };

  const [values, setValues] = useState<T>(getInitialValues);

  // TODO 3: Initialize state for errors
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});

  // TODO 4: Initialize state for touched fields
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  // TODO 5: Initialize submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO 6: Implement validateField function
  // Should run all validators for a field and return the first error
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      // YOUR CODE HERE
      // Get validators from config[name]
      // Run each validator and return first error
      return undefined;
    },
    [config]
  );

  // TODO 7: Implement validateAllFields function
  // Returns true if all fields are valid
  const validateAllFields = useCallback((): boolean => {
    // YOUR CODE HERE
    // Validate all fields and update errors state
    // Return true if no errors
    return true;
  }, [config, values, validateField]);

  // TODO 8: Implement handleChange
  // Should update value and optionally validate
  const handleChange = useCallback(
    (name: keyof T) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // YOUR CODE HERE
      },
    []
  );

  // TODO 9: Implement handleBlur
  // Should mark field as touched and validate
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      // YOUR CODE HERE
    },
    [validateField, values]
  );

  // TODO 10: Implement handleSubmit
  // Should validate all fields before calling onSubmit
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e: FormEvent) => {
        e.preventDefault();
        // YOUR CODE HERE
        // - Mark all fields as touched
        // - Validate all fields
        // - If valid, call onSubmit
        // - Handle loading state
      },
    [validateAllFields, values]
  );

  // TODO 11: Implement setFieldValue (programmatic value setting)
  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    // YOUR CODE HERE
  }, []);

  // TODO 12: Implement setFieldError (programmatic error setting)
  const setFieldError = useCallback((name: keyof T, error: string) => {
    // YOUR CODE HERE
  }, []);

  // TODO 13: Implement resetForm
  const resetForm = useCallback(() => {
    // YOUR CODE HERE
  }, []);

  // TODO 14: Calculate isValid
  const isValid = Object.keys(errors).length === 0;

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
