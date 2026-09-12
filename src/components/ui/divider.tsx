import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
        return (
            <hr
                ref={ref}
                role={decorative ? "presentation" : "separator"}
                aria-orientation={orientation === "horizontal" ? undefined : "vertical"}
                className={cn(
                    "shrink-0 bg-border-default",
                    orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                    className
                )}
                {...props}
            />
        );
    }
);
Divider.displayName = "Divider";

export { Divider };
