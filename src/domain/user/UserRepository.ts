import { User } from "./User";

export interface UserRepository {
  addOrUpdateUser(user: User): Promise<void>;
  fetchUsers(): Promise<User[]>;
}
