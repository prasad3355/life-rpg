"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="relative overflow-hidden py-32 border-t border-border-default/50 bg-background">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-display text-5xl font-bold tracking-wider text-text-primary md:text-6xl">
                        READY TO PLAY?
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl font-sans text-xl text-text-secondary">
                        Start turning today's goals into tomorrow's progress. Your adventure awaits.
                    </p>
                    <div className="mt-10">
                        <Button variant="primary" size="lg" className="px-12 text-lg h-14 shadow-glow">
                            Create Your Character
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
