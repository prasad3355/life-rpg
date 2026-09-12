import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number | string;
    icon?: LucideIcon;
}

const StatDisplay = React.forwardRef<HTMLDivElement, StatDisplayProps>(
    ({ className, label, value, icon: Icon, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg border border-border-default bg-surface p-4 shadow-subtle",
                    className
                )}
                {...props}
            >
                {Icon && <Icon className="mb-2 h-5 w-5 text-text-muted" aria-hidden="true" />}
                <span className="font-display text-2xl font-semibold text-text-primary">
                    {value}
                </span>
                <span className="font-sans text-xs font-medium uppercase tracking-wider text-text-secondary">
                    {label}
                </span>
            </div>
        );
    }
);
StatDisplay.displayName = "StatDisplay";

export { StatDisplay };
