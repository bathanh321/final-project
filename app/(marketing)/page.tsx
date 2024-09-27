import { Poppins } from "next/font/google";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ['latin'],
  weight: ["600"],
})

export default function Home() {
  return (
    <main>
      This is a marketing page
    </main>
  );
}
