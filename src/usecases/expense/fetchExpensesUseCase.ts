import type { ExpenseRepository } from "../../domain/expense/ExpenseRepository";
import { Expense } from "../../domain/expense/Expense";

export const fetchExpensesUseCase = async (
  repository: ExpenseRepository
): Promise<Expense[]> => {
  return repository.fetchExpenses();
};
