import { z } from 'zod';

export const UpdateProfileValidator = z.object({
  email: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
});
