"use client";

import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    router.push(user.role === "editor" ? "/editor/conventions" : "/editor/dashboard");
  }, [router]);

  return null;
}
