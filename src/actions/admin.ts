'use server';

import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import { revalidatePath } from 'next/cache';

const ITEMS_PER_PAGE = 10;

export async function getRegistrations({
    query,
    page,
    district, // Changed from category to district for filtering if needed
}: {
    query: string;
    page: number;
    district?: string;
}) {
    await dbConnect();

    const filter: any = {};

    if (query) {
        const regex = new RegExp(query, 'i');
        filter.$or = [
            { institutionName: regex },
            { candidateNames: regex },
            { district: regex },
            { whatsappNumber: regex },
            { place: regex },
        ];
    }

    if (district && district !== 'All') {
        filter.district = district;
    }

    try {
        const totalCount = await Registration.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        const data = await Registration.find(filter)
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .lean(); // Convert to plain JS objects

        // Serialize _id and dates to plain strings/numbers if needed, but lean() helps.
        // However, _id is an object in Mongoose lean, often needs .toString() for client components if strict.
        // Assuming simple usage or non-strict serialization for now. Next.js server actions handle simple objects well.
        // To be safe, we map it:
        const serializedData = data.map((doc: any) => ({
            ...doc,
            _id: doc._id.toString(),
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt?.toISOString(),
        }));

        return {
            data: serializedData,
            totalPages,
            totalCount,
        };
    } catch (error) {
        console.error('Failed to fetch registrations:', error);
        return { data: [], totalPages: 0, totalCount: 0 };
    }
}

export async function getAllRegistrations() {
    await dbConnect();
    const data = await Registration.find({}).sort({ createdAt: -1 }).lean();
    return data.map((doc: any) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    }));
}

export async function deleteRegistration(id: string) {
    try {
        await dbConnect();
        await Registration.findByIdAndDelete(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete' };
    }
}
