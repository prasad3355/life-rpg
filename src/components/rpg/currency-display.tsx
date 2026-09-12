import * as React from "react";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

export interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
    amount: number;
    label?: string;
}

const CurrencyDisplay = React.forwardRef<HTMLDivElement, CurrencyDisplayProps>(
    ({ className, amount, label = "Gold", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-border-default bg-surface px-3 py-1.5",
                    className
                )}
                title={`${amount} ${label}`}
                {...props}
            >
                <Coins className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="font-sans text-sm font-semibold text-accent">
                    {amount.toLocaleString()}
                </span>
            </div>
        );
    }
);
CurrencyDisplay.displayName = "CurrencyDisplay";

export { CurrencyDisplay };
