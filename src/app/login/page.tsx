"use client";

import * as React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setHasError(false);

        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
            // Simulate an error for presentation
            setHasError(true);
        }, 1500);
    };

    return (
        <AuthLayout
            title="Resume Session"
            subtitle="Enter your credentials to return to the world."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                {hasError && (
                    <div className="rounded-md border border-danger bg-danger-muted p-3 text-sm text-danger">
                        Invalid credentials. The vault remains sealed.
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isLoading}
                        error={hasError}
                        placeholder="hero@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Passphrase</Label>
                        <Link href="#" className="font-sans text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                            Forgot your passphrase?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            disabled={isLoading}
                            error={hasError}
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
                </div>

                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember-me" name="remember-me" disabled={isLoading} />
                        <Label htmlFor="remember-me" className="text-text-secondary cursor-pointer">
                            Remember my presence
                        </Label>
                    </div>
                </div>

                <div>
                    <Button type="submit" variant="primary" className="w-full h-11 text-base shadow-glow" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validating...
                            </>
                        ) : (
                            "Enter Realm"
                        )}
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm text-text-secondary font-sans border-t border-border-default pt-6">
                    A new adventurer?{" "}
                    <Link href="/signup" className="font-medium text-accent hover:text-accent-hover transition-colors">
                        Create your character
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
