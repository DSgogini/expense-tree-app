import type { SpaceMemberRepository } from "../../domain/space_member/SpaceMemberRepository";
import { SpaceMember } from "../../domain/space_member/SpaceMember";

export const addSpaceMemberUseCase = async (
    repository: SpaceMemberRepository,
    member: SpaceMember
): Promise<void> => {
    await repository.addSpaceMember(member);
};
