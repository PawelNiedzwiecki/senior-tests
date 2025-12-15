import { useState } from 'react';
import { useForm } from './useForm';
import { required, minLength, email, matches, passwordStrength, getPasswordStrength } from './validators';
import './RegistrationForm.css';

interface RegistrationValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: string;
}

export const RegistrationForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  // SOLUTION 1: Set up the form using useForm hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<RegistrationValues>({
    username: {
      initialValue: '',
      validators: [
        required('Username is required'),
        minLength(3, 'Username must be at least 3 characters'),
      ],
    },
    email: {
      initialValue: '',
      validators: [
        required('Email is required'),
        email('Please enter a valid email address'),
      ],
    },
    password: {
      initialValue: '',
      validators: [
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters'),
        passwordStrength('Password must contain uppercase, lowercase, number, and special character'),
      ],
    },
    confirmPassword: {
      initialValue: '',
      validators: [
        required('Please confirm your password'),
        matches('password', 'Passwords do not match'),
      ],
    },
    acceptTerms: {
      initialValue: '',
      validators: [
        required('You must accept the terms and conditions'),
      ],
    },
  });

  // SOLUTION 2: Implement form submission handler
  const onSubmit = async (formValues: RegistrationValues) => {
    console.log('Form submitted:', formValues);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSuccess(true);
  };

  // Helper to determine if we should show an error
  const showError = (field: keyof RegistrationValues) => {
    return touched[field] && errors[field];
  };

  // Get password strength for visual indicator
  const strength = values.password ? getPasswordStrength(values.password) : null;

  if (isSuccess) {
    return (
      <div className="registration-form-container">
        <div className="form-success">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Welcome aboard, {values.username}!</p>
          <button
            className="submit-button"
            onClick={() => {
              resetForm();
              setIsSuccess(false);
            }}
            style={{ marginTop: '20px' }}
          >
            Register Another Account
          </button>
        </div>
      </div>
    );
  }

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

        {/* SOLUTION 3: Password Field */}
        <div className={`form-group ${showError('password') ? 'has-error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="Create a strong password"
          />
          {values.password && (
            <>
              <div className="password-strength">
                <div className={`strength-bar ${strength === 'weak' ? 'weak' : ''} ${strength === 'medium' || strength === 'strong' ? 'medium' : ''} ${strength === 'strong' ? 'strong' : ''}`} />
                <div className={`strength-bar ${strength === 'medium' || strength === 'strong' ? 'medium' : ''} ${strength === 'strong' ? 'strong' : ''}`} />
                <div className={`strength-bar ${strength === 'strong' ? 'strong' : ''}`} />
              </div>
              <span className={`strength-label ${strength}`}>
                Password strength: {strength}
              </span>
            </>
          )}
          {showError('password') && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* SOLUTION 4: Confirm Password Field */}
        <div className={`form-group ${showError('confirmPassword') ? 'has-error' : ''}`}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            placeholder="Confirm your password"
          />
          {showError('confirmPassword') && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* SOLUTION 5: Terms Checkbox */}
        <div className={`form-group checkbox-group ${showError('acceptTerms') ? 'has-error' : ''}`}>
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={values.acceptTerms === 'true'}
            onChange={(e) => {
              const event = {
                ...e,
                target: {
                  ...e.target,
                  value: e.target.checked ? 'true' : '',
                  type: 'text',
                },
              } as React.ChangeEvent<HTMLInputElement>;
              handleChange('acceptTerms')(event);
            }}
            onBlur={handleBlur('acceptTerms')}
          />
          <label htmlFor="acceptTerms">
            I agree to the <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>
          </label>
        </div>
        {showError('acceptTerms') && (
          <span className="error-message" style={{ marginTop: '-15px' }}>
            {errors.acceptTerms}
          </span>
        )}

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
