"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  ChevronDown,
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
            className="h-8 md:h-12 w-auto object-contain"
          />
          <span className="text-xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text">
            PrepX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            {/* Dashboard */}
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Industry Analytics
              </Button>
            </Link>

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  Career Toolkit
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/ai-cover-letter" className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/ai-chat-dashboard" className="flex items-center gap-2">
                    <StarsIcon className="h-4 w-4" />
                    AI Career Coach
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/ai-roadmap-generator" className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    AI Roadmap Generator
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/tools/ai-assessments" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    MCQ Practice
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
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
              <Button className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Industry Analytics
              </Button>
            </Link>

            <Link href="/resume">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Build Resume
              </Button>
            </Link>

            <Link href="/ai-cover-letter">
              <Button variant="outline" className="w-full justify-start">
                <PenBox className="h-4 w-4 mr-2" />
                Cover Letter
              </Button>
            </Link>

            <Link href="/ai-chat-dashboard">
              <Button variant="outline" className="w-full justify-start">
                <StarsIcon className="h-4 w-4 mr-2" />
                AI Career Coach
              </Button>
            </Link>

            <Link href="/ai-roadmap-generator">
              <Button variant="outline" className="w-full justify-start">
                <Route className="h-4 w-4 mr-2" />
                AI Roadmap Generator
              </Button>
            </Link>

            <Link href="/tools/ai-assessments">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                MCQ Practice
              </Button>
            </Link>

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
