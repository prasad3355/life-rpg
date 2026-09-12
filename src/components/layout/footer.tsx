import * as React from "react";
import Link from "next/link";
import { Divider } from "@/components/ui/divider";

export function Footer() {
    return (
        <footer className="bg-background pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Divider className="mb-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-display text-xl font-bold tracking-wider text-text-primary">
                            LIFE RPG
                        </span>
                        <span className="mt-1 font-sans text-xs text-text-muted">
                            © {new Date().getFullYear()} Life RPG. Level up reality.
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
