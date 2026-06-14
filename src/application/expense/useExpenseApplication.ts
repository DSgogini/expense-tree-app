import { useCallback, useEffect, useState } from "react";
import { Expense } from "../../domain/expense/Expense";
import { ExpenseFirestoreRepository } from "../../infrastructure/expense/ExpenseFirestoreRepository";
import type { CategoryRepository } from "../../domain/category/CategoryRepository";
import { CategoryFirestoreRepository } from "../../infrastructure/category/CategoryFirestoreRepository";
import { addExpenseUseCase } from "../../usecases/expense/addExpenseUseCase";
import { fetchExpensesBySpaceUseCase } from "../../usecases/expense/fetchExpensesBySpaceUseCase";
import { addCategoryUseCase } from "../../usecases/category/addCategoryUseCase";
import { fetchCategoriesUseCase } from "../../usecases/category/fetchCategoriesUseCase";
import { Category } from "../../domain/category/Category";

const expenseRepository = new ExpenseFirestoreRepository();
const categoryRepository: CategoryRepository = new CategoryFirestoreRepository();

const nowLocalDateTime = (): string => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now.getTime() - tzOffset).toISOString();
  return localISO.slice(0, 16);
};

export const useExpenseApplication = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(nowLocalDateTime());
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const docs = await fetchCategoriesUseCase(categoryRepository);
      setCategories(docs);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, []);

  const loadExpenses = useCallback(async (spaceId: number) => {
    setError("");
    setLoading(true);

    try {
      const docs = await fetchExpensesBySpaceUseCase(expenseRepository, spaceId);
      setExpenses(docs);
    } catch (err) {
      console.error("Error loading expenses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const submitExpense = useCallback(
    async (createdBy: string, spaceId: number) => {
      const trimmedDescription = description.trim();
      let trimmedCategory = category.trim();
      const numericAmount = Number(amount);

      if (!trimmedDescription) {
        setError("Description is required.");
        return;
      }

      if (!trimmedCategory) {
        trimmedCategory = "Uncategorized";
      }

      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError("Enter a valid amount greater than 0.");
        return;
      }

      if (!expenseDate.trim()) {
        setError("Date is required.");
        return;
      }

      try {
        setError("");
        setLoading(true);

        let categoryId = categories.find(
          (existing) => existing.name.toLowerCase() === trimmedCategory.toLowerCase()
        )?.id;

        if (!categoryId) {
          const newCategory = Category.createNew({
            name: trimmedCategory,
            createdBy,
          });
          await addCategoryUseCase(categoryRepository, newCategory);
          await loadCategories();
          categoryId = newCategory.id;
        }

        const selectedDate = new Date(expenseDate);
        if (Number.isNaN(selectedDate.getTime())) {
          setError("Invalid date. Please select a valid date and time.");
          return;
        }

        const expense = Expense.createNew({
          description: trimmedDescription,
          amount: numericAmount,
          categoryId,
          spaceId,
          createdBy,
          expenseDate: selectedDate,
        });

        await addExpenseUseCase(expenseRepository, expense);
        setDescription("");
        setAmount("");
        setCategory("");
        setExpenseDate(nowLocalDateTime());
        await loadExpenses();
      } catch (err) {
        console.error("Error saving expense:", err);
        setError("Unable to save expense. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [description, amount, category, expenseDate, categories, loadExpenses, loadCategories]
  );

  return {
    description,
    amount,
    category,
    expenseDate,
    categories,
    expenses,
    loading,
    error,
    setDescription,
    setAmount,
    setCategory,
    setExpenseDate,
    setError,
    loadExpenses,
    submitExpense,
  };
};
