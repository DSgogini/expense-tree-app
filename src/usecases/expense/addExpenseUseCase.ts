import type { ExpenseRepository } from "../../domain/expense/ExpenseRepository";
import { Expense } from "../../domain/expense/Expense";

export const addExpenseUseCase = async (
  repository: ExpenseRepository,
  expense: Expense
): Promise<void> => {
  await repository.addExpense(expense);
};
