import { Registration } from "@/lib/types/Registration";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchRegistrationByUserId = async (
  userId: string,
): Promise<Registration[]> => {
  const response = await fetch(`/api/registrations/user/${userId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

function useFetchRegistrationByUser(userId: string) {
  const queryClient = useQueryClient();

  return useQuery<Registration[], Error>({
    queryKey: ["registrations", userId],
    queryFn: () => fetchRegistrationByUserId(userId),
    enabled: !!userId,
  });
}

export { useFetchRegistrationByUser };
