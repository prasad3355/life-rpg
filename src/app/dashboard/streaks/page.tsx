import React from "react";
import { Metadata } from "next";
import { Flame, Calendar as CalendarIcon, Trophy, Zap, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { StatDisplay } from "@/components/rpg/stat-display";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";

export const metadata: Metadata = {
    title: "Streaks | Life RPG",
    description: "Your consistency and momentum visualized.",
};

const WEEKLY_ACTIVITY = [
    { day: "Mon", status: "completed" },
    { day: "Tue", status: "completed" },
    { day: "Wed", status: "completed" },
    { day: "Thu", status: "completed" },
    { day: "Fri", status: "missed" },
    { day: "Sat", status: "completed" },
    { day: "Sun", status: "pending" },
];

const HISTORY = [
    { id: 1, action: "7 Day Streak Reached", xp: "+50", time: "2 days ago", icon: Trophy, color: "text-accent" },
    { id: 2, action: "Streak Restored", xp: "-500 Gold", time: "5 days ago", icon: Flame, color: "text-danger" },
    { id: 3, action: "14 Day Streak Reached", xp: "+150", time: "2 weeks ago", icon: Trophy, color: "text-accent" },
    { id: 4, action: "30 Day Streak Broken", xp: null, time: "1 month ago", icon: Flame, color: "text-text-muted" },
];

export default function StreaksPage() {
    const calendarDays = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        // Mock data, some missed, heavily active in recent days
        active: i > 25 ? true : i === 22 || i === 15 ? false : Math.random() > 0.3
    }));

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col gap-2 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                            Momentum
                        </h1>
                        <p className="mt-3 text-lg text-text-secondary max-w-2xl leading-relaxed italic font-display text-2xl">
                            "Consistency is the forge where true potential takes shape. Each day adds another strike to the steel."
                        </p>
                    </div>
                    <div className="hidden md:flex flex-col items-center justify-center p-6 border border-border-accent rounded-full bg-accent-muted/10 h-32 w-32 relative">
                        <Flame className="w-10 h-10 text-danger mb-1" fill="currentColor" />
                        <span className="font-display font-bold text-3xl text-text-primary">12</span>
                        <div className="absolute -bottom-3 bg-surface border border-border-accent px-3 py-1 rounded-full text-xs font-bold text-accent">
                            ACTIVE
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* Core Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatDisplay label="Current Streak" value="12 Days" icon={Flame} className="border-border-accent bg-accent-muted/5" />
                <StatDisplay label="Longest Streak" value="38 Days" icon={Trophy} />
                <StatDisplay label="Consistency XP" value="+1,250" icon={Zap} />
                <StatDisplay label="Active Days" value="142" icon={CalendarIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Visualizations Column */}
                <div className="flex flex-col gap-8 lg:col-span-8">

                    {/* Weekly View */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">This Week's Forging</h2>
                        <div className="grid grid-cols-7 gap-2">
                            {WEEKLY_ACTIVITY.map((day, idx) => (
                                <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-lg border flex-1 transition-all
                                    ${day.status === 'completed' ? 'bg-danger-muted border-danger/30 shadow-[0_0_15px_rgba(201,107,99,0.1)]' :
                                        day.status === 'missed' ? 'bg-surface border-border-subtle opacity-50' :
                                            'bg-surface-elevated border-border-default border-dashed opacity-80'}`}
                                >
                                    <span className="text-sm font-medium mb-2 text-text-secondary">{day.day}</span>
                                    {day.status === 'completed' ? (
                                        <Flame className="w-6 h-6 text-danger" fill="currentColor" />
                                    ) : day.status === 'missed' ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-border-subtle" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-border-default border-dashed" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 30 Day Graph/Calendar */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold text-text-primary">30-Day Activity</h2>
                            <div className="flex items-center gap-2">
                                <button aria-label="Previous month" className="p-1 text-text-muted hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent rounded"><ChevronLeft className="w-5 h-5" /></button>
                                <span className="text-sm text-text-secondary font-medium uppercase tracking-wider">September 2026</span>
                                <button aria-label="Next month" disabled className="p-1 text-text-muted hover:text-text-primary opacity-50 cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent rounded"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="bg-surface border border-border-default rounded-lg p-6">
                            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                                {/* Mock week days header */}
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <div key={i} className="text-center text-xs font-semibold text-text-muted tracking-wider">{d}</div>
                                ))}
                                {/* Empty days offset mockup (assuming month started on Tuesday) */}
                                <div className="aspect-square opacity-0"></div>
                                {/* Calendar Days */}
                                {calendarDays.map((date) => (
                                    <div key={date.day} className="flex items-center justify-center aspect-square">
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors
                                            ${date.active ? 'bg-danger text-[#FFF] shadow-[0_0_10px_rgba(201,107,99,0.3)]' : 'bg-surface-elevated text-text-muted'}`}
                                        >
                                            {date.day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Milestones & History Column */}
                <div className="flex flex-col gap-8 lg:col-span-4">

                    {/* Milestones */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">Next Milestones</h2>
                        <Card className="bg-surface overflow-hidden">
                            <div className="h-1 bg-surface-elevated w-full relative">
                                <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: '60%' }}></div>
                            </div>
                            <CardContent className="p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border-default flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-text-muted" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary">14 Days</div>
                                            <div className="text-xs text-text-secondary">Initiate</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-accent">2 days left</div>
                                </div>
                                <Divider className="my-1" />
                                <div className="flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border-default flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-text-muted" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary">30 Days</div>
                                            <div className="text-xs text-text-secondary">Adept</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Recent History */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">History</h2>
                        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface p-4">
                            {HISTORY.length > 0 ? HISTORY.map((entry, index) => (
                                <div key={entry.id} className="relative flex gap-4">
                                    {/* Timeline line */}
                                    {index !== HISTORY.length - 1 && (
                                        <div className="absolute left-[11px] top-6 h-full w-px bg-border-default" />
                                    )}
                                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated ring-4 ring-surface">
                                        <entry.icon className={`h-3 w-3 ${entry.color}`} />
                                    </div>
                                    <div className="flex flex-1 flex-col pb-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-text-primary">{entry.action}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {entry.time}
                                            </span>
                                            {entry.xp && (
                                                <span className={`text-xs font-semibold ${entry.xp.includes('-') ? 'text-danger' : 'text-accent'}`}>{entry.xp}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6">
                                    <span className="text-sm font-semibold text-text-secondary">No history recorded</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
