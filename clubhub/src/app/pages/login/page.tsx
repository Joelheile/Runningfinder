import AppIcon from "@/src/components/icons/AppIcon";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 -mt-32">
      <div className="w-56 h-56">
        <AppIcon />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>Welcome back!</h1>
        <p>Ready for your next run?!</p>
      </div>

      <div className="flex flex-col w-full items-center space-y-4 pt-10">
        <div className="w-2/3 space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" placeholder="" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">E-Mail</Label>
            <Input type="email" id="email" placeholder="" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="" />
          </div>
        </div>

        <div className="pt-5  w-2/3 ">
          <Button variant={"default"} className="w-full">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
