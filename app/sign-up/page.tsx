"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import createUser from "./action";
import { z } from "zod";
import { userSchema } from "@/lib/user";
import SignUpForm from "@/components/forms/SignUpForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: (data: z.infer<typeof userSchema>) => createUser(data),
    onSuccess: () => {
      setDialogMessage("Account created successfully!");
      setDialogOpen(true);
    },
    onError: () => {
      setDialogMessage("An error occurred. Please try again.");
      setDialogOpen(true);
    },
  });

  const handleSubmit = (values: z.infer<typeof userSchema>) => {
    setDialogMessage(null);
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center h-screen px-4 md:px-0">
      <Card className="w-full md:w-96">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMessage === "Account created successfully!"
                ? "Success"
                : "Error"}
            </DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
