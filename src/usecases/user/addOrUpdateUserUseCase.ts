import type { UserRepository } from "../../domain/user/UserRepository";
import { User } from "../../domain/user/User";

export const addOrUpdateUserUseCase = async (
  repository: UserRepository,
  user: User
): Promise<void> => {
  await repository.addOrUpdateUser(user);
};
