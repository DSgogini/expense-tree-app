import { Expense } from "./Expense";

export interface ExpenseRepository {
  addExpense(expense: Expense): Promise<void>;
  fetchExpenses(): Promise<Expense[]>;
  fetchExpensesBySpace(spaceId: number): Promise<Expense[]>;
}
