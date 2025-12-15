'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black/90">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-background.png"
                    alt="Background"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                    sizes="100vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/80" />
            </div>

            <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 space-y-8 md:space-y-12">

                {/* Center Content Typography */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl aspect-[4/3] sm:aspect-video md:aspect-[21/9]"
                >
                    <Image
                        src="/content.png"
                        alt="Athmageeth Content"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 w-2-3 max-w-xs sm:max-w-none justify-center"
                >
                    <Link href="/register" className="w-full sm:w-auto">
                        <Button variant="gold" size="lg" className="w-full font-bold text-lg h-12 md:h-14 px-8 shadow-amber-500/20 shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all rounded-full">
                            Register Now <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                    <Link href="#prizes" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full h-12 md:h-14 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-md rounded-full">
                            View Prizes
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
