import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { InMemoryCategoriesRepository } from "../repositories/in-memory/in-memory-categories-repository";
import { UpdateUserPreferencesUseCase } from "./update_user_preferences";
import { User } from "../entities/user_entity";
import bcrypt from "bcryptjs";

describe("Update User Preferences Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let categoriesRepository: InMemoryCategoriesRepository;
  let updateUserPreferencesUseCase: UpdateUserPreferencesUseCase;
  let testUser: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    updateUserPreferencesUseCase = new UpdateUserPreferencesUseCase(usersRepository, categoriesRepository);

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: hashedPassword,
    });
  });

  it("should update user preferences with valid category IDs", async () => {
    // Execute use case
    const result = await updateUserPreferencesUseCase.execute({
      userId: testUser.id,
      categoryIds: [1, 2, 3]
    });

    expect(result.success).toBe(true);

    // Verify preferences were updated
    const preferences = await usersRepository.getUserPreferences(testUser.id);
    expect(preferences).toHaveLength(3);
    expect(preferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Business" }),
        expect.objectContaining({ name: "Sports" }),
        expect.objectContaining({ name: "Technology" })
      ])
    );
  });

  it("should update preferences replacing previous ones", async () => {
    // Set initial preferences
    await usersRepository.updateUserPreferences(testUser.id, [1, 2]);

    // Update with new preferences
    const result = await updateUserPreferencesUseCase.execute({
      userId: testUser.id,
      categoryIds: [3, 4]
    });

    expect(result.success).toBe(true);

    // Verify preferences were replaced
    const preferences = await usersRepository.getUserPreferences(testUser.id);
    expect(preferences).toHaveLength(2);
    expect(preferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Business" }),
        expect.objectContaining({ name: "Entertainment" })
      ])
    );
    expect(preferences).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Technology" }),
        expect.objectContaining({ name: "Sports" })
      ])
    );
  });

  it("should clear preferences when empty array is provided", async () => {
    // Set initial preferences
    await usersRepository.updateUserPreferences(testUser.id, [1, 2]);

    // Clear preferences
    const result = await updateUserPreferencesUseCase.execute({
      userId: testUser.id,
      categoryIds: []
    });

    expect(result.success).toBe(true);

    // Verify preferences were cleared
    const preferences = await usersRepository.getUserPreferences(testUser.id);
    expect(preferences).toHaveLength(0);
  });

  it("should throw error when user does not exist", async () => {
    // Execute use case with non-existent user ID
    await expect(
      updateUserPreferencesUseCase.execute({
        userId: "non-existent-id",
        categoryIds: [1, 2]
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw error when category does not exist", async () => {
    // Execute use case with invalid category ID
    await expect(
      updateUserPreferencesUseCase.execute({
        userId: testUser.id,
        categoryIds: [999]
      })
    ).rejects.toThrow("Invalid category IDs: 999");
  });
});