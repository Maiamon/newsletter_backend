import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get_user_profile";
import { User } from "../entities/user_entity";
import bcrypt from "bcryptjs";

describe("Get User Profile Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let getUserProfileUseCase: GetUserProfileUseCase;
  let testUser: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: hashedPassword,
    });
  });

  it("should return user profile with preferences when user exists", async () => {
    // Set user preferences
    await usersRepository.updateUserPreferences(testUser.id, [1, 2, 3]);

    // Execute use case
    const result = await getUserProfileUseCase.execute(testUser.id);

    // Assert
    expect(result.user).toEqual({
      id: testUser.id,
      name: "Test User",
      email: "test@example.com",
      createdAt: expect.any(Date)
    });
    
    expect(result.preferences).toHaveLength(3);
    expect(result.preferences).toEqual(
      expect.arrayContaining([
        { id: 1, name: "Technology" },
        { id: 2, name: "Sports" },
        { id: 3, name: "Politics" }
      ])
    );
  });

  it("should return user profile with empty preferences when user has no preferences", async () => {
    // Execute use case without setting preferences
    const result = await getUserProfileUseCase.execute(testUser.id);

    // Assert
    expect(result).toEqual({
      user: {
        id: testUser.id,
        name: "Test User",
        email: "test@example.com",
        createdAt: expect.any(Date)
      },
      preferences: []
    });
  });

  it("should throw error when user does not exist", async () => {
    // Execute use case with non-existent user
    await expect(() =>
      getUserProfileUseCase.execute("non-existent-id")
    ).rejects.toThrow("User not found");
  });
});