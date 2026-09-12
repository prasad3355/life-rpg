import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "danger" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-semibold transition-colors",
                {
                    "border-transparent bg-surface-elevated text-text-primary": variant === "default",
                    "border-transparent bg-success-muted text-success": variant === "success",
                    "border-transparent bg-danger-muted text-danger": variant === "danger",
                    "border-border-default text-text-secondary": variant === "outline",
                },
                className
            )}
            {...props}
        />
    );
}

export { Badge };
