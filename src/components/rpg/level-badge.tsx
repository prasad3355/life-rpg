import * as React from "react";
import { cn } from "@/lib/utils";

export interface LevelBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    level: number;
}

const LevelBadge = React.forwardRef<HTMLDivElement, LevelBadgeProps>(
    ({ className, level, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent bg-surface shadow-glow",
                    className
                )}
                title={`Level ${level}`}
                {...props}
            >
                <span className="font-display text-lg font-bold text-accent">{level}</span>
            </div>
        );
    }
);
LevelBadge.displayName = "LevelBadge";

export { LevelBadge };
