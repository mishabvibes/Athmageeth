'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star } from 'lucide-react';

export function Prizes() {
    const prizes = [
        {
            rank: 2,
            title: 'Runner Up',
            amount: '₹8,063',
            icon: <Medal className="w-8 h-8 md:w-12 md:h-12 text-slate-300" />,
            color: 'from-slate-300 to-slate-500',
            delay: 0.2,
        },
        {
            rank: 1,
            title: 'Champion',
            amount: '₹10,063',
            icon: <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />,
            color: 'from-yellow-300 via-yellow-400 to-yellow-600',
            delay: 0,
        },
        {
            rank: 3,
            title: 'Second Runner Up',
            amount: '₹5,063',
            icon: <Medal className="w-8 h-8 md:w-12 md:h-12 text-amber-700" />,
            color: 'from-amber-600 to-amber-800',
            delay: 0.4,
        },
    ];

    return (
        <section id="prizes" className="py-12 md:py-20">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-3">
                        Prizes & Awards
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-lg">
                        Celebrating excellence with exciting rewards
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
                    {prizes.map((prize) => (
                        <motion.div
                            key={prize.rank}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: prize.delay, duration: 0.4 }}
                            className={`${prize.rank === 1
                                    ? 'col-span-2 md:col-span-1 order-first md:order-2'
                                    : prize.rank === 2
                                        ? 'col-span-1 order-2 md:order-1'
                                        : 'col-span-1 order-3'
                                }`}
                        >
                            <Card className={`h-full border ${prize.rank === 1 ? 'md:scale-105 border-amber-500/50 bg-amber-500/5' : 'border-white/5 bg-white/5'} hover:border-primary/50 transition-all duration-300`}>
                                <CardHeader className="text-center p-4 md:pt-8 md:pb-4">
                                    <div className="mb-2 md:mb-4 flex justify-center">
                                        {prize.icon}
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                                        {prize.title}
                                    </div>
                                    <CardTitle className="text-2xl md:text-4xl font-bold">
                                        {prize.amount}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-4 md:pb-8 pt-0">
                                    <p className="text-[10px] md:text-sm text-muted-foreground">
                                        Cash Prize + Trophy + Certificate
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
