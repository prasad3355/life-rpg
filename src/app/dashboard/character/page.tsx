import React from "react";
import { Metadata } from "next";
import { LevelBadge } from "@/components/rpg/level-badge";
import { ProgressBar } from "@/components/rpg/progress-bar";
import { StatDisplay } from "@/components/rpg/stat-display";
import { StreakIndicator } from "@/components/rpg/streak-indicator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Shield, Brain, Target, Zap, Heart, Sword, Award, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Character | Life RPG",
    description: "Your RPG character profile and attributes.",
};

const ATTRIBUTES = [
    { name: "Strength", value: 24, icon: Shield, color: "text-danger" },
    { name: "Intelligence", value: 38, icon: Brain, color: "text-accent" },
    { name: "Discipline", value: 45, icon: Target, color: "text-success" },
    { name: "Focus", value: 31, icon: Zap, color: "text-accent" },
    { name: "Vitality", value: 29, icon: Heart, color: "text-danger" },
];

const ACHIEVEMENTS = [
    { id: 1, title: "First Blood", description: "Complete your first quest.", date: "2026-09-01", rarity: "common" },
    { id: 2, title: "Iron Will", description: "Maintain a 7-day streak.", date: "2026-09-08", rarity: "rare" },
    { id: 3, title: "Scholar", description: "Reach level 5 in Intelligence.", date: "2026-09-10", rarity: "uncommon" },
];

const EQUIPMENT = [
    { id: 1, slot: "Primary", name: "Blade of Resolve", level: 3, type: "Sword", rarity: "rare" },
    { id: 2, slot: "Armor", name: "Mantle of Focus", level: 4, type: "Cloak", rarity: "epic" },
    { id: 3, slot: "Accessory", name: "Amulet of Time", level: 2, type: "Necklace", rarity: "uncommon" },
];

const HISTORY = [
    { id: 1, action: "Quest Completed", details: "Morning Routine", xp: "+50", time: "2 hours ago" },
    { id: 2, action: "Leveled Up", details: "Reached Level 12", xp: null, time: "1 day ago" },
    { id: 3, action: "Quest Completed", details: "Deep Work Session", xp: "+120", time: "1 day ago" },
    { id: 4, action: "Achievement Earned", details: "Scholar", xp: "+200", time: "3 days ago" },
];

export default function CharacterPage() {
    // Fixture Data
    const character = {
        name: "Elias Vance",
        level: 12,
        rank: "Adept Seeker",
        description: "A disciplined traveler focused on mastering the arts of productivity and personal growth.",
        currentXp: 3450,
        requiredXp: 4000,
        stats: {
            questsCompleted: 142,
            totalXp: 18450,
            currentStreak: 12,
            goldEarned: 2450,
            daysActive: 45,
        }
    };

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Editorial Hero Section */}
            <section className="relative flex flex-col gap-6 pt-8 pb-4">
                <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                    <div className="flex items-center gap-6">
                        <LevelBadge level={character.level} className="h-20 w-20 shadow-[0_0_30px_rgba(207,170,99,0.2)] border-2">
                            <span className="text-3xl">{character.level}</span>
                        </LevelBadge>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                                {character.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="font-display text-lg tracking-wide text-accent italic">
                                    {character.rank}
                                </span>
                                <Badge variant="outline" className="bg-surface-elevated text-text-secondary border-border-default">
                                    Level {character.level}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full max-w-xs flex-col gap-2 rounded-lg border border-border-default bg-surface p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-text-secondary uppercase tracking-wider text-xs">Experience</span>
                            <span className="font-bold text-accent">
                                {character.currentXp} <span className="text-text-muted font-normal">/ {character.requiredXp}</span>
                            </span>
                        </div>
                        <ProgressBar value={character.currentXp} max={character.requiredXp} variant="xp" className="h-1.5" />
                        <span className="text-right text-xs text-text-muted">
                            {character.requiredXp - character.currentXp} XP to next level
                        </span>
                    </div>
                </div>

                <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
                    {character.description}
                </p>
            </section>

            <Divider />

            {/* Main Content Two Columns */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                {/* Left Column - Attributes & Equipment */}
                <div className="flex flex-col gap-8 lg:col-span-7">

                    {/* Attributes */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold text-text-primary">Core Attributes</h2>
                            <Badge variant="outline" className="border-border-accent text-accent">
                                4 points available
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {ATTRIBUTES.map((attr) => (
                                <div key={attr.name} className="group relative flex items-center justify-between overflow-hidden rounded-lg border border-border-default bg-surface p-4 transition-colors hover:border-border-accent">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="rounded-md bg-surface-elevated p-2">
                                            <attr.icon className={`h-4 w-4 ${attr.color}`} />
                                        </div>
                                        <span className="font-medium text-text-primary">{attr.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="font-display text-xl font-bold text-text-primary">{attr.value}</span>
                                    </div>
                                    {/* Subtle background bar indicating relative strength */}
                                    <div
                                        className="absolute bottom-0 left-0 h-full bg-surface-elevated opacity-50 z-0 transition-all duration-500 ease-in-out group-hover:bg-accent-muted"
                                        style={{ width: `${(attr.value / 50) * 100}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Equipment */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">Active Equipment</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {EQUIPMENT.map((item) => (
                                <Card key={item.id} className="bg-surface hover:border-border-subtle transition-all">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                        <div className="text-xs uppercase tracking-wider text-text-muted mb-1 w-full text-left">
                                            {item.slot}
                                        </div>
                                        <div className="h-12 w-12 rounded-lg border border-border-subtle bg-surface-elevated flex items-center justify-center mb-2">
                                            <Sword className="h-6 w-6 text-text-secondary" />
                                        </div>
                                        <div className="font-semibold text-text-primary">{item.name}</div>
                                        <div className="flex items-center justify-between w-full mt-2">
                                            <span className="text-xs text-text-muted">Lvl {item.level}</span>
                                            <span className={`text-xs capitalize ${item.rarity === 'epic' ? 'text-accent font-semibold' : item.rarity === 'rare' ? 'text-success' : 'text-text-secondary'}`}>
                                                {item.rarity}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column - Stats & History */}
                <div className="flex flex-col gap-8 lg:col-span-5">

                    {/* Statistics */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">Statistics</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <StatDisplay label="Completed" value={character.stats.questsCompleted} />
                            <StatDisplay label="Streak" value={character.stats.currentStreak} />
                            <StatDisplay label="Total XP" value={character.stats.totalXp.toLocaleString()} />
                            <StatDisplay label="Gold Earned" value={character.stats.goldEarned.toLocaleString()} />
                        </div>
                    </section>

                    {/* Achievements */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold text-text-primary">Achievements</h2>
                            <span className="text-sm text-text-muted">3 / 24</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {ACHIEVEMENTS.map((achievement) => (
                                <div key={achievement.id} className="flex gap-4 rounded-lg border border-border-default bg-surface p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-accent bg-accent-muted text-accent">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-text-primary">{achievement.title}</span>
                                            <span className="text-xs text-text-muted">{achievement.date}</span>
                                        </div>
                                        <span className="text-sm text-text-secondary">{achievement.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* History */}
                    <section className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">Recent History</h2>
                        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface p-4">
                            {HISTORY.map((entry, index) => (
                                <div key={entry.id} className="relative flex gap-4">
                                    {/* Timeline line */}
                                    {index !== HISTORY.length - 1 && (
                                        <div className="absolute left-[11px] top-6 h-full w-px bg-border-default" />
                                    )}
                                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated ring-4 ring-surface">
                                        <div className="h-2 w-2 rounded-full bg-text-muted" />
                                    </div>
                                    <div className="flex flex-1 flex-col pb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-text-primary">{entry.action}</span>
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {entry.time}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm text-text-secondary">{entry.details}</span>
                                            {entry.xp && (
                                                <span className="text-sm font-semibold text-accent">{entry.xp} XP</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
