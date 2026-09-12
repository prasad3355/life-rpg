"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatDisplay } from "@/components/rpg/stat-display";
import { LevelBadge } from "@/components/rpg/level-badge";
import { ProgressBar } from "@/components/rpg/progress-bar";
import { StreakIndicator } from "@/components/rpg/streak-indicator";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { Card } from "@/components/ui/card";
import { Brain, Dumbbell, Heart, Swords } from "lucide-react";

export function CharacterSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="font-display text-4xl font-semibold tracking-wide text-text-primary">
                        Character Build
                    </h2>
                    <p className="mt-4 font-sans text-lg text-text-secondary">
                        You are the protagonist. Track your attributes and watch yourself grow stronger over time as you complete daily objectives.
                    </p>
                    <ul className="mt-8 space-y-4 font-sans text-text-secondary">
                        <li className="flex items-center gap-3">
                            <Swords className="h-5 w-5 text-accent" />
                            <span>Earn experience and advance your player level.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-accent" />
                            <span>Stay consistent to build powerful streaks.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Brain className="h-5 w-5 text-accent" />
                            <span>Invest points into attributes like Intellect and Vitality.</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Card className="relative overflow-hidden p-8 shadow-glow border-accent/20">
                        {/* Ambient Background Effect */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

                        <div className="relative z-10 flex items-start justify-between border-b border-border-default pb-6">
                            <div className="flex items-center gap-4">
                                <LevelBadge level={12} className="h-16 w-16 text-3xl" />
                                <div>
                                    <h3 className="font-display text-2xl font-bold text-text-primary">Tav the Developer</h3>
                                    <div className="mt-1 flex gap-3">
                                        <StreakIndicator days={14} />
                                        <CurrencyDisplay amount={1450} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 py-6 border-b border-border-default">
                            <div className="flex justify-between font-sans text-sm font-medium text-text-primary mb-2">
                                <span>Experience Points</span>
                                <span className="text-text-muted">4,250 / 5,000 XP</span>
                            </div>
                            <ProgressBar value={4250} max={5000} variant="xp" className="h-3" />
                        </div>

                        <div className="relative z-10 pt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <StatDisplay label="Strength" value={18} icon={Dumbbell} className="p-3" />
                            <StatDisplay label="Intellect" value={24} icon={Brain} className="p-3" />
                            <StatDisplay label="Charisma" value={12} className="p-3" />
                            <StatDisplay label="Vitality" value={14} icon={Heart} className="p-3 bg-surface-elevated" />
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
