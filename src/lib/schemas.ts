import { z } from 'zod';

const phoneRegex = /^\d+$/;
const phoneMessage = 'Number must contain only digits.';

export const registrationSchema = z.object({
    institutionName: z.string().min(2, { message: 'Institution Name is required.' }),
    place: z.string().min(2, { message: 'Place is required.' }),
    district: z.string().min(1, { message: 'District is required.' }),
    candidates: z
        .array(
            z.object({
                name: z.string().min(2, { message: 'Candidate Name is required.' }),
                isLeader: z.boolean(),
            })
        )
        .min(1, { message: 'At least 1 candidate is required.' })
        .max(5, { message: 'Maximum 5 candidates allowed.' })
        .refine((items) => items.filter((item) => item.isLeader).length === 1, {
            message: 'Please select exactly one Team Leader.',
        }),
    whatsappNumber: z
        .string()
        .min(10, { message: 'WhatsApp Number must be at least 10 digits.' })
        .max(15, { message: 'Number is too long.' })
        .regex(phoneRegex, { message: phoneMessage }),
    unionOfficialNumber: z
        .string()
        .min(10, { message: 'Union Official Number must be at least 10 digits.' })
        .max(15, { message: 'Number is too long.' })
        .regex(phoneRegex, { message: phoneMessage }),
    principalName: z.string().min(2, { message: 'Principal Name is required.' }),
    principalPhone: z
        .string()
        .min(10, { message: 'Principal Phone Number must be at least 10 digits.' })
        .max(15, { message: 'Number is too long.' })
        .regex(phoneRegex, { message: phoneMessage }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
