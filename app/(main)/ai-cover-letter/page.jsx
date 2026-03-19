import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="relative">
      {/* Grid background */}
      <div className="grid-background"></div>

      {/* Content wrapper */}
      <div className="relative z-10 px-4">
        {/* Heading */}
        <div className="text-center my-8">
          <h1 className="text-6xl font-bold gradient-title">
            My Cover Letters
          </h1>
        </div>

        {/* Button */}
        <div className="flex justify-center md:justify-end mb-5">
          <Link href="/ai-cover-letter/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Cover letter list */}
        <CoverLetterList coverLetters={coverLetters} />
      </div>
    </div>
  );
}