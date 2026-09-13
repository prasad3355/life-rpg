"use client";

import * as React from "react";
import { Plus, Zap, Trophy, Target, Brain, Heart, Dumbbell, Shield, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { LevelBadge } from "@/components/rpg/level-badge";
import { ProgressBar } from "@/components/rpg/progress-bar";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { QuestStatus, type QuestStatusOption } from "@/components/rpg/quest-status";
import { StreakIndicator } from "@/components/rpg/streak-indicator";
import { StatDisplay } from "@/components/rpg/stat-display";
import { cn } from "@/lib/utils";

// --- Fixture Data ---
type Quest = {
    id: string;
    title: string;
    category: string;
    xp: number;
    gold: number;
    difficulty: "Easy" | "Medium" | "Hard" | "Epic";
    status: QuestStatusOption;
};

const initialQuests: Quest[] = [
    { id: "q1", title: "Complete System Architecture", category: "Deep Work", xp: 500, gold: 100, difficulty: "Hard", status: "in-progress" },
    { id: "q2", title: "Morning Conditioning", category: "Physical", xp: 150, gold: 25, difficulty: "Medium", status: "completed" },
    { id: "q3", title: "Read 20 Pages", category: "Intellect", xp: 100, gold: 15, difficulty: "Easy", status: "available" },
    { id: "q4", title: "Inbox Zero", category: "Discipline", xp: 75, gold: 10, difficulty: "Easy", status: "available" },
    { id: "q5", title: "Meditate for 15m", category: "Focus", xp: 120, gold: 20, difficulty: "Medium", status: "in-progress" },
];

const attributes = [
    { name: "Strength", value: 18, max: 50, icon: Dumbbell },
    { name: "Intellect", value: 24, max: 50, icon: Brain },
    { name: "Discipline", value: 31, max: 50, icon: Target },
    { name: "Focus", value: 16, max: 50, icon: Zap },
    { name: "Vitality", value: 28, max: 50, icon: Heart },
];

const activities = [
    { id: "a1", type: "quest", text: "Completed 'Morning Conditioning'", time: "2 hours ago", extra: "+150 XP" },
    { id: "a2", type: "reward", text: "Purchased 'Artisan Coffee'", time: "4 hours ago", extra: "-50 Gold" },
    { id: "a3", type: "level", text: "Reached Level 12", time: "Yesterday", extra: "" },
    { id: "a4", type: "quest", text: "Completed 'Weekly Planning'", time: "Yesterday", extra: "+250 XP" },
];

export default function DashboardPage() {
    const [quests, setQuests] = React.useState<Quest[]>(initialQuests);

    const handleCompleteQuest = (id: string) => {
        setQuests((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: "completed" } : q))
        );
    };

    const handleStartQuest = (id: string) => {
        setQuests((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: "in-progress" } : q))
        );
    };

    const dateString = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-10 pb-12">
            {/* 1. DASHBOARD HEADER */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border-default pb-6">
                <div>
                    <span className="font-sans text-sm font-semibold uppercase tracking-widest text-accent">
                        {dateString}
                    </span>
                    <h1 className="mt-2 font-display text-4xl font-medium tracking-wide text-text-primary md:text-5xl">
                        Your Journey
                    </h1>
                    <p className="mt-2 font-sans text-text-secondary max-w-xl">
                        Welcome back, Tav. The world is full of opportunities today. What will you conquer?
                    </p>
                </div>
                <div className="shrink-0">
                    <Button variant="primary" className="shadow-glow gap-2">
                        <Plus className="h-4 w-4" />
                        New Quest
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* LEFT COLUMN - 8 span */}
                <div className="flex flex-col gap-8 lg:col-span-8">

                    {/* 2. CHARACTER PROGRESS HERO */}
                    <section>
                        <Card className="relative overflow-hidden border-accent/20 shadow-glow bg-surface-elevated">
                            <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
                            <CardContent className="p-8">
                                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                                    <LevelBadge level={12} className="h-20 w-20 text-4xl shrink-0" />
                                    <div className="flex-1">
                                        <h2 className="font-display text-3xl font-semibold text-text-primary">Tav the Developer</h2>
                                        <p className="font-sans text-sm text-text-secondary mt-1">Class: Front-End Sorcerer &middot; Rank: Journeyman</p>

                                        <div className="mt-5">
                                            <div className="mb-2 flex items-center justify-between font-sans text-sm font-medium">
                                                <span className="text-text-primary flex items-center gap-2">
                                                    <Zap className="h-4 w-4 text-accent" /> Experience Points
                                                </span>
                                                <span className="text-text-muted">4,250 / 5,000 XP</span>
                                            </div>
                                            <ProgressBar value={4250} max={5000} variant="xp" className="h-2.5" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* 3. TODAY'S QUESTS */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-display text-2xl font-semibold tracking-wide text-text-primary">
                                Active Quests
                            </h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AnimatePresence mode="popLayout">
                                {quests.length > 0 ? quests.map((quest) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={quest.id}
                                    >
                                        <Card
                                            className={cn(
                                                "transition-colors duration-500",
                                                quest.status === "completed"
                                                    ? "opacity-60 border-border-default bg-background"
                                                    : "border-border-subtle bg-surface hover:border-accent/40"
                                            )}
                                        >
                                            <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <Badge variant={quest.status === "completed" ? "success" : "default"}>
                                                            {quest.category}
                                                        </Badge>
                                                        <Badge variant="outline">{quest.difficulty}</Badge>
                                                        <QuestStatus status={quest.status} />
                                                    </div>
                                                    <h4 className={cn(
                                                        "font-sans text-lg font-medium transition-colors duration-500",
                                                        quest.status === "completed" ? "text-text-secondary line-through" : "text-text-primary"
                                                    )}>
                                                        {quest.title}
                                                    </h4>
                                                </div>

                                                <div className="flex items-center gap-6 sm:px-4">
                                                    <div className="flex flex-col items-end sm:items-center">
                                                        <span className="font-sans text-sm font-semibold text-accent flex items-center gap-1">
                                                            <Zap className="h-3 w-3" /> {quest.xp}
                                                        </span>
                                                        <span className="font-sans text-xs text-text-muted flex items-center gap-1">
                                                            <Trophy className="h-3 w-3" /> {quest.gold}
                                                        </span>
                                                    </div>

                                                    <div className="w-full sm:w-auto mt-4 sm:mt-0">
                                                        {quest.status === "in-progress" && (
                                                            <Button variant="primary" size="sm" onClick={() => handleCompleteQuest(quest.id)} className="w-full sm:w-auto relative overflow-hidden group">
                                                                <span className="relative z-10">Complete</span>
                                                                <motion.div className="absolute inset-0 bg-white/20 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.2 }} />
                                                            </Button>
                                                        )}
                                                        {quest.status === "available" && (
                                                            <Button variant="secondary" size="sm" onClick={() => handleStartQuest(quest.id)} className="w-full sm:w-auto relative overflow-hidden group">
                                                                <span className="relative z-10">Begin</span>
                                                                <motion.div className="absolute inset-0 bg-accent-muted origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.2 }} />
                                                            </Button>
                                                        )}
                                                        {quest.status === "completed" && (
                                                            <Button variant="ghost" size="sm" disabled className="text-success w-full sm:w-auto">
                                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Done
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center p-8 border border-border-default border-dashed rounded-lg bg-surface/50 text-center"
                                    >
                                        <Target className="w-10 h-10 text-text-muted mb-3" />
                                        <span className="font-display text-lg text-text-secondary">No active quests found.</span>
                                        <span className="text-sm text-text-muted mt-1">Create a new quest to begin your journey.</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                </div>

                {/* RIGHT COLUMN - 4 span */}
                <div className="flex flex-col gap-8 lg:col-span-4">

                    {/* 4. DAILY STATUS */}
                    <section>
                        <h3 className="mb-4 font-display text-2xl font-semibold tracking-wide text-text-primary">
                            Daily Status
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 flex flex-col items-center text-center justify-center bg-surface-elevated">
                                <span className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">Current Streak</span>
                                <StreakIndicator days={14} active className="scale-110" />
                            </Card>
                            <Card className="p-4 flex flex-col items-center text-center justify-center bg-surface-elevated">
                                <span className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">Vault</span>
                                <CurrencyDisplay amount={1450} className="scale-110 border-transparent bg-transparent p-0" />
                            </Card>
                            <StatDisplay label="Today's XP" value="+650" icon={Zap} className="bg-surface-elevated border-border-subtle" />
                            <StatDisplay label="Quests Done" value="2 / 5" icon={CheckCircle2} className="bg-surface-elevated border-border-subtle" />
                        </div>
                    </section>

                    {/* 5. ATTRIBUTE PANEL */}
                    <section>
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Attributes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {attributes.map((attr) => (
                                    <div key={attr.name}>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 font-sans text-sm font-medium text-text-primary">
                                                <attr.icon className="h-4 w-4 text-text-muted" />
                                                {attr.name}
                                            </div>
                                            <span className="font-sans text-xs text-accent">Lvl {attr.value}</span>
                                        </div>
                                        <ProgressBar value={attr.value} max={attr.max} className="h-1.5 bg-background" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                    {/* 6. RECENT ACTIVITY */}
                    <section>
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Recent Lore</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l border-border-default ml-3 space-y-6 pb-2">
                                    {activities.length > 0 ? activities.map((activity, index) => (
                                        <div key={activity.id} className="relative pl-6">
                                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-surface bg-accent" />
                                            <div className="flex flex-col">
                                                <p className="font-sans text-sm font-medium text-text-primary">
                                                    {activity.text}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2 font-sans text-xs">
                                                    <span className="text-text-muted">{activity.time}</span>
                                                    {activity.extra && (
                                                        <>
                                                            <span className="text-border-subtle">&bull;</span>
                                                            <span className={activity.extra.includes("+") ? "text-success" : "text-danger"}>
                                                                {activity.extra}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center p-4 py-8 text-center bg-surface/30 rounded-lg ml-6 -left-[13px] relative border border-border-dashed border-border-default">
                                            <span className="text-sm font-semibold text-text-secondary">Silence reins</span>
                                            <span className="text-xs text-text-muted mt-1">There are no scrolls of recent lore yet.</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                </div>
            </div>
        </div>
    );
}
