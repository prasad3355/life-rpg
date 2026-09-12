import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-accent text-background hover:bg-accent-hover shadow-[0_0_15px_rgba(207,170,99,0.15)]":
                            variant === "primary",
                        "bg-surface text-foreground border border-border-subtle hover:bg-surface-hover hover:border-border-accent":
                            variant === "secondary",
                        "text-secondary hover:text-foreground hover:bg-surface-hover":
                            variant === "ghost",
                        "bg-error/20 text-error-fg border border-error hover:bg-error/30":
                            variant === "danger",
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
