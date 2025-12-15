'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getAllRegistrations } from '@/actions/admin';
import { toast } from 'sonner';

export function ExportButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            toast.info('Preparing export...');

            const data = await getAllRegistrations();

            // Format data for export
            const formattedData = data.map((reg: any) => ({
                'Institution Name': reg.institutionName,
                'Place': reg.place,
                'District': reg.district,
                'Candidates': reg.candidates?.map((c: any) => `${c.name}${c.isLeader ? ' (Leader)' : ''}`).join(', ') || reg.candidateNames || '',
                'WhatsApp Number': reg.whatsappNumber,
                'Union Official Number': reg.unionOfficialNumber,
                'Principal Name': reg.principalName,
                'Principal Phone': reg.principalPhone,
                'Registered At': new Date(reg.createdAt).toLocaleString(),
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

            // Generate Excel file
            XLSX.writeFile(workbook, `Athmageeth_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success('Export downloaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleExport} disabled={isExporting} className="gap-2">
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export Excel'}
        </Button>
    );
}
