"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasBothPasswords = password.length > 0 && confirmPassword.length > 0;
  const passwordsMatch = hasBothPasswords && password === confirmPassword;
  const showMismatch = hasBothPasswords && password !== confirmPassword;

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      first_name: String(formData.get("first_name") || ""),
      last_name: String(formData.get("last_name") || ""),
      email: String(formData.get("email") || ""),
      password,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/auth/register", payload);

      if (response.status === 201) {
        toast.success("Account created successfully");
        e.currentTarget.reset();
        setPassword("");
        setConfirmPassword("");
        router.push("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Signup failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Signup failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={register}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-serif font-bold">Register your account</h1>
        {/* <p className="text-balance text-sm font-sans text-foreground">
                    Enter the details below to register your account
                </p> */}
      </div>
      <div className="grid gap-6 font-sans text-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="email">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Ravi"
              className="border border-black/30"
              required
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="email">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Shankar"
              className="border border-black/30"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            className="border border-black/30"
            required
          />
        </div>
        {/* <div className="grid gap-2">
                    <Label htmlFor="email">Date of Birth</Label>
                    <Input
                        id="dob"
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="border border-black/30"
                        required
                    />
                </div> */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            className="border border-black/30"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirm-password">Confirm Password</Label>
          </div>
          <Input
            id="confirm-password"
            type="password"
            className="border border-black/30"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={showMismatch}
            required
          />
          {passwordsMatch && (
            <p className="text-sm text-emerald-600">Passwords match</p>
          )}
          {showMismatch && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                className="border border-black/30"
                placeholder="18"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="border border-black/30 bg-inherit rounded-md p-2 text-sm text-slate-500"
                required
              >
                <option value="">Pick your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-medium bg-sky-600"
          disabled={isSubmitting || showMismatch}
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
