const useApproveClub = () => {
  const approveClub = async (slug: string) => {
    try {
      const response = await fetch(`/api/clubs/${slug}/approve`, {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve club");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return approveClub;
};

export default useApproveClub;
