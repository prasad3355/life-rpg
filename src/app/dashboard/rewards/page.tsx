"use client";

import React, { useState } from "react";
import { Coins, Filter, Star, Lock, CheckCircle2, Gift } from "lucide-react";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

const REWARD_DB = [
    { id: 1, title: "Weekend Getaway", description: "Take a full 48 hours completely offline. No work.", cost: 5000, rarity: "epic", category: "lifestyle", status: "locked" },
    { id: 2, title: "New Mechanical Keyboard", description: "Purchase that custom keyboard you've been eyeing.", cost: 8000, rarity: "legendary", category: "gear", status: "locked" },
    { id: 3, title: "Guilt-free Gaming Night", description: "3 hours of uninterrupted gaming time tonight.", cost: 500, rarity: "common", category: "leisure", status: "available" },
    { id: 4, title: "Fancy Coffee", description: "Visit the artisan cafe downtown instead of making coffee at home.", cost: 150, rarity: "common", category: "lifestyle", status: "available" },
    { id: 5, title: "Movie Theater Trip", description: "Go see a movie in theaters this weekend.", cost: 1000, rarity: "rare", category: "leisure", status: "available" },
    { id: 6, title: "Takeout Dinner", description: "Order your favorite takeout instead of cooking.", cost: 600, rarity: "uncommon", category: "lifestyle", status: "earned" },
    { id: 7, title: "New Book", description: "Buy a new physical book for your collection.", cost: 800, rarity: "rare", category: "gear", status: "earned" },
];

const CATEGORIES = ["All", "Lifestyle", "Gear", "Leisure"];

export default function RewardsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const currentGold = 2450;

    const filteredRewards = REWARD_DB.filter(
        reward => activeCategory === "All" || reward.category.toLowerCase() === activeCategory.toLowerCase()
    );

    const availableRewards = filteredRewards.filter(r => r.status === "available");
    const lockedRewards = filteredRewards.filter(r => r.status === "locked");
    const earnedRewards = filteredRewards.filter(r => r.status === "earned");

    const renderEmptyState = (status: string) => (
        <div className="flex flex-col items-center justify-center p-8 border border-border-default border-dashed rounded-lg bg-surface/50 text-center">
            <Gift className="w-10 h-10 text-text-muted mb-3" />
            <span className="font-display text-lg text-text-secondary">No {status} rewards found.</span>
            <span className="text-sm text-text-muted mt-1">Keep completing quests to earn more gold and unlock possibilities.</span>
        </div>
    );

    const renderRewardCard = (reward: any) => (
        <Card key={reward.id} className={`bg-surface transition-all ${reward.status === "locked" ? "opacity-60 grayscale hover:grayscale-0" :
                reward.status === "earned" ? "border-success/30" : "hover:border-border-accent"
            }`}>
            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <Badge variant={
                        reward.rarity === 'legendary' ? 'default' :
                            reward.rarity === 'epic' ? 'default' :
                                reward.rarity === 'rare' ? 'success' : 'outline'
                    } className={`capitalize ${reward.rarity === 'epic' ? 'text-accent border-accent' : reward.rarity === 'legendary' ? 'text-danger border-danger shadow-glow' : ''}`}>
                        {reward.rarity}
                    </Badge>
                    {reward.status === 'locked' && <Lock className="w-4 h-4 text-text-muted" />}
                    {reward.status === 'earned' && <CheckCircle2 className="w-4 h-4 text-success" />}
                </div>

                <h3 className="font-display text-xl font-bold text-text-primary mb-2 line-clamp-2">{reward.title}</h3>
                <p className="text-sm text-text-secondary mb-6 flex-grow">{reward.description}</p>

                <Divider className="my-4 opacity-50" />

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-text-muted uppercase tracking-wider mb-1">Cost required</span>
                        <div className="flex items-center gap-1 font-bold text-accent">
                            <Coins className="w-4 h-4" />
                            {reward.cost.toLocaleString()}
                        </div>
                    </div>

                    {reward.status === 'available' && (
                        <Button variant={currentGold >= reward.cost ? 'primary' : 'secondary'} size="sm" className="whitespace-nowrap" disabled={currentGold < reward.cost}>
                            {currentGold >= reward.cost ? 'Claim' : 'Need more'}
                        </Button>
                    )}
                    {reward.status === 'locked' && (
                        <span className="text-xs font-semibold text-danger">Locked</span>
                    )}
                    {reward.status === 'earned' && (
                        <span className="text-xs font-semibold text-success">Claimed</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col gap-6 pt-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                            Rewards
                        </h1>
                        <p className="mt-3 text-lg text-text-secondary max-w-2xl leading-relaxed italic font-display text-2xl">
                            "The spoils of discipline. Trade your hard-earned gold for real-world indulgences without the guilt."
                        </p>
                    </div>
                    <div className="shrink-0">
                        <CurrencyDisplay amount={currentGold} className="h-12 px-5 text-lg shadow-[0_0_15px_rgba(207,170,99,0.15)]" />
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <Filter className="w-4 h-4 text-text-muted mr-2 shrink-0" />
                    {CATEGORIES.map(category => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setActiveCategory(category)}
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </section>

            <Divider />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Available & Locked */}
                <div className="flex flex-col gap-12 lg:col-span-8">

                    {/* Available Rewards */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-accent" />
                            <h2 className="font-display text-2xl font-semibold text-text-primary">Available to Claim</h2>
                        </div>
                        {availableRewards.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {availableRewards.map(renderRewardCard)}
                            </div>
                        ) : renderEmptyState("available")}
                    </section>

                    {/* Locked/Goal Rewards */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-text-muted" />
                            <h2 className="font-display text-2xl font-semibold text-text-primary">Milestones & Locked</h2>
                        </div>
                        {lockedRewards.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {lockedRewards.map(renderRewardCard)}
                            </div>
                        ) : renderEmptyState("locked")}
                    </section>
                </div>

                {/* Right Column - Earned */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                    <section className="flex flex-col gap-4 bg-surface-elevated/30 p-6 rounded-lg border border-border-default h-full">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-success" />
                                <h2 className="font-display text-2xl font-semibold text-text-primary">Earned</h2>
                            </div>
                            <Badge variant="success">{earnedRewards.length} total</Badge>
                        </div>

                        {earnedRewards.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {earnedRewards.map(reward => (
                                    <div key={reward.id} className="flex flex-col gap-2 p-3 rounded bg-surface border border-border-subtle">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm text-text-primary line-clamp-1">{reward.title}</span>
                                            <Badge variant="outline" className="text-[10px] py-0 px-1.5">{reward.rarity}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-text-secondary line-clamp-1 flex-1">{reward.description}</span>
                                            <span className="text-xs font-semibold text-text-muted shrink-0 ml-2">-{reward.cost}g</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                {renderEmptyState("earned")}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
