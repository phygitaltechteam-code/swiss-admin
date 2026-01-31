// src/components/ProjectWork/types.ts
import {z} from 'zod';

export const formSchema = z.object({
  srNo: z.coerce.number({
    invalid_type_error: 'Serial number must be a number.',
  }),
  name: z.string().min(1, {message: 'Name is required.'}),
  description: z.string().min(1, {message: 'Description is required.'}),
  assignedTo: z.string().min(1, {message: 'Assigned To is required.'}),
  reviewBy: z.string().optional(),
  priority: z.string().min(1, {message: 'Priority is required.'}),
  dueDate: z.coerce.date().optional(),
  dueTime: z.string().min(1, {message: 'Time is required.'}),
  isAttachment: z.boolean().default(false),
  documentNote: z.string().optional(),
  document: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface UploadedFile {
  id?: string;
  url: string;
  file: File | null;
  type: string;
  name: string;
  isExisting?: boolean;
}
