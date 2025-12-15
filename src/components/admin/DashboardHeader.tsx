import { Button } from '@/components/ui/button';
import { ExportButton } from './ExportButton';
import { logout } from '@/actions/auth';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    totalCount: number;
}

export function DashboardHeader({ totalCount }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
            <div>
                <h1 className="text-3xl font-bold font-malayalam text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage registrations and data</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* <div className="bg-primary/10 px-4 py-2 rounded-md border border-primary/20">
                    <span className="text-sm text-muted-foreground">Total Registrations</span>
                    <div className="text-2xl font-bold text-primary">{totalCount}</div>
                </div> */}

                <ExportButton />

                <form action={logout}>
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                    </Button>
                </form>
            </div>
        </div>
    );
}
