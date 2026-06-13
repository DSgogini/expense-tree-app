import type { UserRepository } from "../../domain/user/UserRepository";
import { User } from "../../domain/user/User";

export const fetchUsersUseCase = async (
  repository: UserRepository
): Promise<User[]> => {
  return repository.fetchUsers();
};
