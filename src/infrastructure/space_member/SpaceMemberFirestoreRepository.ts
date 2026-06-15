import { collection, addDoc, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../firebase";
import type { SpaceMemberRepository } from "../../domain/space_member/SpaceMemberRepository";
import { SpaceMember } from "../../domain/space_member/SpaceMember";

const spaceMembersCollection = collection(db, "space_members");

export class SpaceMemberFirestoreRepository implements SpaceMemberRepository {
    async addSpaceMember(member: SpaceMember): Promise<void> {
        await addDoc(spaceMembersCollection, member.toPersistence());
    }

    async fetchSpaceMembersByUser(userId: string): Promise<SpaceMember[]> {
        const membersQuery = query(spaceMembersCollection, where("userId", "==", userId), limit(100));
        const snapshot = await getDocs(membersQuery);
        return snapshot.docs.map((doc) => SpaceMember.fromPersistence({ id: doc.id, ...doc.data() } as Record<string, unknown>));
    }

    async fetchSpaceMembersBySpace(spaceId: number): Promise<SpaceMember[]> {
        const membersQuery = query(spaceMembersCollection, where("spaceId", "==", spaceId), limit(100));
        const snapshot = await getDocs(membersQuery);
        return snapshot.docs.map((doc) => SpaceMember.fromPersistence({ id: doc.id, ...doc.data() } as Record<string, unknown>));
    }
}
