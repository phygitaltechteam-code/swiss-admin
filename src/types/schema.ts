import {z} from 'zod';

export const packageSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Price must be a positive number'),
  ),

  work: z
    .array(z.string().min(1, 'Please select a work'))
    .min(1, 'At least one work must be selected'),
});

export const saveRoomSchema = z.object({
  roomCategoryId: z.string({required_error: 'Facility type is required'}),
  roomType: z.string({required_error: 'Category is required'}).optional(),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Capacity must be a positive number'),
  ),
  No: z.string().min(1, 'Room numbers are required'),
});

export const addOnServiceSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Price must be a positive number'),
  ),
});

export const materialItemSchema = z.object({
  id: z.string().uuid({
    message: 'ID must be a valid UUID',
  }),
  quantity: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, 'Quantity must be a positive number'),
  ),
});

export const materialListSchema = z.object({
  items: z.array(materialItemSchema).optional(),
});

export const marriageSchema = z.object({
  brideName: z.string().min(3, 'Bride Name is required'),
  brideAdhar: z
    .string()
    .min(1, 'Aadhaar is required')
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),

  brideAddress: z.string().min(3, 'Address is required'),
  brideDob: z
    .string()
    .min(1, 'Date of Birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of Birth must be in YYYY-MM-DD format'),

  groomName: z.string().min(3, 'Name is required'),
  groomAdhar: z
    .string()
    .min(1, 'Aadhaar is required')
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  groomAddress: z.string().min(3, 'Address is required'),
  groomDob: z
    .string()
    .min(1, 'Date of Birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of Birth must be in YYYY-MM-DD format'),

  marrigeReligion: z.string().min(3, 'Religion is required'),
  marrigeCaste: z.string().min(3, 'Cast is required'),

  brideName_Marathi: z.string().min(3, 'वधूचे नाव आवश्यक आहे'),
  brideAddress_Marathi: z.string().min(3, 'वधूचा पत्ता आवश्यक आहे'),
  groomName_Marathi: z.string().min(3, 'वराचे नाव आवश्यक आहे'),
  groomAddress_Marathi: z.string().min(3, 'वराचा पत्ता आवश्यक आहे'),
  marrigeReligion_Marathi: z.string().min(3, 'धर्म आवश्यक आहे'),
  marrigeCaste_Marathi: z.string().min(3, 'जात आवश्यक आहे'),
});
