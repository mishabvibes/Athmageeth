'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, MapPin, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
    stats: {
        totalTeams: number;
        totalCandidates: number;
        districtStats: { district: string; count: number }[];
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const topDistrict = stats.districtStats[0];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Teams */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-linear-to-br from-amber-500/10 to-amber-900/10 border-amber-500/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-200">
                            Total Teams
                        </CardTitle>
                        <Users className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-100">{stats.totalTeams}</div>
                        <p className="text-xs text-amber-500/60 mt-1">
                            Registered Groups
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Total Candidates */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-linear-to-br from-blue-500/10 to-blue-900/10 border-blue-500/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-200">
                            Total Candidates
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-100">{stats.totalCandidates}</div>
                        <p className="text-xs text-blue-500/60 mt-1">
                            Individual Participants
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Top District */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-linear-to-br from-purple-500/10 to-purple-900/10 border-purple-500/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-200">
                            Top District
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-100 truncate" title={topDistrict?.district || 'N/A'}>
                            {topDistrict?.district || 'N/A'}
                        </div>
                        <p className="text-xs text-purple-500/60 mt-1">
                            {topDistrict?.count || 0} Registrations
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Status/Other */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-linear-to-br from-emerald-500/10 to-emerald-900/10 border-emerald-500/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-200">
                            Event Status
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-100">Active</div>
                        <p className="text-xs text-emerald-500/60 mt-1">
                            Registration Open
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick District Chart */}
            {stats.districtStats.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="md:col-span-2 lg:col-span-4"
                >
                    <Card className="border-white/5 bg-black/20 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground">District Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.districtStats.map((d, i) => (
                                    <div key={d.district} className="flex items-center gap-4">
                                        <div className="w-32 text-sm text-muted-foreground truncate text-right">{d.district}</div>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(d.count / stats.totalTeams) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                className="h-full bg-amber-500/50 rounded-full"
                                            />
                                        </div>
                                        <div className="w-8 text-sm text-right font-medium">{d.count}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

        </div>
    );
}
