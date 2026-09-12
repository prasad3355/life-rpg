import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-sans font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    {
                        // Primary: Gold accent style
                        "bg-accent text-background hover:bg-accent-hover shadow-glow":
                            variant === "primary",
                        // Secondary: Subtle surface with border
                        "bg-surface text-text-primary border border-border-default hover:bg-surface-elevated hover:border-accent":
                            variant === "secondary",
                        // Ghost: Transparent with hover
                        "text-text-secondary hover:text-text-primary hover:bg-surface":
                            variant === "ghost",
                        // Destructive: Subtle red
                        "bg-danger-muted text-danger border border-danger hover:bg-danger/20":
                            variant === "destructive",

                        // Sizes
                        "h-8 px-4 text-xs": size === "sm",
                        "h-10 px-6 text-sm": size === "md",
                        "h-12 px-8 text-base": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
