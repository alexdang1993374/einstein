import AuthLayout from "@/components/AuthLayout";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}
