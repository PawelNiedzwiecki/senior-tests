// Validation rule type
export type ValidationRule<T> = (value: T, allValues?: Record<string, unknown>) => string | undefined;

// SOLUTION 1: Implement the required validator
export const required = (message = 'This field is required'): ValidationRule<string> => {
  return (value: string) => {
    if (!value || value.trim() === '') {
      return message;
    }
    return undefined;
  };
};

// SOLUTION 2: Implement the minLength validator
export const minLength = (min: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return undefined;
  };
};

// SOLUTION 3: Implement the maxLength validator
export const maxLength = (max: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return undefined;
  };
};

// SOLUTION 4: Implement the email validator
export const email = (message = 'Invalid email address'): ValidationRule<string> => {
  return (value: string) => {
    if (!value) return undefined;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return undefined;
  };
};

// SOLUTION 5: Implement the pattern validator
export const pattern = (regex: RegExp, message: string): ValidationRule<string> => {
  return (value: string) => {
    if (!value) return undefined;

    if (!regex.test(value)) {
      return message;
    }
    return undefined;
  };
};

// SOLUTION 6: Implement the matches validator
export const matches = (
  fieldName: string,
  message = 'Fields do not match'
): ValidationRule<string> => {
  return (value: string, allValues?: Record<string, unknown>) => {
    if (!allValues) return undefined;

    if (value !== allValues[fieldName]) {
      return message;
    }
    return undefined;
  };
};

// SOLUTION 7: Implement password strength validator
export const passwordStrength = (
  message = 'Password must contain uppercase, lowercase, number, and special character'
): ValidationRule<string> => {
  return (value: string) => {
    if (!value) return undefined;

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return message;
    }
    return undefined;
  };
};

// Bonus: Helper to calculate password strength score
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};
