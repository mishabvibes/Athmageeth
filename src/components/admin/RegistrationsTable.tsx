'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2, Crown } from 'lucide-react';
import { deleteRegistration } from '@/actions/admin';
import { toast } from 'sonner';

interface Candidate {
    name: string;
    isLeader: boolean;
}

interface Registration {
    _id: string;
    institutionName: string;
    place: string;
    district: string;
    candidates: Candidate[];
    whatsappNumber: string;
    unionOfficialNumber: string;
    principalName: string;
    principalPhone: string;
    createdAt: string;
}

interface RegistrationsTableProps {
    registrations: Registration[];
    totalPages: number;
    currentPage: number;
}

export function RegistrationsTable({
    registrations,
    totalPages,
    currentPage
}: RegistrationsTableProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, [searchParams, pathname, replace]);

    // Manual debounce wrapper
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const debouncedSearch = debounce(handleSearch, 300);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this registration?')) {
            const result = await deleteRegistration(id);
            if (result.success) {
                toast.success('Registration deleted');
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Search by institution, candidate, or phone..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                    className="md:max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/5 bg-card/30 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead>Date</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Candidates</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Union Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No registrations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((reg) => (
                                <TableRow key={reg._id} className="border-white/5 hover:bg-white/5">
                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium font-malayalam">{reg.institutionName}</TableCell>
                                    <TableCell>{reg.district}</TableCell>
                                    <TableCell className="max-w-[250px]">
                                        <div className="flex flex-col gap-1">
                                            {reg.candidates && reg.candidates.length > 0 ? (
                                                reg.candidates.map((c, i) => (
                                                    <span key={i} className={`flex items-center text-xs ${c.isLeader ? 'text-yellow-500 font-semibold' : 'text-muted-foreground'}`}>
                                                        {c.isLeader && <Crown className="w-3 h-3 mr-1 fill-current" />}
                                                        {c.name}
                                                    </span>
                                                ))
                                            ) : (
                                                // Fallback for old data if any
                                                <span className="text-muted-foreground">No candidates</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{reg.whatsappNumber}</TableCell>
                                    <TableCell>{reg.unionOfficialNumber}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(reg._id)}
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-950/20 h-8 w-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
