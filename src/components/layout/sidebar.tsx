"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Swords,
    User,
    Flame,
    Gift,
    Backpack,
    Settings,
    LogOut
} from "lucide-react";
import { ProgressBar } from "@/components/rpg/progress-bar";
import { Divider } from "@/components/ui/divider";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quests", href: "/dashboard/quests", icon: Swords },
    { name: "Character", href: "/dashboard/character", icon: User },
    { name: "Streaks", href: "/dashboard/streaks", icon: Flame },
    { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
    { name: "Inventory", href: "/dashboard/inventory", icon: Backpack },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r border-border-default bg-surface md:flex h-screen sticky top-0">
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/dashboard" className="font-display text-xl font-bold tracking-wider text-text-primary">
                    LIFE RPG
                </Link>
            </div>

            <div className="relative z-10 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated font-display font-medium text-accent">
                        12
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h3 className="truncate font-display text-lg font-medium text-text-primary">Tav the Developer</h3>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="flex justify-between font-sans text-xs font-medium text-text-primary mb-1.5">
                        <span>XP</span>
                        <span className="text-text-muted">4,250 / 5k</span>
                    </div>
                    <ProgressBar value={4250} max={5000} variant="xp" className="h-1.5" />
                </div>
            </div>

            <Divider className="opacity-50" />

            <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-sans font-medium transition-colors",
                                isActive
                                    ? "bg-surface-elevated text-text-primary border border-border-subtle"
                                    : "text-text-secondary hover:bg-surface-elevated/50 hover:text-text-primary border border-transparent"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="shrink-0 p-4">
                <Divider className="mb-4 opacity-50" />
                <Link
                    href="#settings"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-sans font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors border border-transparent"
                >
                    <Settings className="mr-3 h-5 w-5 shrink-0 text-text-muted group-hover:text-text-secondary" />
                    Settings
                </Link>
                <Link
                    href="/login"
                    className="group mt-1 flex items-center rounded-md px-3 py-2 text-sm font-sans font-medium text-danger hover:bg-danger-muted/50 transition-colors border border-transparent"
                >
                    <LogOut className="mr-3 h-5 w-5 shrink-0 text-danger/80 group-hover:text-danger" />
                    Abandon Run
                </Link>
            </div>
        </aside>
    );
}
