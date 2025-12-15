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
import { ChevronLeft, ChevronRight, Trash2, Crown, Eye, Phone, MapPin, Building, User } from 'lucide-react';
import { deleteRegistration } from '@/actions/admin';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';

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
    const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

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

            {/* Desktop View - Table */}
            <div className="hidden md:block rounded-md border border-white/5 bg-card/30 backdrop-blur-sm overflow-x-auto">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Place</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead className="min-w-[200px]">Candidates</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Union Phone</TableHead>
                            <TableHead>Principal Name</TableHead>
                            <TableHead>Principal Phone</TableHead>
                            <TableHead className="text-right sticky right-0 bg-black/20 backdrop-blur-md">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
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
                                    <TableCell>{reg.place}</TableCell>
                                    <TableCell>{reg.district}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {reg.candidates && reg.candidates.length > 0 ? (
                                                reg.candidates.slice(0, 2).map((c, i) => (
                                                    <span key={i} className={`flex items-center text-xs ${c.isLeader ? 'text-yellow-500 font-semibold' : 'text-muted-foreground'}`}>
                                                        {c.isLeader && <Crown className="w-3 h-3 mr-1 fill-current" />}
                                                        {c.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground">No candidates</span>
                                            )}
                                            {reg.candidates && reg.candidates.length > 2 && (
                                                <span className="text-xs text-muted-foreground/50 italic">+{reg.candidates.length - 2} more...</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{reg.whatsappNumber}</TableCell>
                                    <TableCell>{reg.unionOfficialNumber}</TableCell>
                                    <TableCell>{reg.principalName}</TableCell>
                                    <TableCell>{reg.principalPhone}</TableCell>
                                    <TableCell className="text-right sticky right-0 bg-black/20 backdrop-blur-md">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedReg(reg)}
                                                className="text-muted-foreground hover:text-blue-400 hover:bg-blue-950/20 h-8 w-8"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(reg._id)}
                                                className="text-muted-foreground hover:text-red-500 hover:bg-red-950/20 h-8 w-8"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {registrations.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-white/5 rounded-xl border border-white/5">
                        No registrations found.
                    </div>
                ) : (
                    registrations.map((reg) => (
                        <div key={reg._id} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3 backdrop-blur-sm relative overflow-hidden group">
                            {/* Background accent */}
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                <Building className="w-20 h-20" />
                            </div>

                            <div className="relative z-10 flex justify-between items-start gap-3">
                                <div className="space-y-1 flex-1">
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                        {reg.candidates?.length || 0} Candidates
                                    </div>
                                    <h3 className="font-bold text-lg font-malayalam leading-tight text-white line-clamp-2">
                                        {reg.institutionName}
                                    </h3>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setSelectedReg(reg)}
                                        className="h-8 w-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => handleDelete(reg._id)}
                                        className="h-8 w-8 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-black/20 rounded-md p-2 border border-white/5">
                                    <div className="text-[10px] text-muted-foreground uppercase mb-0.5">District</div>
                                    <div className="font-medium text-white truncate">{reg.district}</div>
                                </div>
                                <div className="bg-black/20 rounded-md p-2 border border-white/5">
                                    <div className="text-[10px] text-muted-foreground uppercase mb-0.5">Place</div>
                                    <div className="font-medium text-white truncate">{reg.place}</div>
                                </div>
                            </div>

                            {/* Mobile Team Leader Preview */}
                            {reg.candidates?.some(c => c.isLeader) && (
                                <div className="relative z-10 flex items-center gap-2 text-amber-200 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                                    <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                                    <span className="font-medium text-xs truncate">
                                        Leader: {reg.candidates.find(c => c.isLeader)?.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
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

            {/* View Details Modal */}
            <Modal
                isOpen={!!selectedReg}
                onClose={() => setSelectedReg(null)}
                title="Registration Details"
            >
                {selectedReg && (
                    <div className="space-y-6">
                        {/* Institution Name */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Institution Name</label>
                            <div className="flex items-center gap-2 text-lg font-bold font-malayalam text-amber-100">
                                <Building className="w-5 h-5 text-amber-500" />
                                {selectedReg.institutionName}
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Place</label>
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    {selectedReg.place}
                                </div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">District</label>
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <MapPin className="w-4 h-4 text-rose-500" />
                                    {selectedReg.district}
                                </div>
                            </div>
                        </div>

                        {/* Candidates List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Candidates</label>
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    {selectedReg.candidates?.length || 0} Participants
                                </span>
                            </div>
                            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                {selectedReg.candidates?.map((c, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 border-b border-white/5 last:border-0 ${c.isLeader ? 'bg-amber-500/10' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${c.isLeader ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-muted-foreground'}`}>
                                            {c.isLeader ? <Crown className="w-4 h-4 fill-current" /> : <User className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-sm font-medium ${c.isLeader ? 'text-amber-200' : 'text-white'}`}>{c.name}</div>
                                            {c.isLeader && <div className="text-[10px] text-amber-500 uppercase tracking-wider font-bold">Team Leader</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Contact Information</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Principal */}
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                                        <Building className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Principal</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] text-muted-foreground">Name</div>
                                        <div className="text-sm font-medium text-white">{selectedReg.principalName}</div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] text-muted-foreground">Phone Number</div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-purple-200">
                                            <Phone className="w-3 h-3" /> {selectedReg.principalPhone}
                                        </div>
                                    </div>
                                </div>

                                {/* Officials */}
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Officials</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] text-muted-foreground">WhatsApp Number</div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-green-300">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            {selectedReg.whatsappNumber}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] text-muted-foreground">Union Official Number</div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-blue-200">
                                            <Phone className="w-3 h-3" /> {selectedReg.unionOfficialNumber}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-center text-muted-foreground/50 pt-2 font-mono">
                            ID: {selectedReg._id} • Registered: {new Date(selectedReg.createdAt).toLocaleString()}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
