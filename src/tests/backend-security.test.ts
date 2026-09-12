import { describe, it, expect } from "vitest";
import { signToken, verifyToken, hashPassword, comparePassword } from "@/lib/auth";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "@/lib/validations/auth";
import { createQuestSchema, updateQuestStatusSchema } from "@/lib/validations/quest";
import { purchaseRewardSchema, updateInventoryItemSchema } from "@/lib/validations/shop";
import { createAttributeSchema } from "@/lib/validations/attribute";
import { processXpGain, getLevelProgressPercent } from "@/lib/rpg";
import { apiError, unauthorizedError, forbiddenError, notFoundError, validationError } from "@/lib/api";

describe("Backend Security & Authorization Unit Tests", () => {
  describe("Authentication & Token Integrity", () => {
    it("should generate and verify a valid JWT token payload", () => {
      const payload = { userId: "user-123", username: "Hero", email: "hero@rpg.com" };
      const token = signToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe("user-123");
      expect(decoded?.username).toBe("Hero");
    });

    it("should return null when verifying an invalid or tampered JWT token", () => {
      const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
      const result = verifyToken(invalidToken);
      expect(result).toBeNull();
    });

    it("should securely hash and verify user passwords", async () => {
      const plainPassword = "superSecretPassword123";
      const hash = await hashPassword(plainPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(plainPassword);

      const isValid = await comparePassword(plainPassword, hash);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword("wrongPassword", hash);
      expect(isInvalid).toBe(false);
    });

    it("should validate changePassword schema correctly", () => {
      const validChange = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      };
      expect(changePasswordSchema.safeParse(validChange).success).toBe(true);

      const mismatchChange = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword123",
        confirmPassword: "differentPassword123",
      };
      expect(changePasswordSchema.safeParse(mismatchChange).success).toBe(false);
    });
  });

  describe("Validation & Security Schema Boundaries", () => {
    it("should reject updateProfile attempts containing client-controlled level/gold/xp", () => {
      const payloadWithExploit = {
        username: "LegitName",
        level: 999,
        gold: 999999,
        xp: 50000,
      };

      const parsed = updateProfileSchema.safeParse(payloadWithExploit);
      expect(parsed.success).toBe(true);
      // Ensure level, gold, and xp are stripped by Zod schema and NOT passed through
      if (parsed.success) {
        expect(parsed.data).toEqual({ username: "LegitName" });
        expect(parsed.data).not.toHaveProperty("level");
        expect(parsed.data).not.toHaveProperty("gold");
        expect(parsed.data).not.toHaveProperty("xp");
      }
    });

    it("should reject invalid registration input with malformed email or short password", () => {
      const invalidRegistration = {
        username: "H",
        email: "not-an-email",
        password: "123",
      };
      const parsed = registerSchema.safeParse(invalidRegistration);
      expect(parsed.success).toBe(false);
    });

    it("should reject invalid login credentials", () => {
      const invalidLogin = { email: "invalid", password: "" };
      const parsed = loginSchema.safeParse(invalidLogin);
      expect(parsed.success).toBe(false);
    });

    it("should enforce quest creation schema restrictions", () => {
      const invalidQuest = {
        title: "",
        difficulty: "UltraExtreme", // invalid enum
        xp: -100, // negative XP
      };
      const parsed = createQuestSchema.safeParse(invalidQuest);
      expect(parsed.success).toBe(false);
    });

    it("should validate quest status update choices strictly", () => {
      expect(updateQuestStatusSchema.safeParse({ status: "completed" }).success).toBe(true);
      expect(updateQuestStatusSchema.safeParse({ status: "in-progress" }).success).toBe(true);
      expect(updateQuestStatusSchema.safeParse({ status: "hacked_status" }).success).toBe(false);
    });

    it("should validate shop purchase reward ID presence", () => {
      expect(purchaseRewardSchema.safeParse({ rewardId: "rw-123" }).success).toBe(true);
      expect(purchaseRewardSchema.safeParse({ rewardId: "" }).success).toBe(false);
      expect(purchaseRewardSchema.safeParse({}).success).toBe(false);
    });

    it("should restrict inventory update schema properties", () => {
      const inventoryPayload = {
        isEquipped: true,
        userId: "hacker-user-id", // attempt to transfer ownership
        rewardId: "hacker-reward-id",
      };
      const parsed = updateInventoryItemSchema.safeParse(inventoryPayload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toEqual({ isEquipped: true });
        expect(parsed.data).not.toHaveProperty("userId");
        expect(parsed.data).not.toHaveProperty("rewardId");
      }
    });

    it("should validate createAttribute input schema", () => {
      expect(createAttributeSchema.safeParse({ name: "Stamina" }).success).toBe(true);
      expect(createAttributeSchema.safeParse({ name: "", value: -5 }).success).toBe(false);
    });
  });

  describe("API Standard Error Helpers", () => {
    it("should return correct status code and json payload for apiError", async () => {
      const res = apiError("Bad Request Test", 400);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ error: "Bad Request Test" });
    });

    it("should return correct status codes for HTTP exception helpers", async () => {
      expect(unauthorizedError().status).toBe(401);
      expect(forbiddenError().status).toBe(403);
      expect(notFoundError().status).toBe(404);
      expect(validationError({ field: ["required"] }).status).toBe(400);
    });
  });

  describe("RPG Level Calculation Helpers", () => {
    it("should accurately calculate level-up progression and XP rollover", () => {
      const result = processXpGain(800, 1, 1000, 500); // 800 + 500 = 1300 >= 1000
      expect(result.leveledUp).toBe(true);
      expect(result.level).toBe(2);
      expect(result.xp).toBe(300); // 1300 - 1000 = 300
      expect(result.xpToNextLevel).toBe(2000); // 1000 * 2
    });

    it("should compute accurate level progress percentage", () => {
      expect(getLevelProgressPercent(500, 1000)).toBe(50);
      expect(getLevelProgressPercent(1200, 1000)).toBe(100);
      expect(getLevelProgressPercent(0, 1000)).toBe(0);
    });
  });
});
