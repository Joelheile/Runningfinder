import toast from "react-hot-toast";

const useApproveClub = (clubId: string) => {
  const approveClub = async (clubId: string) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Club approved successfully!");
      } else {
        toast.error("Failed to approve club.");
      }
    } catch (error) {
      toast.error("Error approving club.");
    }
  };

  return approveClub;
};

export default useApproveClub;
