import { supabase } from "../lib/supabase";

export default function useAuth() {
  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    // 1. First Attempt: Assume they are a returning user
    const firstTry = await supabase.auth.verifyOtp({
      email,
      token,
      type: "magiclink",
    });

    // If successful, we're done!
    if (!firstTry.error) return firstTry;

    // 2. Second Attempt: If first failed, they might be a new user
    // We only retry if the error suggests a potential type mismatch
    const secondTry = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    // 3. The Verdict
    if (secondTry.error) {
      // If BOTH failed, it's almost certainly a "User Typed it Wrong" situation.
      // You can return the second error, which will say "Token is invalid"
      return { session: null, error: secondTry.error };
    }

    return secondTry;
  };

  return {
    signInWithOtp,
    verifyOtp,
  };
}
