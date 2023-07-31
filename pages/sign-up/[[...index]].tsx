import AuthLayout from "@/components/AuthLayout";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}
