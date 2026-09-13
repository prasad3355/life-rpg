"use client";

import React, { useState } from "react";
import { Coins, Filter, ShoppingCart, Sword, Shield, Zap, Sparkles, Check, Star } from "lucide-react";
import { CurrencyDisplay } from "@/components/rpg/currency-display";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Modal } from "@/components/ui/modal";

const SHOP_ITEMS = [
    { id: 1, name: "Amulet of Focus", type: "Accessory", description: "Increases focus attribute by 2 during deep work sessions.", price: 2000, rarity: "rare", category: "equipment", lvlReq: 5, owned: false },
    { id: 2, name: "Elixir of Wakefulness", type: "Consumable", description: "Grants a temporary boost to morning routine XP.", price: 150, rarity: "common", category: "consumables", lvlReq: 1, owned: false },
    { id: 3, name: "Mantle of Discipline", type: "Armor", description: "Protects against one missed daily habit without breaking your streak.", price: 5000, rarity: "epic", category: "equipment", lvlReq: 10, owned: true },
    { id: 4, name: "Iron Broadsword", type: "Weapon", description: "A standard issue blade. Boosts strength attribute by 1.", price: 800, rarity: "uncommon", category: "equipment", lvlReq: 3, owned: false },
    { id: 5, name: "Potion of Clarity", type: "Consumable", description: "Clears mental fog. Useful before complex tasks.", price: 300, rarity: "uncommon", category: "consumables", lvlReq: 2, owned: false },
    { id: 6, name: "Crown of the Conqueror", type: "Armor", description: "A legendary artifact that doubles all gold earned from Boss Quests.", price: 15000, rarity: "legendary", category: "equipment", lvlReq: 20, owned: false },
];

const CATEGORIES = ["All", "Equipment", "Consumables"];

export default function ShopPage() {
    const [gold, setGold] = useState(2450);
    const [items, setItems] = useState(SHOP_ITEMS);
    const [activeCategory, setActiveCategory] = useState("All");

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const playerLevel = 12;

    const filteredItems = items.filter(
        item => activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase()
    );

    const featuredItem = items.find(i => i.id === 1);
    const regularItems = filteredItems.filter(i => i.id !== featuredItem?.id);

    const handlePurchaseClick = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const confirmPurchase = () => {
        if (!selectedItem || gold < selectedItem.price) return;

        setGold(prev => prev - selectedItem.price);
        setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, owned: true } : i));
        setIsModalOpen(false);
    };

    const getIconForType = (type: string) => {
        if (type === "Weapon") return Sword;
        if (type === "Armor") return Shield;
        if (type === "Consumable") return Sparkles;
        return Zap;
    };

    const renderItemCard = (item: any, featured: boolean = false) => {
        const Icon = getIconForType(item.type);
        const isLevelLocked = playerLevel < item.lvlReq;
        const canAfford = gold >= item.price;
        const disabled = item.owned || isLevelLocked;

        return (
            <Card key={item.id} className={`bg-surface transition-all overflow-hidden flex flex-col ${featured ? 'border-accent shadow-[0_0_20px_rgba(207,170,99,0.1)]' : 'hover:border-border-accent'}`}>
                {featured && (
                    <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Featured Item</span>
                        <Star className="w-4 h-4 text-accent fill-accent" />
                    </div>
                )}
                <CardContent className="p-5 flex flex-col h-full gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-md bg-surface-elevated border border-border-default ${featured ? 'border-accent/30' : ''}`}>
                                <Icon className={`w-6 h-6 ${featured ? 'text-accent' : 'text-text-secondary'}`} />
                            </div>
                            <div>
                                <h3 className="font-display text-lg font-bold text-text-primary line-clamp-1">{item.name}</h3>
                                <span className="text-xs text-text-muted">{item.type}</span>
                            </div>
                        </div>
                        <Badge variant={
                            item.rarity === 'legendary' ? 'default' :
                                item.rarity === 'epic' ? 'default' :
                                    item.rarity === 'rare' ? 'success' : 'outline'
                        } className={`capitalize ${item.rarity === 'epic' ? 'text-accent border-accent' : item.rarity === 'legendary' ? 'text-danger border-danger shadow-glow' : ''}`}>
                            {item.rarity}
                        </Badge>
                    </div>

                    <p className={`text-sm flex-grow ${featured ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {item.description}
                    </p>

                    <Divider className="opacity-50" />

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col gap-1">
                            {item.owned ? (
                                <span className="text-sm font-bold text-success flex items-center gap-1"><Check className="w-4 h-4" /> Owned</span>
                            ) : (
                                <div className={`flex items-center gap-1 font-bold ${canAfford ? 'text-accent' : 'text-danger'}`}>
                                    <Coins className="w-4 h-4" />
                                    {item.price.toLocaleString()}
                                </div>
                            )}
                            {isLevelLocked && !item.owned && (
                                <span className="text-xs text-danger">Requires Lvl {item.lvlReq}</span>
                            )}
                        </div>

                        <Button
                            variant={item.owned ? 'ghost' : canAfford && !isLevelLocked ? 'primary' : 'secondary'}
                            size="sm"
                            disabled={disabled}
                            onClick={() => handlePurchaseClick(item)}
                        >
                            {item.owned ? 'Purchased' : isLevelLocked ? 'Locked' : 'Purchase'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col gap-6 pt-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                            Merchant
                        </h1>
                        <p className="mt-3 text-lg text-text-secondary max-w-2xl leading-relaxed italic font-display text-2xl">
                            "Looking for an edge? I've got artifacts that will bend time, clear the mind, and protect your resolve."
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Your Wealth</span>
                        </div>
                        <CurrencyDisplay amount={gold} className="h-12 px-5 text-lg shadow-[0_0_15px_rgba(207,170,99,0.15)] bg-surface-elevated" />
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
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </section>

            <Divider />

            {featuredItem && activeCategory === "All" && (
                <section className="flex flex-col gap-4">
                    <h2 className="font-display text-2xl font-semibold text-text-primary">Featured Artifact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderItemCard(featuredItem, true)}
                    </div>
                </section>
            )}

            <section className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-semibold text-text-primary">Inventory List</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularItems.map(item => renderItemCard(item))}
                    {regularItems.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-border-default border-dashed rounded-lg bg-surface/50">
                            <ShoppingCart className="w-10 h-10 text-text-muted mx-auto mb-3" />
                            <p className="font-display text-lg text-text-secondary">No items match this category.</p>
                        </div>
                    )}
                </div>
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Purchase"
            >
                {selectedItem && (
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-4 p-4 rounded-lg bg-surface-elevated border border-border-default">
                            <div className="p-4 rounded-lg bg-surface border border-border-subtle flex items-center justify-center h-20 w-20 shrink-0">
                                {React.createElement(getIconForType(selectedItem.type), { className: "w-8 h-8 text-accent" })}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-display font-bold text-xl text-text-primary">{selectedItem.name}</h4>
                                <span className="text-sm text-text-secondary">{selectedItem.type} &bull; <span className="capitalize text-accent">{selectedItem.rarity}</span></span>
                            </div>
                        </div>

                        <p className="text-sm text-text-secondary">
                            Are you sure you want to purchase <strong>{selectedItem.name}</strong>? This item will be permanently added to your inventory.
                        </p>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border-default">
                            <span className="text-sm font-semibold text-text-primary">Total Cost:</span>
                            <div className={`flex items-center gap-2 font-bold text-lg ${gold >= selectedItem.price ? 'text-accent' : 'text-danger'}`}>
                                <Coins className="w-5 h-5" />
                                {selectedItem.price.toLocaleString()} gold
                            </div>
                        </div>

                        {gold < selectedItem.price && (
                            <div className="text-xs text-danger text-center bg-danger-muted p-2 rounded-md border border-danger/30">
                                You do not have enough gold for this transaction. (Short {(selectedItem.price - gold).toLocaleString()}g)
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-2">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                onClick={confirmPurchase}
                                disabled={gold < selectedItem.price}
                            >
                                Purchase Item
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
