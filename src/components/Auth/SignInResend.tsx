import { signIn } from "next-auth/react";

export function SignIn() {
  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("github")}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
      >
        Sign in with GitHub
      </button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const email = new FormData(form).get("email");
          await signIn("resend", { email });
        }}
        className="space-y-2"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded-lg border px-4 py-2"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Sign in with Email
        </button>
      </form>
    </div>
  );
}
