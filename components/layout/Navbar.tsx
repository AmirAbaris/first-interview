"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Crypto News
        </Link>
        <nav>
          <div className="flex space-x-4">
            {isLoading ? (
              <Loader2 className="animate-spin h-8 w-8" />
            ) : !user ? (
              <>
                <Link href="/log-in">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Avatar>
                <AvatarFallback>
                  {user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
