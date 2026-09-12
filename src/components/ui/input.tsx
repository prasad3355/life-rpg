import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary transition-colors",
                    "placeholder:text-text-muted",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-elevated",
                    error ? "border-danger focus-visible:ring-danger focus-visible:border-danger" : "border-border-default",
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
