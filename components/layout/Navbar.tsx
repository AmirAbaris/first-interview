"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const { setUser } = useAuthContext();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Crypto News
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex space-x-4">
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
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarFallback>
                      {user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col space-y-3" side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              {isLoading ? (
                <Loader2 className="animate-spin h-8 w-8 mx-auto" />
              ) : !user ? (
                <>
                  <Link href="/log-in" className="block py-2">
                    Log In
                  </Link>
                  <Link href="/sign-up" className="block py-2">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="block py-2">
                    Profile
                  </Link>
                  <Button onClick={handleLogout} className="block w-full mt-4">
                    Log Out
                  </Button>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
