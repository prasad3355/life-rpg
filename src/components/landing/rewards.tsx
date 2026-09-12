"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { Button } from "@/components/ui/button";
import { Gift, Coffee, Gamepad2, Ticket } from "lucide-react";

const rewards = [
    {
        title: "Premium Coffee",
        description: "Purchase one artisan latte guilt-free.",
        cost: 50,
        icon: Coffee,
    },
    {
        title: "Gaming Session",
        description: "2 hours of uninterrupted gaming time.",
        cost: 150,
        icon: Gamepad2,
    },
    {
        title: "Movie Night",
        description: "Rent a new release movie for the weekend.",
        cost: 300,
        icon: Ticket,
    },
];

export function RewardsSection() {
    return (
        <section className="bg-surface py-24 border-t border-border-default">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-accent">
                        <Gift className="h-8 w-8" />
                    </div>
                    <h2 className="font-display text-4xl font-semibold tracking-wide text-text-primary">
                        The Spoils of Victory
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-text-secondary">
                        Accumulate gold from completing real-world tasks and spend it on custom rewards. You establish the economy. You earn the payout.
                    </p>
                </motion.div>

                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {rewards.map((reward, i) => (
                        <motion.div
                            key={reward.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <Card className="flex h-full flex-col items-center p-6 text-center hover:border-accent/30 transition-colors">
                                <div className="mb-4 rounded-full border border-border-subtle bg-surface-elevated p-4 text-text-primary">
                                    <reward.icon className="h-6 w-6" />
                                </div>
                                <h4 className="font-display text-xl font-medium text-text-primary">{reward.title}</h4>
                                <p className="mt-2 flex-grow font-sans text-sm text-text-muted">{reward.description}</p>
                                <div className="mt-6 flex w-full flex-col gap-3">
                                    <CurrencyDisplay amount={reward.cost} className="w-full justify-center" />
                                    <Button variant="secondary" size="sm" className="w-full">Purchase</Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
