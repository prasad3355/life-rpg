import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-default/50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="font-display text-2xl font-bold tracking-wider text-text-primary">
                        LIFE RPG
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login" className="font-sans text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                            Login
                        </Link>
                        <Button variant="primary" size="sm">
                            Begin Your Journey
                        </Button>
                    </div>
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm">
                            Menu
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
