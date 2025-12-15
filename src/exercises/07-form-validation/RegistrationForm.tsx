import { useForm } from './useForm';
import { required, minLength, email, matches, passwordStrength } from './validators';
import './RegistrationForm.css';

interface RegistrationValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: string;
}

export const RegistrationForm = () => {
  // TODO 1: Set up the form using useForm hook
  // Configure validators for each field
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<RegistrationValues>({
    username: {
      initialValue: '',
      validators: [
        // Add required and minLength validators
      ],
    },
    email: {
      initialValue: '',
      validators: [
        // Add required and email validators
      ],
    },
    password: {
      initialValue: '',
      validators: [
        // Add required, minLength, and passwordStrength validators
      ],
    },
    confirmPassword: {
      initialValue: '',
      validators: [
        // Add required and matches('password') validators
      ],
    },
    acceptTerms: {
      initialValue: '',
      validators: [
        // Add required validator
      ],
    },
  });

  // TODO 2: Implement form submission handler
  const onSubmit = async (formValues: RegistrationValues) => {
    // Simulate API call
    console.log('Form submitted:', formValues);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert('Registration successful!');
  };

  // Helper to determine if we should show an error
  const showError = (field: keyof RegistrationValues) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="registration-form-container">
      <h1>Create Account</h1>
      <p className="subtitle">Fill out the form to register</p>

      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        {/* Username Field */}
        <div className={`form-group ${showError('username') ? 'has-error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange('username')}
            onBlur={handleBlur('username')}
            placeholder="Choose a username"
          />
          {showError('username') && (
            <span className="error-message">{errors.username}</span>
          )}
        </div>

        {/* Email Field */}
        <div className={`form-group ${showError('email') ? 'has-error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Enter your email"
          />
          {showError('email') && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* TODO 3: Add Password Field */}
        {/* YOUR CODE HERE */}

        {/* TODO 4: Add Confirm Password Field */}
        {/* YOUR CODE HERE */}

        {/* TODO 5: Add Terms Checkbox */}
        {/* YOUR CODE HERE */}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
