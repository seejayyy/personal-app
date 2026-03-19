import { useState } from "react";
import useAuth from "../hooks/useAuth"; // Your custom hook
import { useNavigate } from "@tanstack/react-router";
import z from "zod";
import { toast } from "sonner";

const emailSchema = z.email("Invalid email address");

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate({ from: "/auth/login" });

  const { signInWithOtp } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const email = formData.get("email");
    const validatedEmail = emailSchema.safeParse(email);

    if (!validatedEmail.success) {
      toast.error("Invalid email address");
    } else {
      const { error } = await signInWithOtp(validatedEmail.data);

      if (error) {
        toast.error(error.message);
      } else {
        navigate({
          to: "/auth/verify",
          state: (prev: any) => ({ ...prev, email: validatedEmail.data }),
        });
      }
    }

    setLoading(false);
  };

  return (
    <form action={handleSubmit}>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Welcome Back</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="w-full p-2 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Log In"}
        </button>
      </div>
    </form>
  );
}
