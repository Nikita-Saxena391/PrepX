"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingScehma } from "../models/schema/schema";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import { Label } from "@/src/components/ui/label";
import Image from "next/image";
import { Input } from "./ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "./ui/button";

import useFetch from "../hooks/use-fetch";
import { updateUser } from "../actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OnboardingForm = () => {
  const subIndustries = [
    "Software Development",
    "IT Services",
    "Cybersecurity",
    "Cloud Computing",
    "Artificial Intelligence/Machine Learning",
    "Data Science & Analytics",
    "Internet & Web Services",
    "Robotics",
    "Quantum Computing",
    "Blockchain & Cryptocurrency",
    "IoT (Internet of Things)",
    "Virtual/Augmented Reality",
    "Semiconductor & Electronics",
  ];

  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(onboardingScehma),
  });

  const toKebabCase = (str) => {
    return str.toLowerCase().trim().replace(/\s+/g, "-");
  };

  const onSubmit = async (values) => {
    try {
      const skillsArray = (values.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const formattedSubIndustry = toKebabCase(values.subIndustry);
      const combinedIndustry = `tech-${formattedSubIndustry}`;

      await updateUserFn({
        experience: values.experience,
        bio: values.bio,
        industry: combinedIndustry,
        skills: skillsArray,
      });
    } catch (error) {
      console.log("onboarding error", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  return (
    <div className="min-h-screen w-full flex justify-center">
      <Card className="w-full max-w-lg mt-10 mx-2 h-fit bg-muted/40 border-l-white text-white">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex flex-row gap-2 w-fit bg-gray-950 p-3 rounded-full">
              <Image src="/logo.png" alt="logo" height={32} width={38} />
              <h2 className="text-primary-100">InterviewX</h2>
            </div>
          </div>

          <div className="text-center">
            <CardTitle className="gradient-title text-4xl font-bold">
              Build your InterviewX profile
            </CardTitle>
            <CardDescription className="text-lg mt-1 text-white">
              Choose your Specialization to unlock personalized career insights
              and tailored recommendations
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Specialization */}
            <div>
              <Label className="mb-2 mt-2">Specialization</Label>

              <Controller
                name="subIndustry"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>

                    <SelectContent className="bg-black">
                      {subIndustries.map((sub) => (
                        <SelectItem value={sub} key={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.subIndustry && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.subIndustry.message}
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-4">
              <Label className="mb-2">Year of Experience</Label>
              <Input
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="mb-4">
              <Label className="mb-2">Skills</Label>
              <Input
                placeholder="eg C++, Java, Python"
                {...register("skills")}
              />
              <p className="text-sm mt-1 text-amber-400">
                Mention all your skills separated by commas.
              </p>

              {errors.skills && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-4">
              <Label className="mb-2">Professional Bio</Label>
              <Textarea
                className="h-32"
                placeholder="Briefly describe your experience"
                {...register("bio")}
              />

              {errors.bio && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="btn-primary w-full cursor-pointer"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Complete your profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
