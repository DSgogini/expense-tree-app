import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { UserRepository } from "../../domain/user/UserRepository";
import { User } from "../../domain/user/User";

const usersCollection = collection(db, "users");

export class UserFirestoreRepository implements UserRepository {
  async addOrUpdateUser(user: User): Promise<void> {
    const userDoc = doc(usersCollection, user.id);
    await setDoc(userDoc, user.toPersistence(), { merge: true });
  }

  async fetchUsers(): Promise<User[]> {
    const usersQuery = query(usersCollection, orderBy("displayName", "asc"));
    const snapshot = await getDocs(usersQuery);

    return snapshot.docs.map((doc) => User.fromPersistence({ id: doc.id, ...doc.data() }));
  }
}
