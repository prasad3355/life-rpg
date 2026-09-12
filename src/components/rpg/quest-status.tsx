import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export type QuestStatusOption = "available" | "in-progress" | "completed";

export interface QuestStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    status: QuestStatusOption;
}

const QuestStatus = React.forwardRef<HTMLDivElement, QuestStatusProps>(
    ({ className, status, ...props }, ref) => {
        const config = {
            "available": {
                icon: Circle,
                label: "Available",
                className: "border-border-default text-text-secondary bg-surface",
            },
            "in-progress": {
                icon: Clock,
                label: "In Progress",
                className: "border-accent text-accent bg-accent-muted",
            },
            "completed": {
                icon: CheckCircle2,
                label: "Completed",
                className: "border-success text-success bg-success-muted",
            },
        };

        const current = config[status];
        const Icon = current.icon;

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium font-sans transition-colors",
                    current.className,
                    className
                )}
                {...props}
            >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{current.label}</span>
            </div>
        );
    }
);
QuestStatus.displayName = "QuestStatus";

export { QuestStatus };
