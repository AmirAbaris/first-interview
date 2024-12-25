"use client";

import { useMutation } from "@tanstack/react-query";
import LoginForm from "@/components/forms/LoginForm";
import { login } from "./action";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (values: { email: string; password: string }) => login(values),
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/");
    },
    onError: (err: Error) => {
      setSuccess(false);
      setError("Invalid credentials. Please try again.");
      console.error(err);
    },
  });

  const handleSubmit = (values: { email: string; password: string }) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen px-4 md:px-0">
        <div className="w-full md:w-96">
          <LoginForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 mt-2">Logged in successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
}
