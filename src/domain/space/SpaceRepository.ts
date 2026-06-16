import { Space } from "./Space";

export interface SpaceRepository {
    addSpace(space: Space): Promise<void>;
    fetchSpacesByIds(spaceIds: number[]): Promise<Space[]>;
}
