"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center">
            {/* Decorative RPG visual element: subtle atmospheric glow & grid */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-30">
                <div className="h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <span className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Awaken Your Potential
                    </span>
                    <h1 className="font-display text-5xl font-bold leading-tight text-text-primary tracking-wide md:text-7xl lg:text-8xl">
                        YOUR LIFE. <br />
                        <span className="text-accent/90">IS THE GAME.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mx-auto mt-6 max-w-2xl font-sans text-lg text-text-secondary md:text-xl leading-relaxed"
                >
                    Transform your real-world goals into epic quests. Complete tasks to earn XP,
                    gather gold, and watch your character—and yourself—level up.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                        Begin Your Journey
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                        Explore the System
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
