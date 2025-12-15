'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-20 bg-linear-to-b from-transparent via-transparent to-black/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-200 uppercase bg-amber-900/30 rounded-full border border-amber-500/20 backdrop-blur-sm">
                        Cultural Fest 2025
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 mx-auto"
                >
                    <Image
                        src="/Aathma-Geeth.png"
                        alt="Athmageeth"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl text-lg md:text-xl text-muted-foreground/90 font-light"
                >
                    Discover the rhythm of soul. Join us for a celebration of art, culture, and tradition.
                    <br />
                    Grand prizes waiting for the champions.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center mt-8"
                >
                    <Link href="/register" className="w-full sm:w-auto">
                        <Button variant="gold" size="lg" className="w-full font-semibold text-lg gap-2">
                            Register Now <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#prizes" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full border-amber-500/30 hover:bg-amber-950/30 hover:text-amber-200">
                            View Prizes
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
