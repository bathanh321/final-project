"use client"

import { Poppins } from "next/font/google";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import Image from "next/image";
import { auth } from "@/auth";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

const font = Poppins({
  subsets: ['latin'],
  weight: ["600"],
})

export default function Home() {
  const user = useCurrentUser();

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/hero.svg" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Học, rèn luyện và làm chủ ngôn ngữ mới cùng Sololingo.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          {!user ? (
            <>
              <Link href="/auth/register">
                <Button size="lg" variant="secondary">
                  Bắt đầu thôi!
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="primaryOutline">
                  Tôi đã có tài khoản
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/learn">
              <Button size="lg" variant="secondary" className="w-full">
                Tiếp tục học
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
