const toDate = (value: unknown): Date => {
    if (value instanceof Date) {
        return value;
    }

    if (value && typeof value === "object" && "toDate" in value && typeof (value as any).toDate === "function") {
        return (value as any).toDate();
    }

    if (typeof value === "string") {
        const result = new Date(value);
        return Number.isNaN(result.getTime()) ? new Date() : result;
    }

    return new Date();
};

type SpaceProps = {
    id: number;
    name: string;
    isActive: boolean;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date | null;
    modifiedBy: string | null;
};

type NewSpaceParams = {
    name: string;
    createdBy: string;
};

const generateSpaceId = (): number => {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
};

export class Space {
    readonly id: number;
    readonly name: string;
    readonly isActive: boolean;
    readonly createdOn: Date;
    readonly createdBy: string;
    readonly modifiedOn: Date | null;
    readonly modifiedBy: string | null;

    private constructor(props: SpaceProps) {
        this.id = props.id;
        this.name = props.name;
        this.isActive = props.isActive;
        this.createdOn = props.createdOn;
        this.createdBy = props.createdBy;
        this.modifiedOn = props.modifiedOn;
        this.modifiedBy = props.modifiedBy;
    }

    static createNew(params: NewSpaceParams): Space {
        const trimmedName = params.name.trim();
        const trimmedCreatedBy = params.createdBy.trim();

        if (!trimmedName) {
            throw new Error("Space name is required.");
        }

        if (trimmedName.length > 100) {
            throw new Error("Space name must be 100 characters or fewer.");
        }

        if (!trimmedCreatedBy) {
            throw new Error("CreatedBy is required.");
        }

        return new Space({
            id: generateSpaceId(),
            name: trimmedName,
            isActive: true,
            createdOn: new Date(),
            createdBy: trimmedCreatedBy,
            modifiedOn: null,
            modifiedBy: null,
        });
    }

    static fromPersistence(raw: Record<string, unknown>): Space {
        const id = Number(raw.id ?? 0);
        const name = String(raw.name ?? "");
        const isActive = raw.isActive === false ? false : true;
        const createdOn = toDate(raw.createdOn);
        const createdBy = String(raw.createdBy ?? "");
        const modifiedOn = raw.modifiedOn == null ? null : toDate(raw.modifiedOn);
        const modifiedBy = raw.modifiedBy == null ? null : String(raw.modifiedBy);

        return new Space({
            id,
            name,
            isActive,
            createdOn,
            createdBy,
            modifiedOn,
            modifiedBy,
        });
    }

    toPersistence() {
        return {
            name: this.name,
            isActive: this.isActive,
            createdOn: this.createdOn,
            createdBy: this.createdBy,
            modifiedOn: this.modifiedOn,
            modifiedBy: this.modifiedBy,
        };
    }
}
