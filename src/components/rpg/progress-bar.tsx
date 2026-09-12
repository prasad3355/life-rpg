import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: "default" | "xp" | "health";
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, max = 100, variant = "default", ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-elevated", className)}
                {...props}
            >
                <div
                    className={cn(
                        "h-full w-full flex-1 transition-all duration-500 ease-out",
                        {
                            "bg-accent shadow-[0_0_8px_rgba(207,170,99,0.5)]": variant === "default",
                            "bg-accent shadow-glow": variant === "xp",
                            "bg-danger shadow-[0_0_8px_rgba(201,107,99,0.5)]": variant === "health",
                        }
                    )}
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        );
    }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
