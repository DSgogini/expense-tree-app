import { collection, doc, getDocs, query, setDoc, where, getDoc, limit } from "firebase/firestore";
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

        // Fetch by document ID directly (more efficient than querying)
        const spaces: Space[] = [];

        for (const spaceId of spaceIds) {
            try {
                const spaceDoc = doc(spacesCollection, String(spaceId));
                const snapshot = await getDoc(spaceDoc);

                if (snapshot.exists()) {
                    spaces.push(Space.fromPersistence({ id: snapshot.id, ...snapshot.data() }));
                }
            } catch (error) {
                console.error(`Error fetching space ${spaceId}:`, error);
            }
        }

        return spaces;
    }
}
