// Shared definitions
// Use Zod for validation schemas

import { z } from 'zod';

// Example: User Schema
export const UserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2),
});

// Example: Subject Schema
export const SubjectSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});
