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
    <main className="flex h-full flex-col items-center justify-center bg-[#131f24]">
      <div className="space-y-6">
        <h1 className={cn(
          "text-6xl font-semibold text-white drop-shadow-md",
          font.className,
        )}>
          🔐 Auth
        </h1>
        <p>
          Simple authentication service
        </p>
        <div>
          <LoginButton>
            <Button variant="primary" size="lg" className="w-full">
              Log in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
