# Exercise 7: Advanced Form Validation

## Difficulty: Advanced

## Learning Objectives
- Controlled form inputs
- Custom form validation hook
- Real-time validation feedback
- Form submission handling
- TypeScript generics with forms

## Task
Create a robust form validation system with a custom `useForm` hook that handles validation, error display, and submission.

## Requirements
1. Create a `useForm` custom hook with TypeScript generics
2. Support multiple validation rules per field
3. Implement real-time validation (on blur and change)
4. Show validation errors with proper UX
5. Prevent submission until form is valid
6. Handle async submission with loading state

## Files to Complete
- `useForm.ts` - Custom form hook with validation
- `validators.ts` - Validation utility functions
- `RegistrationForm.tsx` - Registration form using the hook

## Hints
- Use generics to type the form values: `useForm<T>`
- Validation rules can be an array of functions
- Consider touched state to only show errors after interaction
- Use async/await for form submission
