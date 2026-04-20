"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
 import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  ChevronDown,
  ChevronUp,
  StarsIcon,
  Route,
  Users,
  Menu,
  X,
} from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const { user } = useUser();

 

const router = useRouter();

const handleProtectedRoute = (path) => {
  router.push(path);
};

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo4.png"
            alt="PrepX Logo"
            width={200}
            height={60}
            className="h-8 md:h-12 w-auto"
          />
          <span className="text-xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text">
            PrepX
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Industry Analytics
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setToolkitOpen(!toolkitOpen)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <StarsIcon className="h-4 w-4" />
                    Career Toolkit
                  </span>
                  {toolkitOpen ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <button onClick={() => handleProtectedRoute("/resume")}>
                    Build Resume
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button onClick={() => handleProtectedRoute("/ai-cover-letter")}>
                    Cover Letter
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button onClick={() => handleProtectedRoute("/ai-chat-dashboard")}>
                    AI Career Coach
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button onClick={() => handleProtectedRoute("/ai-roadmap-generator")}>
                    AI Roadmap
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button onClick={() => handleProtectedRoute("/tools/ai-assessments")}>
                    MCQ Practice
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <SignedIn>
            
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Industry Analytics
              </Button>
            </Link>

            <div>
              <button
                onClick={() => setToolkitOpen(!toolkitOpen)}
                className="w-full flex items-center justify-between px-3 py-2 border rounded-lg text-black bg-white"
              >
                <span className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  Career Toolkit
                </span>
                {toolkitOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {toolkitOpen && (
                <div className="mt-2 ml-4 space-y-2">

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleProtectedRoute("/resume")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Build Resume
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleProtectedRoute("/ai-cover-letter")}
                  >
                    <PenBox className="h-4 w-4 mr-2" />
                    Cover Letter
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleProtectedRoute("/ai-chat-dashboard")}
                  >
                    <StarsIcon className="h-4 w-4 mr-2" />
                    AI Career Coach
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleProtectedRoute("/ai-roadmap-generator")}
                  >
                    <Route className="h-4 w-4 mr-2" />
                    AI Roadmap
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleProtectedRoute("/tools/ai-assessments")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    MCQ Practice
                  </Button>

                </div>
              )}
            </div>

            <div className="pt-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button className="w-full">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
