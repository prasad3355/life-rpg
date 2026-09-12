import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-background">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 flex flex-col md:ml-0 overflow-y-auto w-full min-w-0 h-screen">
                <div className="flex-1 py-8 px-4 sm:px-6 md:px-8 mx-auto w-full max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
