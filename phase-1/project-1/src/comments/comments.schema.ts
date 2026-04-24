import { z } from 'zod';

export const CreateCommentSchema = z.object({
   text: z.string().min(1, "Comment text is required"),
});

export const UpdateCommentSchema = z.object({
   text: z.string().min(1, "Comment text is required"),
});

export const IDSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Types générés
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
