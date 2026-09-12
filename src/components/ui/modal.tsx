"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-10 px-4 pb-20 sm:block sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/90 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            {/* Modal Panel */}
            <div
                className={cn(
                    "inline-block transform overflow-hidden rounded-lg border border-border-default bg-surface text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle",
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
            >
                <div className="border-b border-border-default px-6 py-4 flex items-start justify-between">
                    <div>
                        <h3 className="font-display text-2xl font-semibold leading-6 text-text-primary" id="modal-headline">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-2 font-sans text-sm text-text-secondary">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-elevated hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                <div className="px-6 py-4 font-sans max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
