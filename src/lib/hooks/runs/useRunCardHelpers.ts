import toast from "react-hot-toast";
import { useCancelRegistration } from "../registrations/useCancelRegistration";
import { useRegisterRun } from "../registrations/useRegisterRun";


export function getMapsLink(
  providedLink: string | null | undefined,
  lat: number,
  lng: number,
  description: string
): string | null {
  if (providedLink) return providedLink;
  
  return lat && lng
    ? `https://www.google.com/maps/search/${encodeURIComponent(description)}/@${lat},${lng},15z`
    : null;
}


export async function registerForRun(
  runId: string,
  userId: string,
  setLoading: (state: boolean) => void,
  registerMutation: ReturnType<typeof useRegisterRun>,
  refetchFn: () => Promise<any>
) {
  setLoading(true);
  try {
    await registerMutation.mutateAsync({ runId, userId });
  } catch (error) {
    toast.error("Error registering for run");
  } finally {
    setLoading(false);
  }
}


export async function unregisterFromRun(
  runId: string,
  userId: string,
  externalHandler: ((runId: string) => void) | undefined,
  setLoading: (state: boolean) => void,
  cancelMutation: ReturnType<typeof useCancelRegistration>,
  refetchFn: () => Promise<any>
) {
  setLoading(true);
  try {
    if (externalHandler) {
      externalHandler(runId);
      await refetchFn();
    } else {
      await cancelMutation.mutateAsync({ runId, userId });
    }
  } catch (error) {
    toast.error("Error unregistering from run");
  } finally {
    setLoading(false);
  }
} 