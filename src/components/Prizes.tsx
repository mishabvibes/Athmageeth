'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const prizes = [
    {
        rank: '2nd',
        amount: '₹8,063',
        label: 'Runner Up',
        iconColor: 'text-gray-300',
        borderColor: 'border-gray-500/50',
        delay: 0.4,
    },
    {
        rank: '1st',
        amount: '₹10,063',
        label: 'Grand Prize',
        iconColor: 'text-yellow-400',
        borderColor: 'border-amber-400',
        delay: 0.2, // Center one appears first or together? Let's make it distinct.
        scale: 1.1,
    },
    {
        rank: '3rd',
        amount: '₹5,063',
        label: 'Second Runner Up',
        iconColor: 'text-amber-700',
        borderColor: 'border-amber-700/50',
        delay: 0.6,
    },
];

export function Prizes() {
    return (
        <section id="prizes" className="py-20 container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-malayalam mb-4 bg-linear-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    Prizes & Rewards
                </h2>
                <p className="text-muted-foreground">Competitors stand a chance to win attractive cash prizes</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
                {prizes.map((prize, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: prize.delay }}
                        className={`w-full md:w-1/3 ${prize.scale ? 'md:-mt-8 md:mb-8 z-10' : ''}`}
                    >
                        <Card className={`relative overflow-hidden text-center h-full hover:bg-card/80 transition-colors ${prize.scale ? 'border-amber-500/50 shadow-amber-500/10 shadow-2xl bg-linear-to-b from-amber-950/40 to-black/40' : 'bg-black/20'}`}>
                            <CardHeader>
                                <div className="mx-auto p-4 rounded-full bg-white/5 w-fit mb-2">
                                    <Trophy className={`w-8 h-8 ${prize.iconColor}`} />
                                </div>
                                <CardTitle className={`text-3xl md:text-5xl font-bold ${prize.iconColor}`}>
                                    {prize.amount}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-semibold mb-1">{prize.rank}</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-widest">{prize.label}</div>
                            </CardContent>

                            {/* Decorative gradient glow */}
                            <div className={`absolute inset-0 bg-linear-to-t ${prize.scale ? 'from-amber-500/10' : 'from-transparent'} to-transparent pointer-events-none`} />
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
