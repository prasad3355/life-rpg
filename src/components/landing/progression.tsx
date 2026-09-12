"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Target, Scroll, Zap, TrendingUp } from "lucide-react";
import { Divider } from "@/components/ui/divider";

const steps = [
    {
        icon: Target,
        title: "Action",
        description: "Set a real-world goal.",
    },
    {
        icon: Scroll,
        title: "Quest",
        description: "Accept the challenge.",
    },
    {
        icon: Zap,
        title: "Earn XP",
        description: "Claim your rewards.",
    },
    {
        icon: TrendingUp,
        title: "Level Up",
        description: "Grow your attributes.",
    },
];

export function ProgressionSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
                <h2 className="font-display text-4xl font-semibold tracking-wide text-text-primary">
                    The Mechanics of Reality
                </h2>
                <p className="mt-4 font-sans text-lg text-text-secondary">
                    A seamless transition from daily habit to epic achievement.
                </p>
            </div>

            <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0">
                    <Divider decorative className="border-border-accent/40" />
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="group flex flex-col items-center bg-surface p-8 text-center border border-border-default rounded-lg hover:border-accent/50 transition-colors shadow-subtle relative"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated text-accent group-hover:scale-110 transition-transform duration-300">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="font-display text-2xl font-medium text-text-primary">
                                {step.title}
                            </h3>
                            <p className="mt-2 font-sans text-sm text-text-muted">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
