'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star } from 'lucide-react';

export function Prizes() {
    const prizes = [
        {
            rank: 2,
            title: 'Runner Up',
            amount: '₹15,000',
            icon: <Medal className="w-12 h-12 text-slate-300" />,
            color: 'from-slate-300 to-slate-500',
            delay: 0.2,
        },
        {
            rank: 1,
            title: 'Champion',
            amount: '₹25,000',
            icon: <Trophy className="w-16 h-16 text-yellow-400" />,
            color: 'from-yellow-300 via-yellow-400 to-yellow-600',
            delay: 0,
        },
        {
            rank: 3,
            title: 'Second Runner Up',
            amount: '₹10,000',
            icon: <Medal className="w-12 h-12 text-amber-700" />,
            color: 'from-amber-600 to-amber-800',
            delay: 0.4,
        },
    ];

    return (
        <section id="prizes" className="py-20">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-3">
                        Prizes & Awards
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Celebrating excellence with exciting rewards
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {prizes.map((prize) => (
                        <motion.div
                            key={prize.rank}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: prize.delay, duration: 0.4 }}
                            className={prize.rank === 1 ? 'order-first md:order-2' : prize.rank === 2 ? 'order-2 md:order-1' : 'order-3'}
                        >
                            <Card className={`border ${prize.rank === 1 ? 'md:scale-105 border-amber-500/50' : 'border-border'} hover:border-primary/50 transition-all duration-300`}>
                                <CardHeader className="text-center pt-8 pb-4">
                                    <div className="mb-4">
                                        {prize.icon}
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">
                                        {prize.title}
                                    </div>
                                    <CardTitle className="text-4xl font-bold">
                                        {prize.amount}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-8">
                                    <p className="text-sm text-muted-foreground">
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
