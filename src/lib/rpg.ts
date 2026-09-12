export interface LevelStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  leveledUp: boolean;
  levelsGained: number;
}

/**
 * Calculates updated level, XP, and level-up metrics after gaining XP.
 */
export function processXpGain(
  currentXp: number,
  currentLevel: number,
  currentXpToNext: number,
  xpGained: number
): LevelStats {
  let xp = currentXp + xpGained;
  let level = currentLevel;
  let xpToNextLevel = currentXpToNext;
  let levelsGained = 0;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    levelsGained += 1;
    xpToNextLevel = 1000 * level;
  }

  return {
    level,
    xp,
    xpToNextLevel,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

/**
 * Returns level progress percentage (0 - 100)
 */
export function getLevelProgressPercent(xp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 100;
  return Math.min(Math.round((xp / xpToNextLevel) * 100), 100);
}
