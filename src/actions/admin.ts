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
            { 'candidates.name': regex },
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

export async function getDashboardStats() {
    try {
        await dbConnect();

        const totalTeams = await Registration.countDocuments();

        // Aggregate to get total candidates
        // Note: candidates is an array of objects
        const candidateStats = await Registration.aggregate([
            { $project: { candidateCount: { $size: "$candidates" } } },
            { $group: { _id: null, total: { $sum: "$candidateCount" } } }
        ]);
        const totalCandidates = candidateStats[0]?.total || 0;

        // Aggregate by District
        const districtStats = await Registration.aggregate([
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        return {
            totalTeams,
            totalCandidates,
            districtStats: districtStats.map(d => ({ district: d._id, count: d.count }))
        };

    } catch (error) {
        console.error('Failed to get stats', error);
        return { totalTeams: 0, totalCandidates: 0, districtStats: [] };
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
