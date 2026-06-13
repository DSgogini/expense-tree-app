import { useEffect, useMemo, useState, type FormEvent } from "react";
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

  const [monthOffset, setMonthOffset] = useState(0);

  const userNameById = useMemo(
    () => new Map(users.map((currentUser) => [currentUser.id, currentUser.displayName])),
    [users]
  );

  const viewMonthDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [monthOffset]);

  const formatMonthHeading = (date: Date) =>
    date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const getWeekStart = (value: Date) => {
    const date = new Date(value);
    const day = date.getDay();
    const diff = (day + 6) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatWeekHeading = (weekStart: Date) => {
    const now = new Date();
    const currentWeekStart = getWeekStart(now);
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    if (weekStart.getTime() === currentWeekStart.getTime()) {
      return "This week";
    }
    if (weekStart.getTime() === lastWeekStart.getTime()) {
      return "Last week";
    }

    return `Week of ${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  };

  const formatExpenseDate = (date: Date) => ({
    day: date.toLocaleDateString(undefined, { day: "numeric" }),
    month: date.toLocaleDateString(undefined, { month: "short" }),
    time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true }),
  });

  const expensesForMonth = useMemo(
    () =>
      expenses.filter((expense) => {
        const date = expense.expenseDate ?? expense.createdDate;
        return date.getMonth() === viewMonthDate.getMonth() && date.getFullYear() === viewMonthDate.getFullYear();
      }),
    [expenses, viewMonthDate]
  );

  const groupedExpenses = useMemo(() => {
    return expensesForMonth.reduce((groups, expense) => {
      const weekKey = getWeekStart(expense.expenseDate ?? expense.createdDate).toISOString();
      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(expense);
      return groups;
    }, {} as Record<string, typeof expenses>);
  }, [expensesForMonth]);

  const sortedWeekKeys = useMemo(
    () =>
      Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
    [groupedExpenses]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-4 shadow-xl shadow-slate-200/50">
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
              <section className="rounded-3xl bg-slate-50 p-2 shadow-sm">
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
                    <p className="mt-2 text-sm text-slate-500">
                      Selected date: {expenseDate ? new Date(expenseDate).toLocaleString() : "Current time will be used"}
                    </p>
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

              <section className="rounded-3xl bg-slate-50 p-2 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Expenses</h2>
                    <p className="text-sm text-slate-500">Showing expenses for {formatMonthHeading(viewMonthDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {monthOffset !== 0 ? (
                      <button
                        type="button"
                        onClick={() => setMonthOffset(0)}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Back to current month
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setMonthOffset((prev) => prev - 1)}
                      className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                      ← Previous month
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-slate-600">Loading expenses...</p>
                ) : expensesForMonth.length === 0 ? (
                  <p className="text-slate-600">No expenses for this month. Add one above or switch to a different month.</p>
                ) : (
                  <div className="space-y-6">
                    {sortedWeekKeys.map((weekKey) => {
                      const weekStart = new Date(weekKey);
                      const weekLabel = formatWeekHeading(weekStart);
                      const group = groupedExpenses[weekKey] ?? [];

                      return (
                        <div key={weekKey} className="space-y-4">
                          <div className="sticky top-6 z-10 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200/50">
                            {weekLabel}
                          </div>
                          <div className="space-y-4">
                            {group.map((expense) => {
                              const expenseDateValue = expense.expenseDate ?? expense.createdDate;
                              const formattedDate = formatExpenseDate(expenseDateValue);
                              const categoryName = categories.find((item) => item.id === expense.categoryId)?.name || "Uncategorized";

                              return (
                                <article
                                  key={expense.id}
                                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                                >
                                  <div className="flex gap-3 p-2 flex-row items-center">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-center text-white">
                                      <div>
                                        <span className="block text-xl font-semibold leading-none">{formattedDate.day}</span>
                                        <span className="block font-semibold text-[11px] uppercase tracking-[0.24em] text-slate-300">{formattedDate.month}</span>
                                      </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-4">
                                        <p className="min-w-0 truncate text-sm font-semibold text-slate-900">{expense.description}</p>
                                      </div>
                                      <p className="mt-2 text-xs text-slate-500">{categoryName}</p>
                                      <p className="mt-1 truncate text-xs text-slate-500">By {userNameById.get(expense.createdBy) ?? expense.createdBy}</p>
                                    </div>

                                    <div className="flex flex-col items-end justify-center gap-2 text-right">
                                      <p className="truncate text-lg font-bold text-slate-900">₹{expense.amount}</p>
                                      <p className="text-xs text-slate-500">{formattedDate.time}</p>
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
