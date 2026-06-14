import type { SpaceMemberRepository } from "../../domain/space_member/SpaceMemberRepository";
import { SpaceMember } from "../../domain/space_member/SpaceMember";

export const fetchSpaceMembersByUserUseCase = async (
    repository: SpaceMemberRepository,
    userId: string
): Promise<SpaceMember[]> => {
    return repository.fetchSpaceMembersByUser(userId);
};
