import { useEffect, useMemo, type FormEvent } from "react";
import { useAuthApplication } from "./application/auth/useAuthApplication";
import { useExpenseApplication } from "./application/expense/useExpenseApplication";
import { useUserApplication } from "./application/user/useUserApplication";

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
    expenseDate,
    categories,
    expenses,
    loading: expenseLoading,
    error: expenseError,
    setDescription,
    setAmount,
    setCategory,
    setExpenseDate,
    loadExpenses,
    submitExpense,
  } = useExpenseApplication();

  const {
    users,
    loadingUsers,
    userError,
  } = useUserApplication(user);

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

    if (!user.uid) {
      setAuthError("Unable to determine user ID. Please sign in again.");
      return;
    }

    await submitExpense(user.uid);
  };

  const currentError = authError || expenseError || userError;
  const loading = authLoading || expenseLoading || loadingUsers;

  const userNameById = useMemo(
    () => new Map(users.map((currentUser) => [currentUser.id, currentUser.displayName])),
    [users]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
          {loading && <p className="text-slate-600">Loading...</p>}
          {currentError && <p className="text-red-600 mb-4">{currentError}</p>}

          {!user ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="rounded-2xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Sign in with Google
            </button>
          ) : (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Signed in as</p>
                  <p className="text-slate-700">{user.displayName || user.email || user.uid}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {user && (
            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <section className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Coffee, groceries, rent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Amount</label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date</label>
                    <input
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      type="datetime-local"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Type a category name"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      Suggestions are shown while typing; a new category will be created automatically on save.
                    </p>
                    {matchedCategories.length > 0 && (
                      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Suggested categories</p>
                        <div className="grid gap-2">
                          {matchedCategories.slice(0, 5).map((suggestion) => (
                            <button
                              key={suggestion.id}
                              type="button"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                              onClick={() => setCategory(suggestion.name)}
                            >
                              {suggestion.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Save expense
                  </button>
                </form>
              </section>

              <section className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-semibold text-slate-900">Expenses</h2>
                {loading ? (
                  <p className="text-slate-600">Loading expenses...</p>
                ) : expenses.length === 0 ? (
                  <p className="text-slate-600">No expenses yet. Add one above.</p>
                ) : (
                  <ul className="space-y-3">
                    {expenses.map((expense) => (
                      <li key={expense.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{expense.description}</p>
                            <p className="text-sm text-slate-500">
                              Added by: {userNameById.get(expense.createdBy) ?? expense.createdBy}
                            </p>
                            <p className="text-sm text-slate-500">
                              Category: {categories.find((category) => category.id === expense.categoryId)?.name || expense.categoryId}
                            </p>
                          </div>
                          <span className="text-lg font-semibold text-slate-800">₹{expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="mt-3 text-sm text-slate-500">
                          {expense.expenseDate.toLocaleString()}
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
    </div>
  );
}

export default App;
