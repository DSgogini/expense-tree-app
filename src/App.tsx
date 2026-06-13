import { useEffect, useMemo, type FormEvent } from "react";
import { useAuthApplication } from "./application/auth/useAuthApplication";
import { useExpenseApplication } from "./application/expense/useExpenseApplication";

function App() {
  const {
    user,
    loading: authLoading,
    error: authError,
    setError: setAuthError,
    signIn,
    signOut,
  } = useAuthApplication();

  const {
    description,
    amount,
    category,
    categories,
    expenses,
    loading: expenseLoading,
    error: expenseError,
    setDescription,
    setAmount,
    setCategory,
    loadExpenses,
    submitExpense,
  } = useExpenseApplication();

  const matchedCategories = useMemo(() => {
    const search = category.trim().toLowerCase();
    if (!search) {
      return [];
    }

    return categories.filter((existing) =>
      existing.name.toLowerCase().includes(search)
    );
  }, [category, categories]);

  useEffect(() => {
    if (user) {
      void loadExpenses();
    }
  }, [user, loadExpenses]);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError("");
      await signIn();
    } catch {
      // auth hook already sets the error
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthError("");
      await signOut();
    } catch {
      // auth hook already sets the error
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setAuthError("You must be signed in to add an expense.");
      return;
    }

    const createdBy = user.email?.trim() || user.uid;
    await submitExpense(createdBy);
  };

  const currentError = authError || expenseError;
  const loading = authLoading || expenseLoading;

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-screen bg-gray-100 rounded-lg p-6 shadow-sm">
        <header className="">
        </header>

        {loading && <p className="text-gray-600">Loading...</p>}

        {currentError && <p className="text-red-600 mb-4">{currentError}</p>}

        {!user ? (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="mb-6 rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold">Signed in as</p>
                <p className="text-gray-700">{user.displayName || user.email || user.uid}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {user && (
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <section className="rounded bg-white p-4 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Coffee, groceries, rent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Type a category name"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Existing categories are suggested while typing; a new category will be created when the expense is saved.
                  </p>
                  {matchedCategories.length > 0 && (
                    <div className="mt-2 grid gap-1">
                      {matchedCategories.slice(0, 5).map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="text-left text-sm text-gray-700 underline hover:text-gray-900"
                          onClick={() => setCategory(suggestion.name)}
                        >
                          {suggestion.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </form>
            </section>

            <section className="rounded bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold">Expenses</h2>
              {loading ? (
                <p className="text-gray-600">Loading expenses...</p>
              ) : expenses.length === 0 ? (
                <p className="text-gray-600">No expenses yet. Add one above.</p>
              ) : (
                <ul className="space-y-3">
                  {expenses.map((expense) => (
                    <li key={expense.id} className="rounded border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>{expense.description}</strong>
                          <div className="text-sm text-gray-500">Created by {expense.createdBy}</div>
                          <div className="text-sm text-gray-500">
                            Category: {categories.find((category) => category.id === expense.categoryId)?.name || expense.categoryId}
                          </div>
                        </div>
                        <span className="text-gray-700">${expense.amount.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {expense.createdDate.toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
