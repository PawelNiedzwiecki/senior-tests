// Validation rule type
export type ValidationRule<T> = (value: T, allValues?: Record<string, unknown>) => string | undefined;

// TODO 1: Implement the required validator
// Returns an error message if the value is empty
export const required = (message = 'This field is required'): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE
    return undefined;
  };
};

// TODO 2: Implement the minLength validator
export const minLength = (min: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE
    return undefined;
  };
};

// TODO 3: Implement the maxLength validator
export const maxLength = (max: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE
    return undefined;
  };
};

// TODO 4: Implement the email validator
export const email = (message = 'Invalid email address'): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE - Use regex to validate email format
    return undefined;
  };
};

// TODO 5: Implement the pattern validator (regex)
export const pattern = (regex: RegExp, message: string): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE
    return undefined;
  };
};

// TODO 6: Implement the matches validator (compare with another field)
export const matches = (
  fieldName: string,
  message = 'Fields do not match'
): ValidationRule<string> => {
  return (value: string, allValues?: Record<string, unknown>) => {
    // YOUR CODE HERE - Compare value with allValues[fieldName]
    return undefined;
  };
};

// TODO 7: Implement a custom validator for password strength
export const passwordStrength = (
  message = 'Password must contain uppercase, lowercase, number, and special character'
): ValidationRule<string> => {
  return (value: string) => {
    // YOUR CODE HERE
    // Check for: uppercase, lowercase, number, special character
    return undefined;
  };
};
