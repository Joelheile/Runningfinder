import { AdapterUser } from "@auth/core/adapters";
import { DefaultSession } from "next-auth";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    isAdmin: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
  
  interface User extends AdapterUser {}
}
