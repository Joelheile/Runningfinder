export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-red-600">
          Authentication Error
        </h2>
        <p className="text-center text-gray-600">
          {searchParams.error || "An error occurred during authentication"}
        </p>
      </div>
    </div>
  );
}
