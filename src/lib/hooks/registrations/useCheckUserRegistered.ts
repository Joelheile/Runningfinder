import { useRegistrations } from "./useRegistrations";

interface UseCheckUserRegisteredParams {
  userId?: string;
  runId: string;
}

/**
 * @deprecated Use useRegistrations().checkRegistrationStatus instead
 */
export function useCheckUserRegistered({ userId, runId }: UseCheckUserRegisteredParams) {
  console.warn(
    "useCheckUserRegistered is deprecated. Please use useRegistrations().checkRegistrationStatus instead."
  );
  
  const { checkRegistrationStatus } = useRegistrations();
  return checkRegistrationStatus({ userId, runId });
} 