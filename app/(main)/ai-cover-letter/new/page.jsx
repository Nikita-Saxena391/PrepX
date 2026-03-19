import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-6">
      {/* Back button on left */}
      <div className="flex justify-start mb-6">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
      </div>

      {/* Centered heading and paragraph */}
      <div className="text-center pb-6">
        <h1 className="text-6xl font-bold gradient-title">
          Create Cover Letter
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate a tailored cover letter for your job application
        </p>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}