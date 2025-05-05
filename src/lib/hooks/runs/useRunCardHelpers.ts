import toast from "react-hot-toast";
import { useCancelRegistration } from "../registrations/useCancelRegistration";
import { useRegisterRun } from "../registrations/useRegisterRun";

export function getMapsLink(
  providedLink: string | null | undefined,
  lat: number | undefined,
  lng: number | undefined,
  description: string = "",
): string | null {
  if (providedLink) return providedLink;

  if (lat && lng) {
    return `https://www.google.com/maps/search/${encodeURIComponent(description)}/@${lat},${lng},15z`;
  }

  return null;
}

export async function registerForRun(
  runId: string,
  userId: string,
  setLoading: (state: boolean) => void,
  registerMutation: ReturnType<typeof useRegisterRun>,
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
  setLoading: (state: boolean) => void,
  cancelMutation: ReturnType<typeof useCancelRegistration>,
  externalHandler?: (runId: string) => void,
) {
  setLoading(true);

  try {
    if (externalHandler) {
      externalHandler(runId);
    } else {
      await cancelMutation.mutateAsync({ runId, userId });
    }
  } catch (error) {
    toast.error("Error unregistering from run");
  } finally {
    setLoading(false);
  }
}
