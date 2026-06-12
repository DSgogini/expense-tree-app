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

export type CategoryProps = {
    id: string;
    name: string;
    createdBy: string;
    createdDate: Date;
};

type NewCategoryParams = {
    name: string;
    createdBy: string;
};

export class Category {
    readonly id: string;
    readonly name: string;
    readonly createdBy: string;
    readonly createdDate: Date;

    private constructor(props: CategoryProps) {
        this.id = props.id;
        this.name = props.name;
        this.createdBy = props.createdBy;
        this.createdDate = props.createdDate;
    }

    static createNew(params: NewCategoryParams): Category {
        const trimmedName = params.name.trim();
        const trimmedCreatedBy = params.createdBy.trim();

        if (!trimmedName) {
            throw new Error("Category name is required.");
        }

        if (!trimmedCreatedBy) {
            throw new Error("CreatedBy is required.");
        }

        return new Category({
            id: crypto.randomUUID(),
            name: trimmedName,
            createdBy: trimmedCreatedBy,
            createdDate: new Date(),
        });
    }

    static fromPersistence(raw: Record<string, unknown>): Category {
        const id = String(raw.id ?? "");
        const name = String(raw.name ?? "");
        const createdBy = String(raw.createdBy ?? "");
        const createdDate = toDate(raw.createdDate);

        return new Category({
            id,
            name,
            createdBy,
            createdDate,
        });
    }

    toPersistence() {
        return {
            id: this.id,
            name: this.name,
            createdBy: this.createdBy,
            createdDate: this.createdDate,
        };
    }
}
