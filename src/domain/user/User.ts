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

export type UserProps = {
  id: string;
  displayName: string;
  email: string;
  createdDate: Date;
};

type NewUserParams = {
  id: string;
  displayName: string;
  email: string;
};

export class User {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly createdDate: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.displayName = props.displayName;
    this.email = props.email;
    this.createdDate = props.createdDate;
  }

  static createNew(params: NewUserParams): User {
    const displayName = params.displayName?.trim() || "";
    const email = params.email?.trim() || "";

    if (!email) {
      throw new Error("User email is required.");
    }

    return new User({
      id: params.id,
      displayName: displayName || email,
      email,
      createdDate: new Date(),
    });
  }

  static fromPersistence(raw: Record<string, unknown>): User {
    const id = String(raw.id ?? "");
    const displayName = String(raw.displayName ?? "");
    const email = String(raw.email ?? "");
    const createdDate = toDate(raw.createdDate);

    return new User({
      id,
      displayName,
      email,
      createdDate,
    });
  }

  toPersistence() {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      createdDate: this.createdDate,
    };
  }
}
