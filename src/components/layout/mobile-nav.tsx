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
    Menu,
    X,
    LogOut,
    Settings,
    Coins
} from "lucide-react";
import { ProgressBar } from "@/components/rpg/progress-bar";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quests", href: "/dashboard/quests", icon: Swords },
    { name: "Character", href: "/dashboard/character", icon: User },
    { name: "Streaks", href: "/dashboard/streaks", icon: Flame },
    { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
    { name: "Shop", href: "/dashboard/shop", icon: Coins },
    { name: "Inventory", href: "/dashboard/inventory", icon: Backpack },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    // Close menu when pathname changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <div className="flex h-16 items-center justify-between border-b border-border-default bg-surface px-4 md:hidden sticky top-0 z-40">
                <Link href="/dashboard" className="font-display text-lg font-bold tracking-wider text-text-primary">
                    LIFE RPG
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-surface pt-5 pb-4 h-full border-r border-border-default">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <X className="h-6 w-6 text-background" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated font-display font-medium text-accent">
                                    12
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="truncate font-display text-lg font-medium text-text-primary">Tav the Developer</h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between font-sans text-xs font-medium text-text-primary mb-1.5">
                                    <span>Experience Points</span>
                                    <span className="text-text-muted">4,250 / 5,000 XP</span>
                                </div>
                                <ProgressBar value={4250} max={5000} variant="xp" className="h-2" />
                            </div>
                        </div>

                        <nav className="mt-5 flex-1 space-y-1 px-4 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center rounded-md px-3 py-3 text-base font-sans font-medium transition-colors",
                                            isActive
                                                ? "bg-surface-elevated text-text-primary border border-border-subtle"
                                                : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary border border-transparent"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "mr-4 h-6 w-6 shrink-0 transition-colors",
                                                isActive ? "text-accent" : "text-text-muted"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-auto px-4 py-4 border-t border-border-default space-y-1">
                            <Link
                                href="#settings"
                                className="group flex items-center rounded-md px-3 py-3 text-base font-sans font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors border border-transparent"
                            >
                                <Settings className="mr-4 h-6 w-6 shrink-0 text-text-muted" />
                                Settings
                            </Link>
                            <Link
                                href="/login"
                                className="group flex items-center rounded-md px-3 py-3 text-base font-sans font-medium text-danger hover:bg-danger-muted/50 transition-colors border border-transparent"
                            >
                                <LogOut className="mr-4 h-6 w-6 shrink-0 text-danger/80" />
                                Abandon Run
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
