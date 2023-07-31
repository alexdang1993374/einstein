import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Landing Page (Unprotected)</p>

      <div>
        <Link href="/sign-in">
          <Button>Log in</Button>
        </Link>

        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  );
}
