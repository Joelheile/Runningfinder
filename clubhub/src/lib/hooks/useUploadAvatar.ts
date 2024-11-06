import { Avatar } from "@/lib/types/Avatar";
import { Club } from "@/lib/types/Club";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";

const uploadAvatar = async (newAvatar: Avatar): Promise<Avatar> => {
  // TODO: refactor AvatarUploader to this hook
  const response = await fetch("/api/v1/aws/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      avatarFileId: v4(),
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to add club");
  }
  return response.json();
};

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation<Avatar, Error, Avatar>({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
    },
  });
}
