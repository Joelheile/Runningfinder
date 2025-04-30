"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function ErrorHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      if (error === "adminRequired") {
        toast.error("You need to be logged in as an admin to access this page");
        toastShownRef.current = true;

        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        router.replace(url.pathname + url.search);
      }
    }
  }, [error, router]);

  return null;
}
