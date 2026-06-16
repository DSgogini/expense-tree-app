import type { ExpenseRepository } from "../../domain/expense/ExpenseRepository";
import { Expense } from "../../domain/expense/Expense";

export const fetchExpensesBySpaceUseCase = async (
    repository: ExpenseRepository,
    spaceId: number,
    startDate: Date,
    endDate: Date
): Promise<Expense[]> => {
    return repository.fetchExpensesBySpace(spaceId, startDate, endDate);
};
