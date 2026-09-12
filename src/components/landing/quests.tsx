"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { QuestStatus } from "@/components/rpg/quest-status";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const mockQuests = [
    {
        title: "Master the Arcane Forge",
        category: "Algorithm Practice",
        xp: 250,
        gold: 50,
        status: "in-progress" as const,
        difficulty: "Hard",
        highlight: true,
    },
    {
        title: "Physical Conditioning",
        category: "Workout",
        xp: 150,
        gold: 20,
        status: "available" as const,
        difficulty: "Medium",
        highlight: false,
    },
    {
        title: "Tome of Wisdom",
        category: "Read a Chapter",
        xp: 75,
        gold: 10,
        status: "completed" as const,
        difficulty: "Easy",
        highlight: false,
    },
];

export function QuestSection() {
    return (
        <section className="bg-surface-elevated py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <h2 className="font-display text-4xl font-semibold tracking-wide text-text-primary">
                            The Quest Board
                        </h2>
                        <p className="mt-4 font-sans text-lg text-text-secondary">
                            Daily habits transformed into tangible challenges with real progression.
                        </p>
                    </div>
                    <Button variant="secondary">View All Quests</Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {mockQuests.map((quest, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className={cn("h-full transition-colors hover:border-border-accent",
                                quest.highlight ? "border-accent/50 shadow-glow" : "")}
                            >
                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <Badge variant={quest.status === "completed" ? "success" : "default"}>
                                            {quest.category}
                                        </Badge>
                                        <Badge variant="outline">{quest.difficulty}</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{quest.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 font-sans font-medium text-accent">
                                            <Zap className="h-4 w-4" />
                                            <span>+{quest.xp} XP</span>
                                        </div>
                                        <CurrencyDisplay amount={quest.gold} />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-border-default pt-4">
                                    <QuestStatus status={quest.status} />
                                    {quest.status !== "completed" && (
                                        <Button variant="ghost" size="sm">
                                            {quest.status === "available" ? "Accept Quest" : "Complete"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
