"use client";

import * as React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function SignupPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    return (
        <AuthLayout
            title="Create Character"
            subtitle="Establish your identity in the new reality."
        >
            <form className="space-y-5" onSubmit={handleSubmit}>

                <div className="space-y-2">
                    <Label htmlFor="username">Character Name</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        disabled={isLoading}
                        placeholder="Tav"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isLoading}
                        placeholder="hero@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Passphrase</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            disabled={isLoading}
                            className="pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none focus:text-text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Must contain at least 8 characters.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Passphrase</Label>
                    <Input
                        id="confirm-password"
                        name="confirm-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        placeholder="••••••••"
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full h-11 text-base shadow-glow group" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Forging Identity...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Forge Character
                            </>
                        )}
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm text-text-secondary font-sans border-t border-border-default pt-6">
                    Already a resident?{" "}
                    <Link href="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
                        Resume your session
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
