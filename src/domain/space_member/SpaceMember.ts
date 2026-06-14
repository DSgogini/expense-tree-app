export type SpaceMemberProps = {
    userId: string;
    spaceId: number;
};

type NewSpaceMemberParams = {
    userId: string;
    spaceId: number;
};

export class SpaceMember {
    readonly userId: string;
    readonly spaceId: number;

    private constructor(props: SpaceMemberProps) {
        this.userId = props.userId;
        this.spaceId = props.spaceId;
    }

    static createNew(params: NewSpaceMemberParams): SpaceMember {
        const trimmedUserId = params.userId.trim();

        if (!trimmedUserId) {
            throw new Error("User ID is required for space membership.");
        }

        if (!Number.isFinite(params.spaceId) || params.spaceId <= 0) {
            throw new Error("Space ID is required for space membership.");
        }

        return new SpaceMember({
            userId: trimmedUserId,
            spaceId: params.spaceId,
        });
    }

    static fromPersistence(raw: Record<string, unknown>): SpaceMember {
        const userId = String(raw.userId ?? "");
        const spaceId = Number(raw.spaceId ?? 0);

        return new SpaceMember({
            userId,
            spaceId,
        });
    }

    toPersistence() {
        return {
            userId: this.userId,
            spaceId: this.spaceId,
        };
    }
}
