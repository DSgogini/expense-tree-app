import type { SpaceRepository } from "../../domain/space/SpaceRepository";
import type { SpaceMemberRepository } from "../../domain/space_member/SpaceMemberRepository";
import { Space } from "../../domain/space/Space";

export const fetchSpacesForUserUseCase = async (
    spaceRepository: SpaceRepository,
    memberRepository: SpaceMemberRepository,
    userId: string
): Promise<Space[]> => {
    const memberships = await memberRepository.fetchSpaceMembersByUser(userId);
    const spaceIds = memberships.map((member) => member.spaceId);
    if (spaceIds.length === 0) {
        return [];
    }
    return spaceRepository.fetchSpacesByIds(spaceIds);
};
