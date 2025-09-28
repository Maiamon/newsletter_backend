import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { GetUserPreferencesUseCase } from "./get_user_preferences";
import { User } from "../entities/user_entity";
import bcrypt from "bcryptjs";

describe("Get User Preferences Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let getUserPreferencesUseCase: GetUserPreferencesUseCase;
  let testUser: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    getUserPreferencesUseCase = new GetUserPreferencesUseCase(usersRepository);

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: hashedPassword,
    });
  });

  it("should return user preferences when user has preferences", async () => {
    // Set user preferences
    await usersRepository.updateUserPreferences(testUser.id, [1, 2]);

    // Execute use case
    const result = await getUserPreferencesUseCase.execute(testUser.id);

    // Verify result
    expect(result.preferences).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.preferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Sports" }),
        expect.objectContaining({ name: "Technology" })
      ])
    );
  });

  it("should return empty array when user has no preferences", async () => {
    // Execute use case
    const result = await getUserPreferencesUseCase.execute(testUser.id);

    // Verify result
    expect(result.preferences).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.preferences).toEqual([]);
  });

  it("should return empty array when user does not exist", async () => {
    // Execute use case with non-existent user ID
    const result = await getUserPreferencesUseCase.execute("non-existent-id");

    // Verify result
    expect(result.preferences).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.preferences).toEqual([]);
  });

  it("should return only valid categories when user has preferences", async () => {
    // Set user preferences with a mix of valid and invalid category IDs
    await usersRepository.updateUserPreferences(testUser.id, [1, 999, 2]); // 999 doesn't exist

    // Execute use case
    const result = await getUserPreferencesUseCase.execute(testUser.id);

    // Verify result - should only include valid categories
    expect(result.preferences).toHaveLength(2);
    expect(result.preferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Sports" }),
        expect.objectContaining({ name: "Technology" })
      ])
    );
    expect(result.preferences).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 999 })
      ])
    );
  });
});