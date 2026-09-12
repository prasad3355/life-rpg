import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
    return (
        <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background overflow-hidden">
            {/* Decorative RPG atmospheric element */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-20">
                <div className="h-[800px] w-[800px] rounded-full bg-accent/10 blur-[150px]" />
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="mb-6 inline-block">
                    <Button variant="ghost" size="sm" className="gap-2 text-text-secondary">
                        <ArrowLeft className="h-4 w-4" /> Back to Realm
                    </Button>
                </Link>
                <h2 className="mt-6 text-center text-4xl font-display font-medium tracking-wide text-text-primary">
                    {title}
                </h2>
                <p className="mt-2 text-center font-sans text-sm text-text-secondary">
                    {subtitle}
                </p>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-surface-elevated py-8 px-4 shadow-subtle border border-border-default rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
