import * as React from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export interface StreakIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    days: number;
    active?: boolean;
}

const StreakIndicator = React.forwardRef<HTMLDivElement, StreakIndicatorProps>(
    ({ className, days, active = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1",
                    active ? "bg-danger-muted border border-danger-muted" : "bg-surface border border-border-default",
                    className
                )}
                title={`${days} Day Streak`}
                {...props}
            >
                <Flame
                    className={cn(
                        "h-4 w-4",
                        active ? "text-danger fill-danger" : "text-text-muted"
                    )}
                    aria-hidden="true"
                />
                <span
                    className={cn(
                        "font-sans text-sm font-bold",
                        active ? "text-danger" : "text-text-muted"
                    )}
                >
                    {days}
                </span>
            </div>
        );
    }
);
StreakIndicator.displayName = "StreakIndicator";

export { StreakIndicator };
