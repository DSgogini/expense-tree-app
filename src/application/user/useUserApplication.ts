import { useCallback, useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { User } from "../../domain/user/User";
import type { UserRepository } from "../../domain/user/UserRepository";
import { UserFirestoreRepository } from "../../infrastructure/user/UserFirestoreRepository";
import { addOrUpdateUserUseCase } from "../../usecases/user/addOrUpdateUserUseCase";
import { fetchUsersUseCase } from "../../usecases/user/fetchUsersUseCase";

const userRepository: UserRepository = new UserFirestoreRepository();

export const useUserApplication = (authUser: FirebaseUser | null) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");

  const loadUsers = useCallback(async () => {
    setUserError("");
    setLoadingUsers(true);

    try {
      const docs = await fetchUsersUseCase(userRepository);
      setUsers(docs);
    } catch (err) {
      console.error("Error loading users:", err);
      setUserError("Unable to load users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const ensureUserRecord = useCallback(async () => {
    if (!authUser?.uid) {
      return;
    }

    try {
      const user = User.createNew({
        id: authUser.uid,
        displayName: authUser.displayName ?? authUser.email ?? authUser.uid,
        email: authUser.email ?? "",
      });

      await addOrUpdateUserUseCase(userRepository, user);
      await loadUsers();
    } catch (err) {
      console.error("Error ensuring user record:", err);
      setUserError("Unable to synchronize user profile.");
    }
  }, [authUser, loadUsers]);

  useEffect(() => {
    void ensureUserRecord();
  }, [ensureUserRecord]);

  return {
    users,
    loadingUsers,
    userError,
    loadUsers,
  };
};
