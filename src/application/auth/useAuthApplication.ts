import { useCallback, useEffect, useState } from "react";
import { auth, signInWithGoogle, signOutFirebase, type User } from "../../firebase";

export const useAuthApplication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Check your Firebase settings.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      await signOutFirebase();
    } catch (err) {
      console.error("Sign-out error:", err);
      setError("Sign-out failed. Try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    setError,
    signIn,
    signOut,
  };
};
