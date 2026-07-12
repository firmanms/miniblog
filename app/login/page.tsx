import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="flex h-[80vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" className="grid gap-4" action={login}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {resolvedParams.error && (
              <div className="text-sm font-medium text-destructive">
                {resolvedParams.error}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button form="login-form" type="submit" className="w-full">
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
