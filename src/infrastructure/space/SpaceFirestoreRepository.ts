import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import type { SpaceRepository } from "../../domain/space/SpaceRepository";
import { Space } from "../../domain/space/Space";

const spacesCollection = collection(db, "spaces");

export class SpaceFirestoreRepository implements SpaceRepository {
    async addSpace(space: Space): Promise<void> {
        const spaceDoc = doc(spacesCollection, String(space.id));
        await setDoc(spaceDoc, space.toPersistence());
    }

    async fetchSpacesByIds(spaceIds: number[]): Promise<Space[]> {
        if (spaceIds.length === 0) {
            return [];
        }

        const batches: Promise<unknown>[] = [];
        for (let i = 0; i < spaceIds.length; i += 10) {
            const batch = spaceIds.slice(i, i + 10);
            batches.push(getDocs(query(spacesCollection, where("id", "in", batch))));
        }

        const snapshots = await Promise.all(batches) as any[];
        return snapshots.flatMap((snapshot) =>
            snapshot.docs.map((doc: any) => Space.fromPersistence({ id: doc.id, ...doc.data() }))
        );
    }
}
