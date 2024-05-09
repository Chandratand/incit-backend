import { z } from 'zod';

export const SignInValidator = z.object({
  email: z.string().email().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
const passwordRequirements = 'Password must be at least 8 characters and include at least one uppercase, one lowercase, one number, and one special character';

export const SignUpValidator = z
  .object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
    password: z.string().regex(passwordRegex, {
      message: passwordRequirements,
    }),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // This shows where the error message should be attached in case of mismatch
  });

export const ResetPasswordValidator = z
  .object({
    oldPassword: z.string().min(1, 'Required'),
    newPassword: z.string().regex(passwordRegex, {
      message: passwordRequirements,
    }),
    confirmNewPassword: z.string().min(1, 'Required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords must match',
    path: ['confirmNewPassword'], // This shows where the error message should be attached in case of mismatch
  });
