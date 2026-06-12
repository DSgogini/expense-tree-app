import { useCallback, useEffect, useState } from "react";
import { Expense } from "../../domain/expense/Expense";
import { ExpenseFirestoreRepository } from "../../infrastructure/expense/ExpenseFirestoreRepository";
import type { CategoryRepository } from "../../domain/category/CategoryRepository";
import { CategoryFirestoreRepository } from "../../infrastructure/category/CategoryFirestoreRepository";
import { addExpenseUseCase } from "../../usecases/expense/addExpenseUseCase";
import { fetchExpensesUseCase } from "../../usecases/expense/fetchExpensesUseCase";
import { addCategoryUseCase } from "../../usecases/category/addCategoryUseCase";
import { fetchCategoriesUseCase } from "../../usecases/category/fetchCategoriesUseCase";
import { Category } from "../../domain/category/Category";

const expenseRepository = new ExpenseFirestoreRepository();
const categoryRepository: CategoryRepository = new CategoryFirestoreRepository();

export const useExpenseApplication = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const docs = await fetchCategoriesUseCase(categoryRepository);
      setCategories(docs);
      if (docs.length > 0 && !selectedCategory) {
        setSelectedCategory(docs[0].id);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, [selectedCategory]);

  const loadExpenses = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const docs = await fetchExpensesUseCase(expenseRepository);
      setExpenses(docs);
    } catch (err) {
      console.error("Error loading expenses:", err);
      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback(
    async (createdBy: string) => {
      const trimmedName = newCategoryName.trim();
      if (!trimmedName) {
        setError("Enter a category name before saving.");
        return;
      }

      if (categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase())) {
        const existing = categories.find((category) => category.name.toLowerCase() === trimmedName.toLowerCase());
        if (existing) {
          setSelectedCategory(existing.id);
        }
        setNewCategoryName("");
        return;
      }

      try {
        setError("");
        setLoading(true);

        const category = Category.createNew({ name: trimmedName, createdBy });
        await addCategoryUseCase(categoryRepository, category);
        setNewCategoryName("");
        await loadCategories();
        setSelectedCategory(category.id);
      } catch (err) {
        console.error("Error adding category:", err);
        setError("Unable to save category. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [newCategoryName, categories, loadCategories]
  );

  const submitExpense = useCallback(
    async (createdBy: string) => {
      if (!description.trim() || !amount.trim()) {
        setError("Please provide both description and amount.");
        return;
      }

      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Enter a valid amount greater than 0.");
        return;
      }

      if (!selectedCategory.trim()) {
        setError("Select a category before saving.");
        return;
      }

      try {
        setError("");
        setLoading(true);

        const expense = Expense.createNew({
          description: description.trim(),
          amount: parsedAmount,
          categoryId: selectedCategory.trim(),
          createdBy,
        });

        await addExpenseUseCase(expenseRepository, expense);
        setDescription("");
        setAmount("");
        await loadExpenses();
      } catch (err) {
        console.error("Error submitting expense:", err);
        setError("Unable to save expense. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [description, amount, selectedCategory, loadExpenses]
  );

  return {
    description,
    amount,
    selectedCategory,
    categories,
    newCategoryName,
    expenses,
    loading,
    error,
    setDescription,
    setAmount,
    setSelectedCategory,
    setNewCategoryName,
    setError,
    loadExpenses,
    submitExpense,
    addCategory,
  };
};
