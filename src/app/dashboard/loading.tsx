import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
            <p className="font-display text-lg italic tracking-wide text-text-secondary">Consulting the archives...</p>
        </div>
    );
}
