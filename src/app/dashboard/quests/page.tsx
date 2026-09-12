"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { QuestStatus, type QuestStatusOption } from "@/components/rpg/quest-status";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

// --- Types & Fixtures ---
type Quest = {
    id: string;
    title: string;
    description: string;
    category: string;
    xp: number;
    gold: number;
    difficulty: "Easy" | "Medium" | "Hard" | "Epic";
    status: QuestStatusOption;
};

const initialQuests: Quest[] = [
    { id: "1", title: "Complete System Architecture", description: "Finalize the frontend and backend structural mapping before deployment.", category: "Deep Work", xp: 500, gold: 100, difficulty: "Hard", status: "in-progress" },
    { id: "2", title: "Morning Conditioning", description: "45 minutes of cardiovascular training.", category: "Physical", xp: 150, gold: 25, difficulty: "Medium", status: "completed" },
    { id: "3", title: "Read 20 Pages", description: "Continue reading 'The Pragmatic Programmer'.", category: "Intellect", xp: 100, gold: 15, difficulty: "Easy", status: "available" },
    { id: "4", title: "Inbox Zero", description: "Process all pending emails and slack messages.", category: "Discipline", xp: 75, gold: 10, difficulty: "Easy", status: "available" },
    { id: "5", title: "Meditate for 15m", description: "Uninterrupted focus session to restore mental mana.", category: "Focus", xp: 120, gold: 20, difficulty: "Medium", status: "in-progress" },
    { id: "6", title: "Refactor Database Schema", description: "Migrate user preferences to the new JSONB structure.", category: "Deep Work", xp: 750, gold: 200, difficulty: "Epic", status: "failed" },
    { id: "7", title: "Drink 2L Water", description: "Stay hydrated throughout the development sprint.", category: "Vitality", xp: 50, gold: 5, difficulty: "Easy", status: "completed" },
    { id: "8", title: "Cook Dinner", description: "Prepare a healthy meal instead of ordering takeout.", category: "Physical", xp: 100, gold: 30, difficulty: "Medium", status: "available" },
];

export default function QuestsPage() {
    const [quests, setQuests] = React.useState<Quest[]>(initialQuests);
    const [filter, setFilter] = React.useState<QuestStatusOption | "all">("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [editingQuest, setEditingQuest] = React.useState<Quest | null>(null);
    const [deletingQuestId, setDeletingQuestId] = React.useState<string | null>(null);

    // Derived state
    const filteredQuests = quests.filter((q) => {
        const matchesFilter = filter === "all" || q.status === filter;
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Actions
    const handleComplete = (id: string) => updateQuestStatus(id, "completed");
    const handleBegin = (id: string) => updateQuestStatus(id, "in-progress");
    const handleFail = (id: string) => updateQuestStatus(id, "failed");

    const updateQuestStatus = (id: string, status: QuestStatusOption) => {
        setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    };

    const handleDelete = () => {
        if (deletingQuestId) {
            setQuests((prev) => prev.filter((q) => q.id !== deletingQuestId));
            setDeletingQuestId(null);
        }
    };

    const handleSaveQuest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newQuest: Quest = {
            id: editingQuest ? editingQuest.id : Math.random().toString(),
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            xp: Number(formData.get("xp")),
            gold: Number(formData.get("gold")),
            difficulty: formData.get("difficulty") as any,
            status: editingQuest ? editingQuest.status : "available",
        };

        if (editingQuest) {
            setQuests((prev) => prev.map((q) => (q.id === editingQuest.id ? newQuest : q)));
            setEditingQuest(null);
        } else {
            setQuests((prev) => [newQuest, ...prev]);
            setIsCreateOpen(false);
        }
    };

    const QuestForm = ({ defaultValues }: { defaultValues?: Quest }) => (
        <form onSubmit={handleSaveQuest} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Quest Title</Label>
                <Input id="title" name="title" defaultValue={defaultValues?.title} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={defaultValues?.description} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" defaultValue={defaultValues?.category || "General"} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        defaultValue={defaultValues?.difficulty || "Medium"}
                        className="flex h-10 w-full rounded-md border border-border-default bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Epic">Epic</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="xp">XP Reward</Label>
                    <Input id="xp" name="xp" type="number" defaultValue={defaultValues?.xp || 100} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gold">Gold Reward</Label>
                    <Input id="gold" name="gold" type="number" defaultValue={defaultValues?.gold || 10} required />
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border-default">
                <Button type="button" variant="ghost" onClick={() => { setIsCreateOpen(false); setEditingQuest(null); }}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    {defaultValues ? "Save Changes" : "Forge Quest"}
                </Button>
            </div>
        </form>
    );

    return (
        <div className="space-y-8 pb-12">
            {/* HEADER */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border-default pb-6">
                <div>
                    <h1 className="font-display text-4xl font-medium tracking-wide text-text-primary md:text-5xl">
                        Quest Log
                    </h1>
                    <p className="mt-2 font-sans text-text-secondary max-w-xl">
                        Track your real-world objectives, manage ongoing challenges, and claim your rewards.
                    </p>
                </div>
                <div className="shrink-0 flex gap-3">
                    <Button variant="primary" className="shadow-glow gap-2" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Quest
                    </Button>
                </div>
            </header>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex bg-surface-elevated rounded-md border border-border-default p-1 w-full sm:w-max">
                    {(["all", "available", "in-progress", "completed", "failed"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-1.5 rounded-sm text-sm font-sans font-medium transition-colors capitalize",
                                filter === f
                                    ? "bg-surface text-text-primary border border-border-subtle shadow-sm"
                                    : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            {f.replace("-", " ")}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                        placeholder="Search quests..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* QUEST LIST */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredQuests.length === 0 ? (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-border-default rounded-lg bg-surface/50">
                        <div className="h-12 w-12 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-text-muted" />
                        </div>
                        <h3 className="font-display text-2xl font-medium text-text-primary">No quests found</h3>
                        <p className="mt-2 text-text-secondary font-sans">
                            There are no quests matching your current filters.
                        </p>
                        {filter !== "all" && (
                            <Button variant="ghost" className="mt-4" onClick={() => setFilter("all")}>
                                View all quests
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredQuests.map((quest) => (
                        <Card
                            key={quest.id}
                            className={cn(
                                "flex flex-col overflow-hidden transition-all duration-300",
                                quest.status === "completed" && "opacity-50 border-border-default bg-background grayscale-[50%]",
                                quest.status === "failed" && "border-danger/30 bg-danger/5",
                                quest.status === "in-progress" && "border-accent/40 shadow-glow bg-surface-elevated"
                            )}
                        >
                            <div className="flex-1 p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant={quest.status === "completed" ? "success" : quest.status === "failed" ? "danger" : "default"}>
                                            {quest.category}
                                        </Badge>
                                        <Badge variant="outline">{quest.difficulty}</Badge>
                                        <QuestStatus status={quest.status} />
                                    </div>

                                    {/* Actions Dropdown Substitute (Horizontal layout for simplicity) */}
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingQuest(quest)} className="text-text-muted hover:text-accent transition-colors">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setDeletingQuestId(quest.id)} className="text-text-muted hover:text-danger transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={cn(
                                    "font-display text-2xl font-medium mb-2",
                                    quest.status === "completed" ? "line-through text-text-muted" : "text-text-primary",
                                    quest.status === "failed" ? "text-danger" : ""
                                )}>
                                    {quest.title}
                                </h3>
                                <p className="font-sans text-sm text-text-secondary pr-4 leading-relaxed line-clamp-2">
                                    {quest.description}
                                </p>
                            </div>

                            <div className="bg-surface-elevated border-t border-border-default p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider">Reward:</span>
                                        <span className="font-sans text-sm font-semibold text-accent">{quest.xp} XP</span>
                                    </div>
                                    <CurrencyDisplay amount={quest.gold} className="scale-90 origin-left border-transparent bg-transparent p-0" />
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    {quest.status === "available" && (
                                        <Button variant="secondary" size="sm" onClick={() => handleBegin(quest.id)} className="w-full sm:w-auto">
                                            Begin Quest
                                        </Button>
                                    )}
                                    {quest.status === "in-progress" && (
                                        <>
                                            <Button variant="ghost" size="sm" onClick={() => handleFail(quest.id)} className="text-danger flex-1 sm:flex-none">
                                                Abandon
                                            </Button>
                                            <Button variant="primary" size="sm" onClick={() => handleComplete(quest.id)} className="flex-1 sm:flex-none">
                                                Complete
                                            </Button>
                                        </>
                                    )}
                                    {quest.status === "failed" && (
                                        <Button variant="secondary" size="sm" onClick={() => handleBegin(quest.id)} className="w-full sm:w-auto">
                                            Try Again
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* CREATE MODAL */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Forge New Quest">
                <QuestForm />
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={!!editingQuest} onClose={() => setEditingQuest(null)} title="Edit Quest">
                {editingQuest && <QuestForm defaultValues={editingQuest} />}
            </Modal>

            {/* DELETE MODAL */}
            <Modal isOpen={!!deletingQuestId} onClose={() => setDeletingQuestId(null)} title="Abandon Quest forever?">
                <p className="text-text-secondary text-sm">
                    Are you sure you want to delete this quest? This action cannot be reversed and you will lose any progress.
                </p>
                <div className="mt-8 flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeletingQuestId(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete Quest</Button>
                </div>
            </Modal>

        </div>
    );
}
