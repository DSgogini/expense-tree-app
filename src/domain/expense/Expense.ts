export type ExpenseProps = {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  isActive: boolean;
  createdDate: Date;
  expenseDate: Date;
  createdBy: string;
  modifiedDate: Date | null;
  modifiedBy: string | null;
};

type NewExpenseParams = {
  description: string;
  amount: number;
  categoryId: string;
  createdBy: string;
  expenseDate?: Date;
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof (value as any).toDate === "function") {
    return (value as any).toDate();
  }

  if (typeof value === "string") {
    const result = new Date(value);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  return null;
};

export class Expense {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly categoryId: string;
  readonly isActive: boolean;
  readonly createdDate: Date;
  readonly expenseDate: Date;
  readonly createdBy: string;
  readonly modifiedDate: Date | null;
  readonly modifiedBy: string | null;

  private constructor(props: ExpenseProps) {
    this.id = props.id;
    this.description = props.description;
    this.amount = props.amount;
    this.categoryId = props.categoryId;
    this.isActive = props.isActive;
    this.createdDate = props.createdDate;
    this.expenseDate = props.expenseDate;
    this.createdBy = props.createdBy;
    this.modifiedDate = props.modifiedDate;
    this.modifiedBy = props.modifiedBy;
  }

  static createNew(params: NewExpenseParams): Expense {
    const trimmedDescription = params.description.trim();
    const trimmedCreatedBy = params.createdBy.trim();

    const trimmedCategoryId = params.categoryId.trim();

    if (!trimmedDescription) {
      throw new Error("Expense description is required.");
    }

    if (Number.isNaN(params.amount) || params.amount <= 0) {
      throw new Error("Expense amount must be greater than zero.");
    }

    if (!trimmedCategoryId) {
      throw new Error("Expense category is required.");
    }

    if (!trimmedCreatedBy) {
      throw new Error("CreatedBy is required.");
    }

    return new Expense({
      id: crypto.randomUUID(),
      description: trimmedDescription,
      amount: params.amount,
      categoryId: trimmedCategoryId,
      isActive: true,
      createdDate: new Date(),
      expenseDate: params.expenseDate ?? new Date(),
      createdBy: trimmedCreatedBy,
      modifiedDate: null,
      modifiedBy: null,
    });
  }

  static fromPersistence(raw: Record<string, unknown>): Expense {
    const id = String(raw.id ?? "");
    const description = String(raw.description ?? "");
    const amount = Number(raw.amount ?? 0);
    const categoryId = String(raw.categoryId ?? "");
    const isActive = raw.isActive === false ? false : true;
    const createdDate = toDate(raw.createdDate) ?? new Date();
    const expenseDate = toDate(raw.expenseDate) ?? new Date();
    const createdBy = String(raw.createdBy ?? "");
    const modifiedDate = toDate(raw.modifiedDate);
    const modifiedBy = raw.modifiedBy == null ? null : String(raw.modifiedBy);

    return new Expense({
      id,
      description,
      amount,
      categoryId,
      isActive,
      createdDate,
      expenseDate,
      createdBy,
      modifiedDate,
      modifiedBy,
    });
  }

  toPersistence() {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      categoryId: this.categoryId,
      isActive: this.isActive,
      createdDate: this.createdDate,
      expenseDate: this.expenseDate,
      createdBy: this.createdBy,
      modifiedDate: this.modifiedDate,
      modifiedBy: this.modifiedBy,
    };
  }
}
