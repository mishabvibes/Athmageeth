import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { RegistrationsTable } from '@/components/admin/RegistrationsTable';
import { getRegistrations } from '@/actions/admin';

export const metadata = {
    title: 'Admin Dashboard | Athmageeth',
};

// Define search params type
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminDashboardPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    if (!session) {
        redirect('/admin/login');
    }

    const query = (searchParams.query as string) || '';
    const page = Number(searchParams.page) || 1;
    const district = (searchParams.district as string) || '';

    // Fetch data
    const { data, totalPages, totalCount } = await getRegistrations({
        query,
        page,
        district,
    });

    return (
        <div className="min-h-screen bg-background/50 p-6 md:p-8 space-y-8">
            <DashboardHeader totalCount={totalCount} />

            <div className="space-y-4">
                <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
                    <RegistrationsTable
                        registrations={JSON.parse(JSON.stringify(data))}
                        totalPages={totalPages}
                        currentPage={page}
                    />
                </Suspense>
            </div>
        </div>
    );
}
