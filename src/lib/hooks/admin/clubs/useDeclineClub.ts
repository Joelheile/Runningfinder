import toast from "react-hot-toast";

const useDeclineClub = (slug: string) => {
  const declineClub = async () => {
    try {
      const response = await fetch(`/api/clubs/${slug}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Club declined successfully!");
      } else {
        toast.error("Failed to decline club.");
      }
    } catch (error) {
      toast.error("Error declining club.");
    }
  };

  return declineClub;
};

export default useDeclineClub;
