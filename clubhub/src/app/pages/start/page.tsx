import AppIcon from "@/src/components/icons/AppIcon";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import React from "react";

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 -mt-40">
      <div className="w-56 h-56">
        <AppIcon />
      </div>

      <div className="flex flex-col w-full items-center space-y-4 pt-10">
        <div>
          <h1>Welcome to ClubHub!</h1>
        </div>
        <div className="w-1/2">
        <Link href="/pages/signup">
          <Button variant={"default"} className="w-full">Sign up</Button>
          </Link>
        </div>
        <div className="w-1/2">
        <Link href="/pages/login">
          <Button variant={"outline"} className="w-full">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPage;