import { collection, addDoc, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { db } from "../../firebase";
import type { ExpenseRepository } from "../../domain/expense/ExpenseRepository";
import { Expense } from "../../domain/expense/Expense";

const expensesCollection = collection(db, "expenses");

export class ExpenseFirestoreRepository implements ExpenseRepository {

  async addExpense(expense: Expense): Promise<void> {
    await addDoc(expensesCollection, expense.toPersistence());
  }

  fetchExpenses(): Promise<Expense[]> {
    throw new Error("Method not implemented.");
  }

  async fetchExpensesBySpace(spaceId: number, startDate: string, endDate: string): Promise<Expense[]> {
    const expensesQuery = query(
      expensesCollection,
      where("spaceId", "==", spaceId),
      where("expenseDate", ">=", startDate),
      where("expenseDate", "<=", endDate),
      orderBy("expenseDate", "desc"),
      limit(1000)
    );
    const snapshot = await getDocs(expensesQuery);

    return snapshot.docs.map((doc) =>
      Expense.fromPersistence({ id: doc.id, ...doc.data() })
    );
  }
}
