import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [invalid, setInvalid] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log("Sign Up Request:", data);
      const res = await fetch(`${backendUrl}/auth/signup`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data), // {email: string, password: string, confirmPassword: string}
      })

      const result = await res.json()
      console.log("Signup Response:", result);

      if (res.ok){
        navigate("/"); // Redirect to homepage after signup
      } else{
        console.error("Sign Up failed:", result);
      }
    } catch (e) {
      setInvalid(true);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="flex flex-row justify-between">
              Email
              {invalid ? <p className="text-red-400">Email already in use</p> : null }
            </Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {String(errors.confirmPassword.message)}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
