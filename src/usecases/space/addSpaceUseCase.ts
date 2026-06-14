import type { SpaceRepository } from "../../domain/space/SpaceRepository";
import { Space } from "../../domain/space/Space";

export const addSpaceUseCase = async (
    repository: SpaceRepository,
    space: Space
): Promise<void> => {
    await repository.addSpace(space);
};
