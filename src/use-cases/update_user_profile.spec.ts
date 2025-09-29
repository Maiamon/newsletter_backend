import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UpdateUserProfileUseCase } from "./update_user_profile";
import { User } from "../entities/user_entity";
import bcrypt from "bcryptjs";

describe("Update User Profile Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let testUser: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    updateUserProfileUseCase = new UpdateUserProfileUseCase(usersRepository);

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await usersRepository.create({
      name: "Old Name",
      email: "test@example.com",
      password_hash: hashedPassword,
    });
  });

  it("should update user name successfully", async () => {
    // Execute use case
    const result = await updateUserProfileUseCase.execute({
      userId: testUser.id,
      name: "New Name"
    });

    // Assert
    expect(result).toEqual({
      success: true,
      user: {
        id: testUser.id,
        name: "New Name",
        email: "test@example.com",
        createdAt: expect.any(Date)
      }
    });

    // Verify user was actually updated
    const updatedUser = await usersRepository.findById(testUser.id);
    expect(updatedUser?.name).toBe("New Name");
  });

  it("should trim whitespace from name", async () => {
    // Execute use case with name containing whitespace
    const result = await updateUserProfileUseCase.execute({
      userId: testUser.id,
      name: "  Trimmed Name  "
    });

    // Assert
    expect(result.user.name).toBe("Trimmed Name");

    // Verify user was actually updated with trimmed name
    const updatedUser = await usersRepository.findById(testUser.id);
    expect(updatedUser?.name).toBe("Trimmed Name");
  });

  it("should throw error when user does not exist", async () => {
    // Execute use case with non-existent user
    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: "non-existent-id",
        name: "New Name"
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw error when name is empty", async () => {
    // Execute use case with empty name
    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: testUser.id,
        name: ""
      })
    ).rejects.toThrow("Name cannot be empty");
  });

  it("should throw error when name is only whitespace", async () => {
    // Execute use case with whitespace-only name
    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: testUser.id,
        name: "   "
      })
    ).rejects.toThrow("Name cannot be empty");
  });
});