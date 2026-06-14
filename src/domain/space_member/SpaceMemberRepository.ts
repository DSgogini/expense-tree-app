import { SpaceMember } from "./SpaceMember";

export interface SpaceMemberRepository {
    addSpaceMember(member: SpaceMember): Promise<void>;
    fetchSpaceMembersByUser(userId: string): Promise<SpaceMember[]>;
    fetchSpaceMembersBySpace(spaceId: number): Promise<SpaceMember[]>;
}
