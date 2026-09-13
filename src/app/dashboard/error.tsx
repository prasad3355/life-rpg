"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Just log it in presentation
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-6 p-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-muted border border-danger/30">
                <AlertTriangle className="h-10 w-10 text-danger" />
            </div>
            <div className="flex flex-col gap-2 max-w-md">
                <h2 className="font-display text-3xl font-bold text-text-primary">
                    A Temporal Rift Occurred
                </h2>
                <p className="text-text-secondary leading-relaxed">
                    The path forward is temporarily obscured. The servers might be recovering its mana or a glitch in the Matrix was detected.
                </p>
            </div>

            <Button onClick={reset} variant="primary" className="mt-4 gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>Attempt Recovery</span>
            </Button>
        </div>
    );
}
