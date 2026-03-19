"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetterServerAction } from "@/actions/cover-letter-actions";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const coverLetter = await generateCoverLetterServerAction(data);
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${coverLetter.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Grid Background */}
      <div className="grid-background fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></div>

      {/* Form Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="Enter job title"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here"
              className="h-32"
              {...register("jobDescription")}
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-500">{errors.jobDescription.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}