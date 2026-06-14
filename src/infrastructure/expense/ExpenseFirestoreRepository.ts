import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase";
import type { ExpenseRepository } from "../../domain/expense/ExpenseRepository";
import { Expense } from "../../domain/expense/Expense";

const expensesCollection = collection(db, "expenses");

export class ExpenseFirestoreRepository implements ExpenseRepository {
  async addExpense(expense: Expense): Promise<void> {
    await addDoc(expensesCollection, expense.toPersistence());
  }

  async fetchExpenses(): Promise<Expense[]> {
    const expensesQuery = query(expensesCollection, orderBy("createdDate", "desc"));
    const snapshot = await getDocs(expensesQuery);

    return snapshot.docs.map((doc) =>
      Expense.fromPersistence({ id: doc.id, ...doc.data() })
    );
  }

  async fetchExpensesBySpace(spaceId: number): Promise<Expense[]> {
    const expensesQuery = query(
      expensesCollection,
      where("spaceId", "==", spaceId),
      orderBy("createdDate", "desc")
    );
    const snapshot = await getDocs(expensesQuery);

    return snapshot.docs.map((doc) =>
      Expense.fromPersistence({ id: doc.id, ...doc.data() })
    );
  }
}
