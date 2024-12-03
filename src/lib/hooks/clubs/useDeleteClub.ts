import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const deleteClub = async (clubId: string): Promise<void> => {

    const router = useRouter();
    const response = await fetch(`/api/clubs`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: clubId }),
    });
  
    if (!response.ok) {
      toast.error('Failed to delete club');
      throw new Error('Failed to delete club');
    }
  
    toast.success('Club deleted successfully');
    router.push('/clubs');
  };
  
  export function useDeleteClub() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteClub,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clubs'] });
      },
    });
  }