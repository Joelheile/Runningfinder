import { signIn } from "next-auth/react";


export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        const formObject = Object.fromEntries(formData.entries());
        await signIn("resend", formObject);
      }}
    >
      <input type="text" name="email" placeholder="Email" />
      <button type="submit">Signin with Resend</button>
    </form>
  );
}
