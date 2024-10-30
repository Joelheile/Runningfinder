import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminPage = () => {
  const id = 1;

  return (
    <div className="w-full p-8">
      <nav className="flex justify-between mb-10">
        <div className="flex">
          <ChevronLeft className="stroke-primary stroke" />
          <span className="Back text-primary">Back</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/pages/club/${id}/edit`}></Link>
        </div>
      </nav>
      <div className="  justify-center place-items-center space-y-6">
        <Image src={""} width={50} height={50} alt={""} />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="clubName">Name</Label>
          <Input type="clubName" id="clubMail" placeholder="Running Club" />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="clubDescription">Description</Label>
          <Input
            type="clubDescription"
            id="clubDescription"
            placeholder="You should join us because of x"
          />
        </div>
        <hr />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="clubInstagram">Instagram Username</Label>
          <Input
            type="clubInstagram"
            id="clubInstagram"
            placeholder="@username"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="website">Website</Label>
          <Input type="website" id="website" placeholder="runningfinder.com" />
        </div>
      </div>
      <div className="absolute bottom-4 w-full  items-center ">
        <Button variant={"default"} className="w-2/3">
          Add run
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
