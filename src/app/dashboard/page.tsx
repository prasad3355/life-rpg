import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StreakIndicator } from "@/components/rpg/streak-indicator";
import { QuestStatus } from "@/components/rpg/quest-status";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border-default gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-display font-medium text-text-primary tracking-wide">
                        Command Center
                    </h1>
                    <p className="text-text-secondary font-sans text-sm mt-1">
                        Day 14 of your current run.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <StreakIndicator days={14} active />
                    <CurrencyDisplay amount={1450} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Quests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border-subtle rounded-md bg-surface-elevated gap-4 sm:gap-0">
                            <div>
                                <h4 className="font-sans font-medium text-text-primary text-base">Complete System Architecture</h4>
                                <p className="text-sm text-text-muted mt-1">Backend and Frontend foundations mapping.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <QuestStatus status="in-progress" />
                                <Button variant="secondary" size="sm">Resume</Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border-default rounded-md bg-transparent gap-4 sm:gap-0">
                            <div>
                                <h4 className="font-sans font-medium text-text-primary text-base">Physical Conditioning</h4>
                                <p className="text-sm text-text-muted mt-1">45 minutes of cardio.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <QuestStatus status="available" />
                                <Button variant="ghost" size="sm">Accept</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-accent/20 shadow-glow">
                    <CardHeader>
                        <CardTitle>Daily Bounty</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <span className="block font-display text-4xl text-accent mb-2">500 XP</span>
                            <span className="font-sans text-sm text-text-secondary block">
                                Available to earn today based on active quests.
                            </span>
                        </div>

                        <Button variant="primary" className="w-full">
                            View All Quests
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
