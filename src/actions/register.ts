'use server';

import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import { registrationSchema, RegistrationFormValues } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export type ActionResponse = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

export async function registerParticipant(
    data: RegistrationFormValues
): Promise<ActionResponse> {
    try {
        // 1. Validate Input
        const validatedFields = registrationSchema.safeParse(data);

        if (!validatedFields.success) {
            // Flattening errors for complex arrays might be tricky for simple frontend display but let's try standard flatten
            // However, for array errors, Zod might return `candidates.0.name` keys.
            // We will return flattened errors.
            const formattedErrors: Record<string, string[]> = {};

            validatedFields.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                if (!formattedErrors[path]) {
                    formattedErrors[path] = [];
                }
                formattedErrors[path].push(issue.message);
            });

            return {
                success: false,
                message: 'Please check the form for errors.',
                errors: formattedErrors,
            };
        }

        const {
            institutionName,
            place,
            district,
            candidates,
            whatsappNumber,
            unionOfficialNumber,
            principalName,
            principalPhone
        } = validatedFields.data;

        await dbConnect();

        // 2. Check Duplicates
        const existingUser = await Registration.findOne({
            whatsappNumber: whatsappNumber,
        });

        if (existingUser) {
            return {
                success: false,
                message: 'Registration with this WhatsApp Number already exists.',
            };
        }

        // 3. Create Registration
        await Registration.create({
            institutionName,
            place,
            district,
            candidates, // Updated structure
            whatsappNumber,
            unionOfficialNumber,
            principalName,
            principalPhone,
        });

        // 4. Revalidate Admin Data
        revalidatePath('/admin');

        return {
            success: true,
            message: 'Registration successful! Good luck.',
        };
    } catch (error) {
        console.error('Registration Error:', error);
        return {
            success: false,
            message: 'Something went wrong. Please try again.',
        };
    }
}
