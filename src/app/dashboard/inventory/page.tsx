"use client";

import React, { useState } from "react";
import { Backpack, Filter, Sword, Shield, Zap, Sparkles, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Modal } from "@/components/ui/modal";

const INITIAL_INVENTORY = [
    { id: 1, name: "Blade of Resolve", type: "Weapon", slot: "Primary", description: "Cuts through procrastination with a sharp edge. +3 Strength.", rarity: "rare", category: "equipment", equipped: true },
    { id: 2, name: "Mantle of Focus", type: "Armor", slot: "Armor", description: "Blocks distractions from entering your workspace. +4 Focus.", rarity: "epic", category: "equipment", equipped: true },
    { id: 3, name: "Amulet of Time", type: "Accessory", slot: "Accessory", description: "Grants extra efficiency. Time seems to slow down. +2 Intelligence.", rarity: "uncommon", category: "equipment", equipped: true },
    { id: 4, name: "Iron Broadsword", type: "Weapon", slot: "Primary", description: "A standard issue blade. Boosts strength attribute by 1.", rarity: "uncommon", category: "equipment", equipped: false },
    { id: 5, name: "Potion of Clarity", type: "Consumable", slot: "None", description: "Clears mental fog. Useful before complex tasks.", rarity: "uncommon", category: "consumables", equipped: false },
    { id: 6, name: "Takeout Dinner", type: "Reward", slot: "None", description: "Order your favorite takeout instead of cooking.", rarity: "common", category: "rewards", equipped: false },
    { id: 7, name: "New Book", type: "Reward", slot: "None", description: "Buy a new physical book for your collection.", rarity: "rare", category: "rewards", equipped: false },
];

const CATEGORIES = ["All", "Equipment", "Consumables", "Rewards"];

const SLOTS = ["Primary", "Armor", "Accessory"];

export default function InventoryPage() {
    const [items, setItems] = useState(INITIAL_INVENTORY);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredItems = items.filter(
        item => activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase()
    );

    // Sort so equipped items are first in the list
    const unequippedItems = filteredItems.filter(i => !i.equipped);
    const equippedItemsList = items.filter(i => i.equipped);

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const toggleEquip = () => {
        if (!selectedItem || selectedItem.category !== 'equipment') return;

        setItems(prev => {
            const newItems = [...prev];
            // If we are equipping this item, unequip whatever is currently in that slot
            if (!selectedItem.equipped) {
                const currentEquippedIndex = newItems.findIndex(i => i.equipped && i.slot === selectedItem.slot);
                if (currentEquippedIndex >= 0) {
                    newItems[currentEquippedIndex] = { ...newItems[currentEquippedIndex], equipped: false };
                }
            }

            // Toggle the selected item
            const itemIndex = newItems.findIndex(i => i.id === selectedItem.id);
            if (itemIndex >= 0) {
                newItems[itemIndex] = { ...newItems[itemIndex], equipped: !selectedItem.equipped };
            }

            // update local selection state as well for modal re-render
            setSelectedItem({ ...selectedItem, equipped: !selectedItem.equipped });

            return newItems;
        });

        // Modal stays open, state updates automatically visually
    };

    const consumeItem = () => {
        if (!selectedItem || (selectedItem.category !== 'consumables' && selectedItem.category !== 'rewards')) return;

        // Remove item from inventory
        setItems(prev => prev.filter(i => i.id !== selectedItem.id));
        setIsModalOpen(false);
    };

    const getIconForType = (type: string) => {
        if (type === "Weapon") return Sword;
        if (type === "Armor") return Shield;
        if (type === "Accessory") return Zap;
        if (type === "Consumable") return Sparkles;
        if (type === "Reward") return CheckCircle2;
        return Backpack;
    };

    const renderItemCard = (item: any) => {
        const Icon = getIconForType(item.type);

        return (
            <Card
                key={item.id}
                className={`bg-surface cursor-pointer transform transition-all duration-200 hover:-translate-y-1 ${item.equipped ? 'border-accent shadow-[0_0_10px_rgba(207,170,99,0.1)]' : 'hover:border-border-accent'}`}
                onClick={() => handleItemClick(item)}
            >
                <CardContent className="p-4 flex flex-col h-full gap-3 relative">
                    {item.equipped && (
                        <div className="absolute -top-3 -right-3 bg-accent text-background text-xs font-bold px-2 py-1 rounded-full shadow-glow z-10 border border-background">
                            Eqp
                        </div>
                    )}

                    <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${item.equipped ? 'bg-accent/10 border-accent/40' : 'bg-surface-elevated border-border-subtle'}`}>
                            <Icon className={`w-6 h-6 ${item.equipped ? 'text-accent' : 'text-text-muted'}`} />
                        </div>
                        <Badge variant={
                            item.rarity === 'legendary' ? 'default' :
                                item.rarity === 'epic' ? 'default' :
                                    item.rarity === 'rare' ? 'success' : 'outline'
                        } className={`capitalize ${item.rarity === 'epic' ? 'text-accent border-accent' : item.rarity === 'legendary' ? 'text-danger border-danger shadow-glow' : ''}`}>
                            {item.rarity}
                        </Badge>
                    </div>

                    <div className="mt-2">
                        <h3 className="font-display text-lg font-bold text-text-primary line-clamp-1">{item.name}</h3>
                        <span className="text-xs text-text-muted uppercase tracking-wider">{item.type}</span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderEmptyState = () => (
        <div className="col-span-full flex flex-col items-center justify-center p-12 border border-border-default border-dashed rounded-lg bg-surface/30 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
                <Backpack className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">Pockets are empty</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
                No items found in this section of your inventory. Complete quests or visit the merchant to acquire gear and consumables.
            </p>
        </div>
    );

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col gap-6 pt-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                            Inventory
                        </h1>
                        <p className="mt-3 text-lg text-text-secondary max-w-2xl leading-relaxed italic font-display text-2xl">
                            "The tools of discipline and the spoils of victory, gathered in one place."
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Capacity</span>
                            <span className="font-sans font-bold text-text-primary"><span className="text-accent">{items.length}</span> / 50</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <Filter className="w-4 h-4 text-text-muted mr-2 shrink-0" />
                    {CATEGORIES.map(category => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setActiveCategory(category)}
                            className="rounded-full shrink-0"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </section>

            <Divider />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Character Equipment Layout */}
                {activeCategory === "All" || activeCategory === "Equipment" ? (
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">Equipped</h2>
                        <Card className="bg-surface-elevated border-border-default h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-muted/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <CardContent className="p-6 flex flex-col gap-6 relative z-10">
                                {SLOTS.map(slot => {
                                    const equippedItem = equippedItemsList.find(i => i.slot === slot);

                                    return (
                                        <div key={slot} className="flex flex-col gap-2">
                                            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{slot} Slot</span>
                                            {equippedItem ? (
                                                <div
                                                    className="flex items-center justify-between p-3 rounded-lg border border-accent/40 bg-background shadow-[0_0_15px_rgba(207,170,99,0.08)] cursor-pointer hover:border-accent group transition-all"
                                                    onClick={() => handleItemClick(equippedItem)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-surface border border-accent/20 flex items-center justify-center shrink-0">
                                                            {React.createElement(getIconForType(equippedItem.type), { className: "w-5 h-5 text-accent" })}
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="font-semibold text-text-primary text-sm truncate">{equippedItem.name}</span>
                                                            <span className={`text-[10px] capitalize ${equippedItem.rarity === 'epic' ? 'text-accent' : 'text-text-secondary'}`}>{equippedItem.rarity}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-text-muted mr-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center p-3 rounded-lg border border-border-subtle bg-surface border-dashed">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className="w-10 h-10 rounded bg-background border border-border-subtle flex items-center justify-center shrink-0">
                                                            <span className="text-text-muted text-xs font-semibold">?</span>
                                                        </div>
                                                        <span className="text-sm text-text-secondary italic">Empty</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                ) : null}

                {/* Stash Grid Layout */}
                <div className={`flex flex-col gap-6 ${activeCategory === "All" || activeCategory === "Equipment" ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-2xl font-semibold text-text-primary">
                            {activeCategory === "All" || activeCategory === "Equipment" ? "Stash" : activeCategory}
                        </h2>
                        <span className="text-sm font-semibold text-text-secondary bg-surface-elevated px-3 py-1 rounded-full border border-border-subtle">
                            {unequippedItems.length} items
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {unequippedItems.map(item => renderItemCard(item))}
                        {unequippedItems.length === 0 && renderEmptyState()}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Item Details"
            >
                {selectedItem && (
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-5">
                            <div className={`p-4 rounded-lg bg-surface border flex items-center justify-center h-24 w-24 shrink-0 shadow-lg ${selectedItem.equipped ? 'border-accent shadow-[0_0_20px_rgba(207,170,99,0.15)]' : 'border-border-default'}`}>
                                {React.createElement(getIconForType(selectedItem.type), { className: `w-12 h-12 ${selectedItem.equipped ? 'text-accent' : 'text-text-primary'}` })}
                            </div>
                            <div className="flex flex-col justify-center gap-1.5 flex-1">
                                <h4 className="font-display font-bold text-2xl text-text-primary">{selectedItem.name}</h4>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="text-xs uppercase tracking-wider">{selectedItem.type}</Badge>
                                    <Badge variant={
                                        selectedItem.rarity === 'legendary' ? 'default' :
                                            selectedItem.rarity === 'epic' ? 'default' :
                                                selectedItem.rarity === 'rare' ? 'success' : 'default'
                                    } className={`capitalize ${selectedItem.rarity === 'epic' ? 'text-accent border-accent' : selectedItem.rarity === 'legendary' ? 'text-danger border-danger shadow-glow' : selectedItem.rarity === 'common' || selectedItem.rarity === 'uncommon' ? 'bg-surface-elevated text-text-secondary' : ''}`}>
                                        {selectedItem.rarity}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-background border border-border-default rounded-lg">
                            <h5 className="text-xs uppercase font-bold tracking-wider text-text-muted flex items-center gap-1"><Info className="w-3 h-3" /> Description</h5>
                            <p className="text-sm text-text-primary leading-relaxed">
                                {selectedItem.description}
                            </p>
                        </div>

                        {selectedItem.category === 'equipment' && (
                            <div className="flex justify-between items-center px-4 py-3 bg-surface-elevated border border-border-subtle rounded-lg">
                                <span className="text-sm font-semibold text-text-secondary">Bind Slot</span>
                                <span className="font-bold text-accent">{selectedItem.slot}</span>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-default">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>

                            {selectedItem.category === 'equipment' ? (
                                <Button
                                    variant={selectedItem.equipped ? "destructive" : "primary"}
                                    onClick={toggleEquip}
                                >
                                    {selectedItem.equipped ? "Unequip" : "Equip"}
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={consumeItem}>
                                    {selectedItem.category === 'rewards' ? 'Claim/Use' : 'Consume'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
