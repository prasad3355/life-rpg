"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: "default" | "xp" | "health";
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, max = 100, variant = "default", ...props }, ref) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-elevated border border-border-subtle", className)}
                {...props}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full transition-colors",
                        {
                            "bg-primary": variant === "default",
                            "bg-accent shadow-glow": variant === "xp",
                            "bg-danger": variant === "health",
                        }
                    )}
                />
            </div>
        );
    }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
