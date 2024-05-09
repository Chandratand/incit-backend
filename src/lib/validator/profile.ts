import { z } from 'zod';

export const UpdateProfileValidator = z.object({
  name: z.string().min(1, 'Required'),
});
