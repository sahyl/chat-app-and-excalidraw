"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 from lucide-react (shadcn uses this)
import { Button } from "./ui/button";

const AuthPage = ({ isSignin }: { isSignin: boolean }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const backendUrl = "http://localhost:3001";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return
    setLoading(true);
    setError("");
    try {
      const endpoint = isSignin
        ? `${backendUrl}/api/user/signin`
        : `${backendUrl}/api/user/signup`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignin ? { username, password } : { username, email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {

        setError(data.user.error || "Something went wrong ");
        return;
      }
      console.log(error)

      if (isSignin && data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push(isSignin ? "/create-room" : "/signin");
    } catch (error) {
      console.log(error);
      setError("Network error , try again later");
    } finally {
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-card rounded-lg shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          {isSignin ? "Sign In " : "Sign up"}
        </h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {!isSignin && (
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="username"
            placeholder="your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0.25  flex items-center text-muted-forceground hiver:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="text-white" size={18} />
              ) : (
                <Eye className="text-white" size={18} />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : isSignin ? "Sign in" : "Sign up"}
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;
